# CÓBANO Cloud v2.2.0 — actualización de hora automática en fauna

## Cambios principales
- La fecha inicial del registro ahora usa la fecha local del teléfono, evitando el desfase que podía producir `toISOString()` al construir la fecha visible.
- La hora de registro se captura automáticamente al pulsar Guardar y se muestra en formato de 24 horas `HH:mm:ss`.
- La hora se muestra como solo lectura: no hace falta escribirla manualmente.
- Se guarda una marca de tiempo ISO, la zona horaria del dispositivo y el desfase respecto a UTC para trazabilidad.
- Se separan las columnas Fecha y Hora en la lista de observaciones de fauna.
- La exportación CSV incluye fecha, hora local, marca de tiempo ISO, zona horaria y desfase UTC.
- La exportación KML incorpora fecha, hora local y marca de tiempo en la descripción del punto.
- La vista de Equipo sincroniza y muestra la fecha y hora de los registros de fauna.
- La pantalla inicial utiliza los iconos CÓBANO aportados y se renueva el nombre de caché del service worker para forzar actualización.

## Publicar en Netlify
1. Extrae este ZIP.
2. Sube el contenido de esta carpeta directamente a un sitio de Netlify (no subas la carpeta comprimida dentro de otra carpeta).
3. Abre la URL HTTPS en Chrome para Android y selecciona Instalar aplicación / Agregar a pantalla principal.

## Notas
- La hora utiliza el reloj y la zona horaria configurados en el teléfono.
- La marca de tiempo representa el momento en que se inicia el guardado; la fecha de observación puede corregirse manualmente para capturas registradas posteriormente.
- Para mostrar registros entre dispositivos, Firebase sigue requiriendo la configuración real en `team.js` y las reglas de seguridad del proyecto.
- Como es una PWA, esto no es un APK firmado.
