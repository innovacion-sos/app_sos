# SOS TAG NFC
Al escanear el QR/NFC (`https://TU-DOMINIO/t/7F3A-92C1`) se abre la ficha médica y se envía solo un SMS/WhatsApp con la ubicación GPS a los contactos.

## Estructura
- `index.html`, `style.css`, `script.js`: sitio de presentación + demo
- `t.html`: ficha real que se abre al escanear (ruta `/t/:id`)
- `api/tag.js`: devuelve la ficha · `api/alert.js`: envía los mensajes (Twilio)
- `api/_profiles.js`: perfiles y contactos (cambiar teléfonos reales)

## Despliegue (Vercel)
1. Sube el repo a GitHub e impórtalo en Vercel (Framework "Other", sin build).
2. En Settings → Environment Variables agrega las de `.env.example` (Twilio). Sin ellas corre en MODO PRUEBA (no envía, solo registra en logs).
3. Genera el QR con la URL `https://TU-DOMINIO/t/7F3A-92C1` y grábala en el tag NFC como registro URL (app NFC Tools).
4. Prueba escaneando con iPhone y Android.

## Notas
- La ubicación requiere HTTPS y que la persona toque "Permitir" una vez; si la niega, el mensaje se envía igual, sin ubicación.
- WhatsApp de Twilio: mensajes iniciados por ti requieren plantilla aprobada (o sandbox para pruebas). El SMS funciona siempre.
- Límite: 1 alerta por tag cada 5 min (anti-abuso). Para producción usa Redis/base de datos.
