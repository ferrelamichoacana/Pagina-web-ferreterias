# Sistema ATS (Applicant Tracking System) - Ferretería La Michoacana

## Descripción General

El Sistema ATS es una plataforma completa de gestión de recursos humanos que permite a la empresa manejar vacantes, candidatos y el proceso completo de reclutamiento desde una interfaz web moderna y eficiente.

## Características Principales

### 🎯 Dashboard de RRHH
- **Estadísticas en tiempo real**: Métricas de vacantes activas, aplicaciones nuevas, entrevistas programadas y contrataciones
- **Vista consolidada**: Información de todas las sucursales en un solo lugar
- **Navegación por pestañas**: Gestión de vacantes y candidatos en interfaces separadas

### 📋 Gestión de Vacantes
- **Creación de vacantes**: Formulario completo con todos los campos necesarios
- **Edición en línea**: Modificación de vacantes existentes
- **Estados de vacante**: Activa, Pausada, Cerrada
- **Filtros avanzados**: Por sucursal, departamento, tipo de empleo
- **Información detallada**: Descripción, requisitos, responsabilidades, beneficios

### 👥 Gestión de Candidatos
- **Vista de aplicaciones**: Lista completa de todos los candidatos
- **Filtros inteligentes**: Por estado, nombre, puesto, sucursal
- **Búsqueda en tiempo real**: Encuentra candidatos rápidamente
- **Estados de aplicación**: Nueva → Revisada → Entrevista → Contratada/Rechazada

### 📝 Gestión Individual de Aplicaciones
- **Vista detallada**: Información completa del candidato
- **Sistema de notas**: Comentarios internos del equipo de RRHH
- **Cambio de estados**: Flujo de trabajo estructurado
- **Historial de acciones**: Seguimiento completo del proceso

### 🌐 Bolsa de Trabajo Pública
- **Listado público**: Vacantes activas visibles para candidatos
- **Filtros de búsqueda**: Por ubicación, departamento, tipo
- **Información atractiva**: Presentación profesional de oportunidades
- **Call-to-action**: Enlaces directos para aplicar

## Estructura de Datos

### Vacante (JobPosting)
```typescript
interface JobPosting {
  id: string
  title: string                    // Título del puesto
  department: string               // Departamento
  branchId: string                // ID de sucursal
  branchName: string              // Nombre de sucursal
  description: string             // Descripción del puesto
  requirements: string            // Requisitos
  responsibilities: string        // Responsabilidades
  salaryMin?: string             // Salario mínimo
  salaryMax?: string             // Salario máximo
  type: 'tiempo_completo' | 'medio_tiempo' | 'temporal'
  experience?: string            // Experiencia requerida
  education?: string             // Educación requerida
  skills: string[]               // Habilidades deseadas
  benefits?: string              // Beneficios
  status: 'activa' | 'pausada' | 'cerrada'
  createdAt: Date
  updatedAt: Date
}
```

### Aplicación (JobApplication)
```typescript
interface JobApplication {
  id: string
  jobId: string                   // ID de la vacante
  jobTitle: string               // Título del puesto
  applicantName: string          // Nombre del candidato
  applicantEmail: string         // Email del candidato
  phone: string                  // Teléfono
  status: 'nueva' | 'revisada' | 'entrevista' | 'rechazada' | 'contratada'
  appliedAt: Date               // Fecha de aplicación
  branchName: string            // Sucursal
  experience: string            // Experiencia del candidato
  education?: string            // Educación
  skills: string[]              // Habilidades
  coverLetter?: string          // Carta de presentación
  resumeUrl?: string            // URL del CV
  notes: string[]               // Notas internas
  createdAt: Date
  updatedAt: Date
}
```

## Componentes Principales

### 1. HRDashboard (`components/dashboard/HRDashboard.tsx`)
- **Propósito**: Panel principal de RRHH con estadísticas y navegación
- **Características**:
  - Métricas en tiempo real
  - Pestañas para vacantes y aplicaciones
  - Filtros y búsqueda
  - Acciones rápidas

### 2. ApplicationManager (`components/hr/ApplicationManager.tsx`)
- **Propósito**: Gestión detallada de aplicaciones individuales
- **Características**:
  - Vista completa del candidato
  - Sistema de notas internas
  - Cambio de estados con confirmación
  - Historial de acciones

### 3. JobPostingForm (`components/hr/JobPostingForm.tsx`)
- **Propósito**: Creación y edición de vacantes
- **Características**:
  - Formulario completo con validaciones
  - Gestión de habilidades con tags
  - Vista previa de información
  - Estados de vacante

### 4. JobListings (`components/jobs/JobListings.tsx`)
- **Propósito**: Vista pública de vacantes disponibles
- **Características**:
  - Listado atractivo para candidatos
  - Filtros de búsqueda
  - Información detallada
  - Enlaces de aplicación

## Flujo de Trabajo

### 1. Creación de Vacante
1. RRHH accede al dashboard
2. Clic en "Nueva Vacante"
3. Completa formulario con detalles
4. Publica vacante (estado: activa)
5. Vacante aparece en bolsa de trabajo pública

### 2. Proceso de Aplicación
1. Candidato ve vacante en página pública
2. Aplica con información personal
3. Aplicación aparece como "nueva" en dashboard RRHH
4. RRHH revisa y cambia estado a "revisada"
5. Si es candidato viable, programa "entrevista"
6. Después de entrevista: "contratada" o "rechazada"

### 3. Gestión de Candidatos
1. RRHH filtra aplicaciones por estado
2. Abre ApplicationManager para ver detalles
3. Agrega notas internas sobre el candidato
4. Cambia estado según progreso
5. Mantiene historial completo del proceso

## Funciones de Backend

### Vacantes
- `createJobPosting()`: Crear nueva vacante
- `updateJobPosting()`: Actualizar vacante existente
- `getActiveJobPostings()`: Obtener vacantes activas
- `getAllJobPostings()`: Obtener todas las vacantes

### Aplicaciones
- `createJobApplication()`: Crear nueva aplicación
- `updateApplicationStatus()`: Cambiar estado de aplicación
- `getAllJobApplications()`: Obtener todas las aplicaciones
- `getApplicationsByStatus()`: Filtrar por estado

## Seguridad y Permisos

### Roles Autorizados
- **RRHH**: Acceso completo al sistema ATS
- **Admin**: Acceso completo + configuración del sistema
- **Gerente**: Solo aplicaciones de su sucursal (futuro)

### Protección de Rutas
- `/dashboard/hr/*`: Solo usuarios con rol 'rrhh' o 'admin'
- Middleware verifica autenticación y permisos
- Redirección automática si no autorizado

## Integraciones Futuras

### 📧 Sistema de Emails
- Confirmación automática de aplicación
- Notificaciones de cambio de estado
- Invitaciones a entrevista
- Comunicación con candidatos

### 📊 Reportes y Analytics
- Métricas de reclutamiento
- Tiempo promedio de contratación
- Fuentes de candidatos más efectivas
- Reportes por sucursal

### 🔗 Integración con Nómina
- Transferencia automática de datos de contratados
- Sincronización con sistema de empleados
- Onboarding digital

## Mejores Prácticas

### Para RRHH
1. **Revisar aplicaciones diariamente**: Mantener candidatos informados
2. **Usar notas internas**: Documentar todas las interacciones
3. **Actualizar estados promptamente**: Mejorar experiencia del candidato
4. **Mantener vacantes actualizadas**: Pausar o cerrar cuando sea necesario

### Para Desarrollo
1. **Validaciones robustas**: Tanto frontend como backend
2. **Estados consistentes**: Flujo de trabajo claro y lógico
3. **Búsqueda optimizada**: Índices apropiados en Firestore
4. **Responsive design**: Accesible desde cualquier dispositivo

## Configuración y Deploy

### Variables de Entorno Requeridas
```env
# Firebase (ya configurado)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Cloudinary para CVs (futuro)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email service (futuro)
RESEND_API_KEY=
```

### Colecciones de Firestore
- `jobPostings`: Vacantes de empleo
- `jobApplications`: Aplicaciones de candidatos
- `users`: Usuarios del sistema (ya existe)

### Reglas de Seguridad Firestore
```javascript
// Vacantes - solo RRHH y admin pueden escribir
match /jobPostings/{document} {
  allow read: if true; // Público para candidatos
  allow write: if request.auth != null && 
    (resource.data.role == 'rrhh' || resource.data.role == 'admin');
}

// Aplicaciones - candidatos pueden crear, RRHH puede leer/actualizar
match /jobApplications/{document} {
  allow create: if request.auth != null;
  allow read, update: if request.auth != null && 
    (resource.data.role == 'rrhh' || resource.data.role == 'admin');
}
```

## Soporte y Mantenimiento

### Monitoreo
- Logs de aplicaciones nuevas
- Métricas de uso del sistema
- Errores de validación
- Performance de consultas

### Backup
- Respaldo automático de Firestore
- Exportación de datos de candidatos
- Historial de vacantes cerradas

---

**Nota**: Este sistema está diseñado para crecer con las necesidades de la empresa. Las funcionalidades futuras se pueden agregar de manera modular sin afectar el funcionamiento actual.