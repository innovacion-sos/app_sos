const P = require('./_profiles');
const last = new Map(); // antiabuso (por instancia): 1 alerta por tag cada 5 min
const WAIT = 5 * 60 * 1000;

async function twilio(to, from, body) {
  const sid = process.env.TWILIO_SID, tok = process.env.TWILIO_TOKEN;
  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(sid + ':' + tok).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({ To: to, From: from, Body: body })
  });
  return r.ok;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const t0 = Date.now();
  const { id, lat, lon, acc } = req.body || {};
  const p = P[String(id || '')];
  if (!p) return res.status(404).json({ error: 'not_found' });

  const n = last.get(id);
  if (n && Date.now() - n < WAIT) return res.json({ sent: 0, total: p.contacts.length, throttled: true });
  last.set(id, Date.now());

  const hasLoc = Number.isFinite(+lat) && Number.isFinite(+lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
  const loc = hasLoc
    ? `Ubicación: https://maps.google.com/?q=${(+lat).toFixed(5)},${(+lon).toFixed(5)}${Number.isFinite(+acc) ? ` (±${Math.round(acc)} m)` : ''}`
    : 'Ubicación no disponible (el tag fue escaneado sin permiso de GPS).';
  const hora = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Mexico_City' });
  const body = `🚨 SOS TAG: ${p.name} fue escaneada tras un posible percance (${hora}). ${loc} Tipo ${p.blood}, alergias: ${p.allergies.join(', ')}.`;

  const live = process.env.TWILIO_SID && process.env.TWILIO_TOKEN && process.env.TWILIO_SMS_FROM;
  let sent = 0;
  for (const c of p.contacts) {
    if (!live) { console.log('[DRY RUN]', c.phone, body); sent++; continue; }
    const jobs = [twilio(c.phone, process.env.TWILIO_SMS_FROM, body)];
    if (process.env.TWILIO_WA_FROM)
      jobs.push(twilio('whatsapp:' + c.phone, 'whatsapp:' + process.env.TWILIO_WA_FROM, body));
    const ok = await Promise.all(jobs.map(j => j.catch(() => false)));
    if (ok.some(Boolean)) sent++;
  }
  res.json({ sent, total: p.contacts.length, dry: !live, ms: Date.now() - t0 });
};
