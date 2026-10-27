# CÓBANO Cloud v2.2.0

Aplicación web progresiva (PWA) para inventarios forestales y registros biológicos en Android.

## Archivos del proyecto

- `index.html`: interfaz y módulos principales de la app.
- `bio.js`: registro de fauna, fecha/hora automática, diversidad y exportación CSV/KML.
- `team.js`: funciones opcionales de equipo, sincronización, ubicación y mensajes de voz.
- `sw.js`: service worker y caché de la aplicación.
- `manifest.webmanifest`: configuración de instalación PWA.
- `icon-192.png` y `icon-512.png`: iconos de CÓBANO.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube **todos los archivos de esta carpeta directamente a la raíz del repositorio** (no subas el ZIP dentro del repositorio).
3. En el repositorio entra a **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**, elige `main` y la carpeta `/ (root)`, y guarda.
5. Abre la URL HTTPS que proporcione GitHub Pages desde Chrome en Android. Usa el menú de Chrome para instalar/agregar a pantalla principal.

## Hora de registros de fauna

Al pulsar Guardar, `bio.js` captura la hora local del teléfono en formato `HH:mm:ss`, guarda la marca ISO, zona horaria y desfase UTC. CSV y KML incluyen fecha/hora cuando corresponde.

## Configuración importante

- Las funciones compartidas entre teléfonos (equipo, ubicación remota y radio) requieren configurar un proyecto Firebase en `team.js`, habilitar los servicios necesarios y definir reglas de seguridad adecuadas. Los campos de configuración se dejan vacíos deliberadamente; no publiques credenciales privadas.
- La app puede guardar localmente; exporta copias de respaldo con regularidad. Borrar los datos del navegador puede borrar el almacenamiento local.
- Los catálogos y consultas de especies pueden depender de conexión a internet.
- Esta entrega es una PWA instalable, no un APK Android firmado.

## Nota

Revisa la aplicación en un teléfono antes de usarla en levantamientos oficiales; valida las fórmulas y el formato de tus entregables de acuerdo con la metodología del proyecto.
