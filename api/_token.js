// La ficha completa viaja cifrada (AES-256-GCM) dentro del propio enlace del QR/NFC.
// No necesita base de datos y nadie puede falsificar un enlace sin TOKEN_SECRET.
const crypto = require('crypto'), zlib = require('zlib');
const key = () => {
  if (!process.env.TOKEN_SECRET) throw new Error('Falta TOKEN_SECRET');
  return crypto.createHash('sha256').update(process.env.TOKEN_SECRET).digest();
};
exports.encode = o => {
  const iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const enc = Buffer.concat([c.update(zlib.deflateRawSync(JSON.stringify(o))), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), enc]).toString('base64url');
};
exports.decode = t => {
  try {
    const b = Buffer.from(t, 'base64url'), d = crypto.createDecipheriv('aes-256-gcm', key(), b.subarray(0, 12));
    d.setAuthTag(b.subarray(12, 28));
    return JSON.parse(zlib.inflateRawSync(Buffer.concat([d.update(b.subarray(28)), d.final()])).toString());
  } catch { return null; }
};
