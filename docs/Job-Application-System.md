# Sistema de Aplicaciones de Empleo - Ferretería La Michoacana

## Descripción General

El Sistema de Aplicaciones de Empleo completa el ciclo del ATS (Applicant Tracking System) permitiendo a los candidatos aplicar directamente a las vacantes publicadas a través de un formulario web profesional y completo.

## Características Principales

### 🎯 Flujo de Aplicación Completo

#### 1. Descubrimiento de Vacantes
- **Página de empleos** (`/empleos`) con listado de vacantes activas
- **Filtros avanzados** por sucursal, departamento y tipo de empleo
- **Vista atractiva** con información clave de cada vacante

#### 2. Detalles de Vacante
- **Página individual** (`/empleos/[id]`) para cada vacante
- **Información completa**: descripción, requisitos, responsabilidades, beneficios
- **Sidebar informativo** con datos rápidos y habilidades requeridas
- **Call-to-action prominente** para aplicar

#### 3. Proceso de Aplicación
- **Formulario en 5 pasos** (`/empleos/[id]/aplicar`) con validación progresiva
- **Información personal y profesional** completa
- **Sistema de documentos** preparado para subida de CV
- **Consentimientos legales** requeridos

#### 4. Confirmación y Seguimiento
- **Página de confirmación** con próximos pasos
- **ID único de aplicación** para seguimiento
- **Integración con sistema ATS** para RRHH

### 📋 Formulario de Aplicación Detallado

#### Paso 1: Información Personal
```typescript
interface PersonalInfo {
  fullName: string          // Nombre completo *
  email: string             // Email *
  phone: string             // Teléfono *
  address: string           // Dirección completa
  city: string              // Ciudad *
  state: string             // Estado (default: Michoacán)
}
```

#### Paso 2: Experiencia Profesional
```typescript
interface ProfessionalInfo {
  currentPosition: string    // Puesto actual
  currentCompany: string     // Empresa actual
  yearsOfExperience: string  // Años de experiencia *
  expectedSalary: string     // Salario esperado
  availabilityDate: string   // Fecha de disponibilidad *
  workSchedule: 'tiempo_completo' | 'medio_tiempo' | 'flexible'
  willingToRelocate: boolean // Dispuesto a reubicación
  hasTransportation: boolean // Tiene transporte propio
}
```

#### Paso 3: Educación y Habilidades
```typescript
interface EducationInfo {
  education: string          // Nivel educativo *
  certifications: string     // Certificaciones y cursos
  skills: string[]          // Habilidades (tags dinámicos)
  experience: string        // Experiencia detallada *
}
```

#### Paso 4: Documentos y Referencias
```typescript
interface DocumentsInfo {
  resumeFile?: File         // Archivo de CV (PDF, DOC, DOCX)
  coverLetter: string       // Carta de presentación *
  references: Array<{       // Referencias laborales
    name: string
    position: string
    company: string
    phone: string
    email: string
  }>
}
```

#### Paso 5: Confirmación y Consentimientos
```typescript
interface ConsentInfo {
  dataConsent: boolean      // Consentimiento de datos *
  backgroundCheck: boolean  // Verificación de antecedentes *
}
```

### 🔧 Validaciones y Seguridad

#### Validaciones Frontend
- **Validación por pasos**: Cada paso debe completarse antes de continuar
- **Campos requeridos**: Marcados con asterisco y validados en tiempo real
- **Formatos específicos**: Email, teléfono, fechas
- **Archivos**: Tipo (PDF, DOC, DOCX) y tamaño (máx 5MB)

#### Validaciones Backend
- **Campos obligatorios**: Verificación server-side de todos los campos requeridos
- **Formato de datos**: Regex para email y teléfono
- **Consentimientos**: Verificación de aceptación de términos legales
- **Sanitización**: Limpieza de datos de entrada

#### Seguridad
- **Protección CSRF**: Tokens de seguridad en formularios
- **Validación de archivos**: Tipo MIME y contenido
- **Rate limiting**: Prevención de spam de aplicaciones
- **Logs de auditoría**: Registro de todas las aplicaciones

### 🎨 Experiencia de Usuario

#### Diseño Responsive
- **Mobile-first**: Optimizado para dispositivos móviles
- **Navegación intuitiva**: Breadcrumbs y botones de navegación claros
- **Progress indicator**: Barra de progreso visual en 5 pasos
- **Validación visual**: Iconos y colores para estados de validación

#### Accesibilidad
- **Labels descriptivos**: Todos los campos con etiquetas claras
- **Navegación por teclado**: Soporte completo para tab navigation
- **Contraste adecuado**: Colores que cumplen estándares WCAG
- **Screen readers**: Estructura semántica para lectores de pantalla

#### Estados de Carga
- **Feedback visual**: Spinners y estados de carga
- **Mensajes informativos**: Confirmaciones y errores claros
- **Prevención de doble envío**: Deshabilitación de botones durante envío

### 🔗 Integración con Sistema ATS

#### Flujo de Datos
1. **Candidato aplica** → Formulario web
2. **Datos validados** → API backend
3. **Aplicación creada** → Firestore
4. **Notificación enviada** → Email automático
5. **Aparece en RRHH** → Dashboard ATS

#### Estados de Aplicación
```typescript
type ApplicationStatus = 'nueva' | 'revisada' | 'entrevista' | 'rechazada' | 'contratada'
```

- **Nueva**: Recién enviada, pendiente de revisión
- **Revisada**: RRHH ha revisado la aplicación
- **Entrevista**: Candidato programado para entrevista
- **Rechazada**: Aplicación no seleccionada
- **Contratada**: Candidato seleccionado y contratado

### 📊 Estructura de Datos

#### Aplicación Completa
```typescript
interface JobApplication {
  // Identificadores
  id: string
  applicationId: string      // ID único para seguimiento
  jobId: string
  jobTitle: string
  branchId: string
  branchName: string
  
  // Información del candidato
  applicantName: string
  applicantEmail: string
  phone: string
  address: string
  city: string
  state: string
  
  // Información profesional
  currentPosition: string
  currentCompany: string
  yearsOfExperience: string
  expectedSalary: string
  availabilityDate: string
  workSchedule: string
  willingToRelocate: boolean
  hasTransportation: boolean
  
  // Educación y habilidades
  education: string
  certifications: string
  skills: string[]
  experience: string
  
  // Documentos
  coverLetter: string
  resumeUrl: string
  
  // Referencias
  references: Reference[]
  
  // Estado y metadatos
  status: ApplicationStatus
  source: 'web_application'
  notes: string[]
  
  // Consentimientos
  dataConsent: boolean
  backgroundCheck: boolean
  consentTimestamp: string
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}
```

### 🌐 API Endpoints

#### POST `/api/job-applications`
Crear nueva aplicación de trabajo

**Request Body:**
```json
{
  "jobId": "job123",
  "jobTitle": "Vendedor de Mostrador",
  "fullName": "Juan Pérez García",
  "email": "juan@email.com",
  "phone": "(443) 123-4567",
  "city": "Morelia",
  "yearsOfExperience": "1-2",
  "availabilityDate": "2025-10-01",
  "education": "bachillerato",
  "experience": "Experiencia detallada...",
  "coverLetter": "Carta de presentación...",
  "dataConsent": true,
  "backgroundCheck": true
}
```

**Response:**
```json
{
  "success": true,
  "applicationId": "APP-1725987654-ABC123DEF",
  "message": "Aplicación enviada exitosamente"
}
```

#### GET `/api/job-applications`
Obtener aplicaciones (para RRHH)

**Query Parameters:**
- `status`: Filtrar por estado (nueva, revisada, etc.)
- `jobId`: Filtrar por vacante específica

#### PUT `/api/job-applications`
Actualizar estado de aplicación (para RRHH)

**Request Body:**
```json
{
  "applicationId": "APP-1725987654-ABC123DEF",
  "status": "revisada",
  "notes": "Candidato interesante, programar entrevista",
  "hrUserId": "hr123"
}
```

### 📧 Notificaciones Automáticas (Futuro)

#### Email de Confirmación
- **Enviado**: Inmediatamente después de aplicar
- **Contenido**: Confirmación de recepción, ID de seguimiento, próximos pasos
- **Template**: Diseño profesional con branding de la empresa

#### Notificaciones de Estado
- **Triggers**: Cambios de estado en el ATS
- **Contenido**: Actualización personalizada según el nuevo estado
- **Frecuencia**: Inmediata al cambio de estado

#### Recordatorios para RRHH
- **Aplicaciones nuevas**: Notificación diaria de aplicaciones pendientes
- **Seguimiento**: Recordatorios de entrevistas programadas
- **Métricas**: Reportes semanales de actividad

### 🔄 Flujo Completo del Proceso

#### 1. Candidato Descubre Vacante
```
Página de empleos → Filtros → Lista de vacantes → Clic en vacante
```

#### 2. Revisa Detalles
```
Página de detalles → Información completa → Decisión de aplicar
```

#### 3. Completa Aplicación
```
Paso 1: Personal → Paso 2: Profesional → Paso 3: Educación → 
Paso 4: Documentos → Paso 5: Confirmación → Envío
```

#### 4. Confirmación
```
Página de éxito → ID de seguimiento → Próximos pasos
```

#### 5. Procesamiento por RRHH
```
Dashboard ATS → Nueva aplicación → Revisión → Cambio de estado → 
Notificación al candidato
```

### 🎯 Métricas y Analytics

#### KPIs de Conversión
- **Tasa de aplicación**: Vistas de vacante → Aplicaciones enviadas
- **Abandono por paso**: Dónde abandonan los candidatos el formulario
- **Tiempo de completado**: Cuánto tardan en completar la aplicación
- **Fuentes de tráfico**: De dónde vienen los candidatos

#### Métricas de Calidad
- **Aplicaciones completas**: Porcentaje con todos los campos llenos
- **Tasa de contratación**: Aplicaciones → Contrataciones exitosas
- **Tiempo de respuesta**: Cuánto tarda RRHH en responder
- **Satisfacción**: Feedback de candidatos sobre el proceso

### 🚀 Mejoras Futuras

#### Funcionalidades Avanzadas
- **Subida de archivos**: Integración completa con Cloudinary
- **Video presentaciones**: Opción de subir video de presentación
- **Tests en línea**: Evaluaciones técnicas integradas
- **Calendario de entrevistas**: Programación automática

#### Integraciones
- **LinkedIn**: Importar perfil automáticamente
- **Google Calendar**: Sincronización de entrevistas
- **WhatsApp**: Notificaciones por mensaje
- **Zoom**: Enlaces automáticos para entrevistas virtuales

#### Analytics Avanzados
- **Dashboard de métricas**: Para RRHH y gerentes
- **Reportes automáticos**: Generación de reportes periódicos
- **Predicción de éxito**: ML para identificar mejores candidatos
- **Benchmarking**: Comparación con industria

---

**Nota**: Este sistema está diseñado para proporcionar una experiencia profesional y completa tanto para candidatos como para el equipo de RRHH, optimizando el proceso de reclutamiento y mejorando la calidad de las contrataciones.