# Guía de Configuración de Catálogos para Marcas

## Ubicación de archivos PDF

Los catálogos PDF deben colocarse en la carpeta: `public/catalogos/`

## Estructura de nombres de archivo

Los archivos PDF actuales en la carpeta son:
- `catalogo cerrajes general.pdf`
- `catalogo cerrajes iluminacion.pdf`
- `catalogo cerrajes industrial.pdf`
- `catalogo cerrajes jaladeras y botones.pdf`
- `catalogo cerrajes lo mas nuevo.pdf`
- `catalogo handyhome.pdf`
- `catalogo sayer.pdf`
- `catalogo silverline.pdf`
- `catalogo truper.pdf`

## Configuración en Firebase

Para que una marca muestre sus catálogos, debe agregar el campo `catalogos` (array de strings) en el documento de la marca en Firestore.

### Ejemplo 1: Marca con un solo catálogo

```javascript
{
  id: "truper",
  name: "Truper",
  logoUrl: "https://...",
  category: "Herramientas",
  active: true,
  catalogos: ["catalogo truper.pdf"]
}
```

### Ejemplo 2: Marca con múltiples catálogos (Cerrajes)

```javascript
{
  id: "cerrajes",
  name: "Cerrajes",
  logoUrl: "https://...",
  category: "Cerrajería",
  active: true,
  catalogos: [
    "catalogo cerrajes general.pdf",
    "catalogo cerrajes iluminacion.pdf",
    "catalogo cerrajes industrial.pdf",
    "catalogo cerrajes jaladeras y botones.pdf",
    "catalogo cerrajes lo mas nuevo.pdf"
  ]
}
```

### Ejemplo 3: Marca HandyHome

```javascript
{
  id: "handyhome",
  name: "HandyHome",
  logoUrl: "https://...",
  category: "Herramientas",
  active: true,
  catalogos: ["catalogo handyhome.pdf"]
}
```

## Cómo actualizar en Firebase Console

1. Ir a Firebase Console → Firestore Database
2. Buscar la colección `brands`
3. Seleccionar el documento de la marca
4. Agregar o editar el campo `catalogos`
5. Tipo: `array`
6. Valores: nombres de archivos PDF (con extensión .pdf)

## Funcionalidad implementada

### Para el usuario:
- Si una marca tiene catálogos configurados, aparece un botón "Ver Catálogo" o "Ver Catálogos"
- Al hacer clic, se abre un visor modal con:
  - Navegación entre páginas
  - Zoom in/out
  - Selector de catálogo (si hay múltiples)
  - Botón de descarga
  - Vista previa del PDF

### Características del visor:
- ✅ Visualización de PDF en el navegador
- ✅ Navegación por páginas (anterior/siguiente)
- ✅ Control de zoom (50% - 200%)
- ✅ Múltiples catálogos con pestañas
- ✅ Descarga del PDF
- ✅ Diseño responsivo
- ✅ Cierre con botón X o clic fuera

## Agregar nuevos catálogos

1. Colocar el archivo PDF en `public/catalogos/`
2. Actualizar el documento de la marca en Firestore
3. Agregar el nombre del archivo al array `catalogos`

## Notas importantes

- Los nombres de archivo deben coincidir exactamente (incluyendo espacios y mayúsculas/minúsculas)
- La ruta es relativa a `/public/catalogos/`
- No es necesario incluir la ruta completa, solo el nombre del archivo
- El campo `catalogos` es opcional - las marcas sin este campo no mostrarán el botón
