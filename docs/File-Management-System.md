# Sistema de Gestión de Archivos - Ferretería La Michoacana

## Descripción General

El Sistema de Gestión de Archivos proporciona una solución completa para la subida, almacenamiento, organización y gestión de archivos en toda la plataforma. Integra Cloudinary para almacenamiento en la nube y Firestore para metadatos, ofreciendo una experiencia fluida tanto para usuarios como para administradores.

## Características Principales

### 🎯 **Componentes del Sistema**

#### **1. FileUploader.tsx - Componente de Subida**
- **Drag & Drop** intuitivo con validaciones
- **Múltiples formatos** soportados (imágenes, documentos, otros)
- **Validación automática** de tamaño y tipo de archivo
- **Preview en tiempo real** de archivos seleccionados
- **Modo compacto** para espacios reducidos
- **Integración directa** con Cloudinary

#### **2. FileGallery.tsx - Visualización y Gestión**
- **Vista grid y lista** intercambiables
- **Búsqueda y filtros** avanzados
- **Edición de metadatos** (descripción, etiquetas)
- **Acciones contextuales** (ver, descargar, eliminar)
- **Categorización automática** por tipo de archivo
- **Información detallada** de cada archivo

#### **3. FileManager.tsx - Gestión Integrada**
- **Combina uploader y galería** en una interfaz
- **Estadísticas en tiempo real** de uso
- **Configuración flexible** por contexto
- **Permisos granulares** por usuario/rol
- **Metadatos contextuales** automáticos

#### **4. useFileManager.ts - Hook de Gestión**
- **Estado centralizado** de archivos
- **Operaciones CRUD** completas
- **Sincronización automática** con Firestore
- **Manejo de errores** robusto
- **Estadísticas calculadas** en tiempo real

### 📁 **Estructura de Datos**

#### **FileRecord Interface**
```typescript
interface FileRecord {
  id: string                    // ID único en Firestore
  name: string                  // Nombre original del archivo
  size: number                  // Tamaño en bytes
  type: string                  // MIME type
  url: string                   // URL de Cloudinary
  cloudinaryId: string          // ID público de Cloudinary
  uploadedAt: Date             // Fecha de subida
  uploadedBy: string           // ID del usuario
  category: 'image' | 'document' | 'other'
  
  // Metadatos contextuales
  relatedTo?: string           // ID del documento relacionado
  relatedType?: string         // Tipo de relación
  description?: string         // Descripción del archivo
  tags?: string[]             // Etiquetas para búsqueda
  isPublic?: boolean          // Visibilidad pública
}
```

#### **Tipos de Relación Soportados**
- **`contact`** - Archivos de solicitudes de cotización
- **`job_application`** - CVs y documentos de empleo
- **`quotation`** - Archivos de cotizaciones
- **`ticket`** - Archivos de tickets de IT
- **`user_profile`** - Fotos de perfil y documentos personales

### 🔧 **Integración con Módulos Existentes**

#### **1. Formulario de Contacto**
```typescript
// Integración en ContactForm.tsx
<FileManager
  userId="contact-form"
  relatedTo={`contact-${Date.now()}`}
  relatedType="contact"
  maxFiles={5}
  maxFileSize={10}
  acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx']}
  compact={true}
  description="Archivos relacionados con la solicitud de cotización"
  tags={['cotización', 'proyecto']}
/>
```

**Casos de uso**:
- Planos arquitectónicos
- Especificaciones técnicas
- Fotos del proyecto
- Listas de materiales

#### **2. Aplicaciones de Empleo**
```typescript
// Integración en JobApplicationForm.tsx
<FileManager
  userId={user?.uid}
  relatedTo={`job-application-${Date.now()}`}
  relatedType="job_application"
  maxFiles={3}
  maxFileSize={5}
  acceptedTypes={['application/pdf', '.doc', '.docx', 'image/*']}
  tags={['cv', 'empleo', jobTitle]}
/>
```

**Casos de uso**:
- Currículum Vitae
- Carta de presentación
- Certificados y diplomas
- Portafolio de trabajos

#### **3. Panel de Administración**
```typescript
// FileManagementPage.tsx - Vista completa
<FileManager
  userId={user?.uid}
  maxFiles={20}
  maxFileSize={50}
  acceptedTypes={['*']}
  allowUpload={true}
  allowDelete={true}
  allowEdit={true}
  viewMode="list"
/>
```

**Funcionalidades administrativas**:
- Vista de todos los archivos del sistema
- Estadísticas de uso y almacenamiento
- Filtros avanzados por módulo y fecha
- Acciones de limpieza y mantenimiento

### 🎨 **Configuración y Personalización**

#### **Configuración de Cloudinary**
```env
# Variables de entorno requeridas
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

#### **Configuración por Contexto**
```typescript
// Ejemplo de configuración específica
const contactConfig = {
  maxFiles: 5,
  maxFileSize: 10, // MB
  acceptedTypes: ['image/*', 'application/pdf', '.doc', '.docx'],
  folder: 'contact-requests',
  uploadPreset: 'ferreteria_contact'
}

const jobConfig = {
  maxFiles: 3,
  maxFileSize: 5, // MB
  acceptedTypes: ['application/pdf', '.doc', '.docx'],
  folder: 'job-applications',
  uploadPreset: 'ferreteria_jobs'
}
```

### 🔒 **Seguridad y Validaciones**

#### **Validaciones del Cliente**
- **Tamaño máximo** configurable por contexto
- **Tipos de archivo** permitidos por lista blanca
- **Número máximo** de archivos por sesión
- **Validación de MIME type** real vs extensión

#### **Validaciones del Servidor**
```typescript
// API /api/files/delete
export async function DELETE(request: NextRequest) {
  // Verificar autenticación
  // Validar permisos de eliminación
  // Eliminar de Cloudinary
  // Eliminar registro de Firestore
  // Logs de auditoría
}
```

#### **Permisos por Rol**
- **Cliente**: Solo sus propios archivos
- **Vendedor**: Archivos de sus clientes asignados
- **Gerente**: Archivos de su sucursal
- **RRHH**: Archivos de aplicaciones de empleo
- **IT/Admin**: Todos los archivos del sistema

### 📊 **Monitoreo y Estadísticas**

#### **Métricas Disponibles**
```typescript
interface FileStats {
  totalFiles: number           // Total de archivos
  totalSize: number           // Tamaño total en bytes
  byCategory: {               // Archivos por categoría
    image: number
    document: number
    other: number
  }
  averageSize: number         // Tamaño promedio
}
```

#### **Dashboard de Administración**
- **Uso de almacenamiento** con alertas por límites
- **Archivos por módulo** con gráficos
- **Tendencias de subida** por período
- **Archivos huérfanos** sin relación
- **Usuarios más activos** en subidas

### 🔄 **Flujos de Trabajo**

#### **Flujo de Subida de Archivo**
```
1. Usuario selecciona archivos
2. Validación en cliente (tamaño, tipo)
3. Subida a Cloudinary con preset
4. Obtención de URL y public_id
5. Guardado de metadatos en Firestore
6. Actualización de UI en tiempo real
7. Notificación de éxito/error
```

#### **Flujo de Eliminación**
```
1. Usuario solicita eliminación
2. Confirmación de acción
3. Verificación de permisos
4. Eliminación de Cloudinary
5. Eliminación de Firestore
6. Actualización de UI
7. Log de auditoría
```

#### **Flujo de Búsqueda y Filtrado**
```
1. Usuario aplica filtros
2. Query a Firestore con criterios
3. Filtrado adicional en cliente
4. Actualización de resultados
5. Paginación si es necesario
```

### 🎯 **Casos de Uso Específicos**

#### **1. Solicitud de Cotización con Planos**
```typescript
// Cliente sube planos arquitectónicos
const files = await uploadFiles(selectedFiles, {
  relatedTo: 'REQ-2025-001',
  relatedType: 'contact',
  description: 'Planos para construcción de casa',
  tags: ['planos', 'arquitectura', 'construcción'],
  isPublic: false
})
```

#### **2. Aplicación de Empleo Completa**
```typescript
// Candidato sube CV y certificados
const files = await uploadFiles([cvFile, certificateFile], {
  relatedTo: 'APP-2025-001',
  relatedType: 'job_application',
  description: 'Documentos para aplicación de vendedor',
  tags: ['cv', 'certificados', 'vendedor'],
  isPublic: false
})
```

#### **3. Ticket de IT con Capturas**
```typescript
// Usuario reporta problema con capturas
const files = await uploadFiles(screenshots, {
  relatedTo: 'IT-2025-001',
  relatedType: 'ticket',
  description: 'Capturas de pantalla del error',
  tags: ['error', 'sistema', 'captura'],
  isPublic: false
})
```

### 🛠️ **API Endpoints**

#### **DELETE /api/files/delete**
```typescript
// Eliminar archivo de Cloudinary
{
  method: 'DELETE',
  body: { cloudinaryId: 'public_id_del_archivo' }
}
```

**Respuesta exitosa**:
```json
{
  "success": true,
  "message": "Archivo eliminado correctamente"
}
```

### 🎨 **Componentes UI Detallados**

#### **FileUploader - Configuración Avanzada**
```typescript
<FileUploader
  maxFiles={10}                    // Máximo archivos
  maxFileSize={50}                 // MB por archivo
  acceptedTypes={['image/*']}      // Tipos permitidos
  onFilesUploaded={handleUpload}   // Callback de éxito
  onError={handleError}            // Callback de error
  multiple={true}                  // Múltiples archivos
  showPreview={true}               // Mostrar preview
  compact={false}                  // Modo compacto
  uploadPreset="custom_preset"     // Preset de Cloudinary
  folder="custom_folder"           // Carpeta destino
/>
```

#### **FileGallery - Opciones de Vista**
```typescript
<FileGallery
  userId="user123"                 // Filtrar por usuario
  relatedTo="contact123"           // Filtrar por relación
  relatedType="contact"            // Tipo de relación
  allowDelete={true}               // Permitir eliminar
  allowEdit={true}                 // Permitir editar
  viewMode="grid"                  // grid | list
  showFilters={true}               // Mostrar filtros
/>
```

### 📱 **Responsive Design**

#### **Breakpoints Soportados**
- **Mobile** (< 640px): Vista de lista compacta
- **Tablet** (640px - 1024px): Grid de 2 columnas
- **Desktop** (> 1024px): Grid de 3-4 columnas

#### **Optimizaciones Móviles**
- **Touch gestures** para drag & drop
- **Compresión automática** de imágenes grandes
- **Carga progresiva** de thumbnails
- **Interfaz simplificada** en pantallas pequeñas

### 🔧 **Configuración de Desarrollo**

#### **Setup Inicial**
```bash
# Instalar dependencias
npm install cloudinary

# Configurar variables de entorno
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### **Configuración de Cloudinary**
```javascript
// cloudinary.config.js
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
```

#### **Upload Presets Recomendados**
```json
{
  "ferreteria_uploads": {
    "folder": "ferreteria",
    "resource_type": "auto",
    "allowed_formats": ["jpg", "png", "pdf", "doc", "docx"],
    "max_file_size": 10485760,
    "quality": "auto:good"
  }
}
```

### 🚀 **Optimizaciones de Rendimiento**

#### **Lazy Loading**
- **Imágenes** cargadas bajo demanda
- **Thumbnails** generados automáticamente
- **Paginación** para listas grandes
- **Virtual scrolling** en galerías extensas

#### **Caching**
- **Metadatos** cacheados en localStorage
- **URLs** de Cloudinary con TTL
- **Queries** de Firestore optimizadas
- **Debouncing** en búsquedas

### 📋 **Testing y Validación**

#### **Tests Unitarios**
```typescript
// Ejemplo de test para FileUploader
describe('FileUploader', () => {
  it('should validate file size', () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })
    const isValid = validateFileSize(file, 5) // 5MB limit
    expect(isValid).toBe(true)
  })
})
```

#### **Tests de Integración**
- **Subida completa** a Cloudinary
- **Guardado** en Firestore
- **Eliminación** sincronizada
- **Permisos** por rol

### 🔄 **Migración y Mantenimiento**

#### **Migración de Archivos Existentes**
```typescript
// Script de migración
const migrateExistingFiles = async () => {
  // 1. Obtener archivos del sistema anterior
  // 2. Subir a Cloudinary
  // 3. Crear registros en Firestore
  // 4. Actualizar referencias
  // 5. Validar integridad
}
```

#### **Limpieza Automática**
```typescript
// Limpiar archivos huérfanos
const cleanOrphanFiles = async () => {
  // 1. Obtener archivos sin relación
  // 2. Verificar antigüedad (>30 días)
  // 3. Eliminar de Cloudinary
  // 4. Eliminar de Firestore
  // 5. Generar reporte
}
```

### 📊 **Métricas y Analytics**

#### **KPIs del Sistema**
- **Tasa de éxito** de subidas (>95%)
- **Tiempo promedio** de subida (<5s)
- **Uso de almacenamiento** por módulo
- **Archivos por usuario** promedio
- **Tipos de archivo** más comunes

#### **Alertas Automáticas**
- **Límite de almacenamiento** (80% del límite)
- **Archivos grandes** (>50MB)
- **Fallos de subida** recurrentes
- **Archivos huérfanos** acumulados

### 🎯 **Roadmap Futuro**

#### **Funcionalidades Planificadas**
- **Editor de imágenes** integrado
- **Conversión automática** de formatos
- **Versionado** de archivos
- **Colaboración** en documentos
- **OCR** para documentos escaneados

#### **Integraciones Adicionales**
- **Google Drive** como almacenamiento alternativo
- **Dropbox** para sincronización
- **OneDrive** para empresas
- **AWS S3** como backup
- **Webhook** para notificaciones externas

### 🔧 **Troubleshooting**

#### **Problemas Comunes**
1. **Archivos no se suben**
   - Verificar configuración de Cloudinary
   - Revisar límites de tamaño
   - Comprobar tipos permitidos

2. **Errores de permisos**
   - Validar autenticación del usuario
   - Verificar roles y permisos
   - Revisar configuración de Firestore

3. **Archivos no se eliminan**
   - Comprobar API key de Cloudinary
   - Verificar public_id correcto
   - Revisar logs de errores

#### **Logs de Debugging**
```typescript
// Habilitar logs detallados
const DEBUG_FILES = process.env.NODE_ENV === 'development'

if (DEBUG_FILES) {
  console.log('File upload started:', file.name)
  console.log('Cloudinary response:', response)
  console.log('Firestore save result:', result)
}
```

---

**Nota**: Este sistema está diseñado para ser escalable, seguro y fácil de mantener, proporcionando una experiencia de usuario fluida mientras mantiene un control administrativo completo sobre todos los archivos del sistema.