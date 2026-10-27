# CÓBANO Cloud — versión 2.3.0 · PWA para Android

Aplicación web progresiva de campo para inventarios forestales y registros biológicos. Incluye el logotipo CÓBANO, una pantalla de apertura animada y una interfaz adaptable a pantalla de teléfono.

## Archivos

- `index.html`: aplicación y lógica de captura.
- `manifest.webmanifest`: identidad PWA, iconos y modo de instalación.
- `sw.js`: caché de la aplicación y de librerías auxiliares para uso sin conexión tras la primera carga.
- `icon-192.png` y `icon-512.png`: iconos suministrados.

## Publicar en Netlify

1. Extrae el ZIP en una carpeta de tu computadora.
2. En Netlify, crea un sitio mediante despliegue manual y arrastra la carpeta con `index.html`, `manifest.webmanifest`, `sw.js` y los iconos a la zona de despliegue.
3. Abre la URL HTTPS generada en el teléfono Android. La ubicación GPS y la instalación PWA necesitan un contexto seguro (HTTPS o localhost).
4. En Chrome para Android, abre el menú `⋮` y selecciona **Instalar aplicación** o **Agregar a pantalla principal**, según la opción que muestre el navegador.
5. Para publicar una versión nueva, vuelve a desplegar los archivos. La nueva versión del service worker actualiza la caché.

**Importante:** Netlify aloja la aplicación web; no compila por sí solo un APK firmado. Esta entrega es una PWA instalable en Android. Para distribuir un archivo `.apk` será necesario envolverla con Capacitor o una herramienta equivalente y compilar/firmar el proyecto Android.

## Funciones de esta versión

- Proyectos separados por área **Forestal** y **Biología**.
- Tres formas de empezar: captura manual sin archivos; capa de puntos con detección automática de número de sitio; y polígono para generar sitios.
- Importación KML, KMZ, SHP directo y ZIP de shapefile. Para mantener atributos y proyección, se recomienda importar un ZIP con `.shp`, `.shx`, `.dbf` y `.prj`.
- Coordenadas geográficas y conversión a UTM. La zona puede fijarse manualmente o calcularse desde las coordenadas del primer sitio.
- Captura por sitio, estado de avance, notas, fotos con sello visual de sitio/fecha/coordenadas y visualización de las evidencias en el mapa.
- Autocompletado con nombres científicos y comunes de EncicloVida/CONABIO y NaturaLista/iNaturalist cuando hay internet; las especies seleccionadas se guardan en el catálogo local. El catálogo local puede importarse/exportarse como CSV.
- Copiar registros para conservar especie y otros datos, limpiando DAP y altura para la nueva medición.
- Columnas configurables; reordenamiento con flechas, posición numérica o arrastre cuando el dispositivo lo admita.
- Cálculos de área basal y volumen de referencia; columna IVI por especie disponible para el módulo forestal y tabla de resultados.
- Tamaño muestral con corrección por población finita, método de distribución sistemático o aleatorio, separación mínima y numeración consecutiva o aleatoria.
- Exportación KML, KMZ con fotos incluidas cuando tienen coordenadas, ZIP SHP (puntos y polígono en capas separadas) y CSV.
- Guardado local automático mediante IndexedDB, respaldo JSON del proyecto o de todos los proyectos, y restauración/importación de respaldos.
- Pantalla de equipo con GPS del teléfono y lista local de brigadistas/asignaciones.

## Límites que deben conocerse

- **Nombres científicos y comunes:** el catálogo local no contiene literalmente todas las especies existentes. En línea se intentan consultar EncicloVida/CONABIO y NaturaLista/iNaturalist. La conexión a las APIs puede depender de CORS, disponibilidad del servicio o parámetros que cambien; la sugerencia taxonómica no sustituye la identificación de campo.
- **Identificación por foto:** la foto queda guardada como evidencia con coordenadas cuando están disponibles, pero esta versión no clasifica automáticamente una especie a partir de la imagen. Para eso se necesita integrar un modelo/servicio de visión y sus credenciales.
- **Nube sincronizada:** el guardado local es automático; un respaldo JSON puede guardarse manualmente en Drive u otra nube. La sincronización automática entre varios teléfonos requiere una base de datos remota, autenticación y reglas de acceso.
- **Ubicación de otros brigadistas y radio:** la pantalla de equipo no simula una conexión activa. Compartir posiciones en tiempo real y usar comunicación tipo radio requiere backend de tiempo real y señalización de voz WebRTC, además de permisos y pruebas de seguridad.
- **Mapa base y catálogos en línea:** las teselas cartográficas y las consultas a CONABIO/NaturaLista requieren internet. La app conserva los datos locales; el mapa puede quedar sin fondo cartográfico al perder conexión.
- **Diseño de muestreo:** el área del polígono se estima en un plano local y la fórmula usa el CV proporcionado por un muestreo piloto. Revisa precisión, supuestos estadísticos, tamaño de parcela, distribución de sitios y criterios del estudio antes de reportar resultados.
- **Volumen:** el factor de forma inicial `0.6` es solo un valor de referencia editable. Debe ajustarse a la especie y a la metodología del inventario.
- **Respaldo:** los datos quedan en el almacenamiento del navegador de ese dispositivo. Descargar un respaldo periódico sigue siendo recomendable; borrar datos del navegador puede eliminar el almacenamiento local.

## Formato CSV del catálogo de especies

Dos columnas en este orden: `Nombre científico,Nombre común`. La primera fila puede llevar encabezados. La app acepta un CSV para importar y genera un CSV para exportar el catálogo.


## Actualización 2.1.0 — catálogo de especies y tutorial

- Se usa el logo proporcionado por el usuario en los iconos PWA y la pantalla de inicio.
- Se agregó un tutorial accesible desde el botón **Ayuda** y desde Inicio.
- Los modos de puntos numerados/no numerados se unificaron: al importar KML/KMZ o ZIP SHP, la app intenta extraer el número del nombre del elemento y de los atributos `ExtendedData`/DBF. Si no encuentra ninguno, pregunta por el número inicial o por claves aleatorias.
- El autocompletado consulta en línea EncicloVida/CONABIO (`api.enciclovida.mx/v2/autocompleta/especies`) y NaturaLista/iNaturalist (`api.inaturalist.org/v1/taxa/autocomplete`). Los taxones seleccionados se agregan al catálogo local; no se descarga todo el catálogo nacional ni se garantiza que todas las APIs respondan desde cualquier navegador.
- Fuente de referencia de CONABIO: Catálogo Taxonómico de la Biota en México y EncicloVida. NaturaLista se consulta a través del API público de iNaturalist. Se recomienda verificar las identificaciones en campo.


## Actualización 2.3.0 — hora automática en Biología

- Se conserva la interfaz visual de la versión CÓBANO Cloud 2.1.x: portada, tarjetas, colores, navegación inferior, mapa, tutorial y módulos Forestal/Biología.
- En proyectos de Biología, al agregar o copiar una observación se asignan automáticamente fecha y hora local (HH:mm:ss), marca de tiempo ISO, zona horaria y desfase UTC del dispositivo.
- La fecha y hora se muestran como columnas del sistema de solo lectura; se pueden reordenar, pero no eliminar.
- Los proyectos existentes reciben las nuevas columnas al abrirse. Los registros previos no reciben una hora inventada y aparecen como “Sin dato”.
- El CSV de registros incluye los campos automáticos y metadatos de hora; la exportación KML incluye cada observación biológica en las coordenadas del sitio, con fecha y hora.
- El reloj y zona horaria corresponden al teléfono al momento de pulsar Agregar registro o Copiar registro. Si el reloj del dispositivo está mal configurado, la marca local reflejará esa configuración.
