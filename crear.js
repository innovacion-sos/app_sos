const { encode } = require('./_token');
const s = (v, n = 80) => String(v || '').replace(/[<>]/g, '').trim().slice(0, n);
const list = v => (Array.isArray(v) ? v : String(v || '').split(',')).map(x => s(x, 60)).filter(Boolean).slice(0, 12);
const phone = v => {
  let t = String(v || '').replace(/[^\d+]/g, '');
  if (/^\d{10}$/.test(t)) t = '+52' + t;           // 10 dígitos = México
  return /^\+\d{10,15}$/.test(t) ? t : null;
};
module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const b = req.body || {};
  const contacts = (Array.isArray(b.contacts) ? b.contacts : []).slice(0, 3)
    .map(c => ({ name: s(c.name, 50), rel: s(c.rel, 30), phone: phone(c.phone) }))
    .filter(c => c.name && c.phone);
  if (!s(b.name) || !contacts.length) return res.status(400).json({ error: 'Falta tu nombre o al menos un contacto con teléfono válido.' });
  const p = {
    name: s(b.name), age: parseInt(b.age) || '', role: s(b.role, 40), city: s(b.city, 50),
    blood: s(b.blood, 5) || '?', allergies: list(b.allergies), conditions: list(b.conditions), meds: list(b.meds),
    insurance: s(b.insurance) ? { name: s(b.insurance), policy: s(b.policy, 30) } : null, contacts
  };
  try {
    res.json({ url: `https://${req.headers.host}/t/${encode(p)}` });
  } catch { res.status(500).json({ error: 'Servidor sin configurar: agrega la variable TOKEN_SECRET en Vercel.' }); }
};
