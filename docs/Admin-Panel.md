# Panel de Administración - Ferretería La Michoacana

## 📋 Descripción General

El panel de administración es una interfaz completa para gestionar todos los aspectos del sitio web de Ferretería La Michoacana. Solo usuarios con rol `admin` o `it` pueden acceder a estas funcionalidades.

## 🔐 Acceso y Permisos

### Roles Autorizados
- **Admin**: Acceso completo a todas las funcionalidades
- **IT**: Acceso completo (mismo nivel que admin)

### URL de Acceso
```
/dashboard/admin
```

### Verificación de Seguridad
- Verificación automática de rol al cargar el componente
- Redirección a página de mantenimiento si no tiene permisos
- Protección a nivel de middleware (futuro)

## 🏗️ Estructura del Panel

### Navegación Principal
El panel está organizado en 6 secciones principales:

1. **Resumen** - Vista general del sistema
2. **Sucursales** - Gestión de ubicaciones
3. **Marcas** - Gestión de logos y marcas
4. **Usuarios** - Administración de cuentas
5. **Configuración** - Ajustes del sistema
6. **Contenido** - Editor de textos web

## 📊 Sección: Resumen

### Funcionalidades
- **Estadísticas rápidas**: Contadores de sucursales, marcas, usuarios, solicitudes
- **Acciones rápidas**: Botones para crear elementos comunes
- **Vista general**: Estado del sistema de un vistazo

### Métricas Mostradas
```typescript
- Número de sucursales activas
- Número de marcas registradas  
- Número de usuarios por rol
- Número de solicitudes pendientes
```

## 🏢 Sección: Gestión de Sucursales

### Funcionalidades Principales
- ✅ **Crear sucursal**: Formulario completo con validación
- ✅ **Editar sucursal**: Modificar información existente
- ✅ **Eliminar sucursal**: Con confirmación de seguridad
- ✅ **Gestión de servicios**: Servicios disponibles por sucursal
- ✅ **Coordenadas GPS**: Para integración con mapas

### Campos del Formulario
```typescript
interface BranchForm {
  name: string          // Nombre de la sucursal *
  city: string          // Ciudad *
  state: string         // Estado *
  address: string       // Dirección completa *
  phone: string         // Teléfono *
  email: string         // Email de contacto
  schedule: string      // Horario de atención
  coordinates: {        // Coordenadas GPS
    lat: number
    lng: number
  }
  isMain: boolean       // Sucursal principal
  services: string[]    // Servicios disponibles
}
```

### Servicios Disponibles
- Venta al público
- Venta mayorista
- Entrega a domicilio
- Asesoría técnica
- Instalación
- Servicio técnico
- Capacitación

### Validaciones
- Campos requeridos marcados con *
- Validación de formato de teléfono
- Validación de coordenadas GPS
- Confirmación antes de eliminar

## 🏷️ Sección: Gestión de Marcas

### Funcionalidades Principales
- ✅ **Subida de logos**: Drag & drop con Cloudinary
- ✅ **Crear/Editar marcas**: Información completa
- ✅ **Activar/Desactivar**: Control de visibilidad
- ✅ **Eliminar marcas**: Con confirmación
- ✅ **Categorización**: Organización por tipo

### Subida de Imágenes
```typescript
// Configuración de subida
- Formatos soportados: PNG, JPG, WEBP
- Tamaño máximo: 5MB
- Optimización automática: Cloudinary
- Preset utilizado: 'brandLogo'
- Carpeta: 'ferreteria-la-michoacana/brands'
```

### Drag & Drop
- **Área visual**: Zona claramente definida
- **Estados visuales**: Activo/inactivo durante drag
- **Previsualización**: Imagen cargada inmediatamente
- **Validación**: Tipo y tamaño de archivo
- **Feedback**: Mensajes de error/éxito

### Campos del Formulario
```typescript
interface BrandForm {
  name: string          // Nombre de la marca *
  logoUrl: string       // URL del logo (Cloudinary)
  category: string      // Categoría *
  description: string   // Descripción opcional
  website: string       // Sitio web oficial
  active: boolean       // Estado activo/inactivo
}
```

### Categorías Disponibles
- Herramientas Eléctricas
- Herramientas Manuales
- Material Eléctrico
- Plomería
- Materiales de Construcción
- Ferretería General
- Pinturas y Barnices
- Tornillería
- Seguridad Industrial
- Jardinería
- Otro

## 👥 Sección: Gestión de Usuarios

### Funcionalidades Principales
- ✅ **Vista de usuarios**: Lista completa con información
- ✅ **Editar usuarios**: Roles, sucursales, información
- ✅ **Estadísticas por rol**: Contadores visuales
- ✅ **Asignación de sucursales**: Para vendedores/gerentes

### Roles Disponibles
```typescript
type UserRole = 'cliente' | 'vendedor' | 'gerente' | 'rrhh' | 'it' | 'admin'
```

### Información Editable
- Nombre completo
- Rol del usuario
- Sucursal asignada (vendedores/gerentes)
- Teléfono de contacto
- Nombre de empresa (clientes)

### Limitaciones
- **No se pueden crear usuarios**: Deben registrarse primero
- **No se pueden eliminar**: Solo editar información
- **Cambios inmediatos**: Los roles se aplican al instante

## ⚙️ Sección: Configuración del Sistema

### Subsecciones

#### General
- Nombre del sitio
- Rol por defecto para nuevos usuarios
- Modo mantenimiento (activar/desactivar)
- Permitir registro de nuevos usuarios

#### Contacto
- Email de contacto principal
- Email de soporte técnico
- Teléfono principal
- Dirección de oficina matriz

#### Redes Sociales
- Facebook (URL completa)
- WhatsApp (número con formato internacional)
- Instagram (URL completa)
- Twitter (URL completa)

#### Contenido Web
- **Sección Hero**:
  - Título principal
  - Subtítulo/eslogan
  
- **Sección "¿Quiénes Somos?"**:
  - Título de la sección
  - Texto descriptivo completo
  
- **Misión, Visión y Valores**:
  - Texto de misión
  - Texto de visión
  - Texto de valores

### Impacto de los Cambios
- **Inmediato**: Los cambios se reflejan instantáneamente en el sitio
- **Tiempo real**: Usuarios ven actualizaciones sin recargar
- **Fallback**: Si no hay contenido, usa traducciones por defecto

## 🔧 Aspectos Técnicos

### Hooks Utilizados
```typescript
// Hooks personalizados para datos en tiempo real
useBranches()     // Sucursales
useBrands()       // Marcas activas
useUsers()        // Todos los usuarios
useSystemConfig() // Configuración del sistema
```

### Integración con Firebase
```typescript
// Operaciones CRUD
- collection()    // Consultar colecciones
- addDoc()        // Crear documentos
- updateDoc()     // Actualizar documentos
- deleteDoc()     // Eliminar documentos
- serverTimestamp() // Timestamps del servidor
```

### Integración con Cloudinary
```typescript
// Subida de imágenes
uploadWithPreset(file, 'brandLogo', 'ferreteria-la-michoacana/brands')

// Configuración del preset
brandLogo: {
  width: 200,
  height: 200,
  quality: 'auto',
  format: 'png'
}
```

### Estados de Carga
- **Skeleton loaders**: Durante carga inicial
- **Spinners**: Durante operaciones (guardar, eliminar)
- **Feedback visual**: Confirmaciones y errores
- **Optimistic updates**: Cambios inmediatos en UI

## 🚀 Uso del Panel

### Flujo Típico de Administrador

1. **Acceso**: Iniciar sesión con cuenta admin/IT
2. **Navegación**: Usar menú lateral para cambiar secciones
3. **Gestión**: Crear, editar o eliminar elementos
4. **Configuración**: Ajustar textos y configuraciones
5. **Verificación**: Comprobar cambios en el sitio público

### Mejores Prácticas

#### Para Sucursales
- Verificar coordenadas GPS antes de guardar
- Incluir todos los servicios disponibles
- Mantener información de contacto actualizada

#### Para Marcas
- Usar logos de alta calidad (PNG preferible)
- Completar descripción para mejor SEO
- Verificar enlaces a sitios web oficiales

#### Para Contenido
- Mantener textos concisos pero informativos
- Revisar ortografía antes de guardar
- Usar un tono consistente con la marca

#### Para Usuarios
- Asignar roles apropiados según función
- Vincular vendedores/gerentes a sucursales correctas
- Mantener información de contacto actualizada

## 🔒 Seguridad

### Verificaciones Implementadas
- Verificación de rol en cada componente
- Validación de datos en formularios
- Confirmación antes de eliminar elementos
- Sanitización de URLs y textos

### Limitaciones de Seguridad
- Solo verificación frontend (implementar backend)
- Sin logs de auditoría (futuro)
- Sin límites de rate limiting (futuro)

## 📱 Responsive Design

### Adaptabilidad
- **Desktop**: Navegación lateral completa
- **Tablet**: Navegación colapsible
- **Mobile**: Menú hamburguesa, formularios apilados

### Optimizaciones Móviles
- Drag & drop funciona en touch
- Formularios optimizados para móvil
- Tablas con scroll horizontal
- Botones de tamaño adecuado

## 🔄 Actualizaciones Futuras

### Funcionalidades Planeadas
- **Logs de auditoría**: Registro de cambios
- **Backup/Restore**: Respaldo de configuraciones
- **Plantillas**: Templates para contenido
- **Programación**: Cambios programados
- **Notificaciones**: Alertas de sistema
- **Analytics**: Métricas de uso del panel

### Mejoras Técnicas
- **Validación backend**: Security rules en Firestore
- **Rate limiting**: Límites de operaciones
- **Caché**: Optimización de consultas
- **Offline support**: Funcionalidad sin conexión

## 📞 Soporte

**Desarrollador**: David Padilla Ruiz - DINOS Tech  
**Email**: atencionaclientes@dinoraptor.tech  
**Teléfono**: 3333010376

Para reportar bugs o solicitar nuevas funcionalidades, contactar al desarrollador con detalles específicos del problema o requerimiento.