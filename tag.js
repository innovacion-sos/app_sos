const P = require('./_profiles');
module.exports = (req, res) => {
  const p = P[String(req.query.id || '')];
  if (!p) return res.status(404).json({ error: 'not_found' });
  res.setHeader('Cache-Control', 'no-store');
  res.json({ ...p, contacts: p.contacts.map(c => ({ name: c.name, rel: c.rel, tel: c.phone })) });
};
