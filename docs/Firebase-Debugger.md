# 🛠️ Firebase Debugger - Documentación

## 📋 **Funcionalidades Implementadas**

### 🔍 **Consulta de Colecciones**
- **Selector de colecciones:** Dropdown con todas las colecciones disponibles
- **Carga automática:** Al seleccionar una colección, carga todos los documentos
- **Conteo de documentos:** Muestra la cantidad total de documentos
- **Recarga manual:** Botón para refrescar los datos

### 📄 **Visualización de Documentos**
- **Lista completa:** Muestra todos los documentos de la colección seleccionada
- **Vista previa:** Muestra los primeros 3 campos de cada documento
- **Viewer completo:** Modal para ver el documento completo en JSON
- **Formato legible:** JSON formateado con sintaxis clara

### ✏️ **Modificación de Datos**
- **Agregar documentos:** Formulario JSON para crear nuevos documentos
- **Editar documentos:** Modificar documentos existentes en JSON
- **Eliminar documentos:** Confirmación antes de eliminar
- **Timestamps automáticos:** Agrega `createdAt` y `updatedAt` automáticamente

### 🎛️ **Interfaz de Usuario**
- **Diseño responsive:** Funciona en desktop y móvil
- **Mensajes de estado:** Feedback visual para éxito/error
- **Loading states:** Indicadores de carga durante operaciones
- **Confirmaciones:** Dialogs de confirmación para acciones destructivas

## 🏗️ **Arquitectura Técnica**

### 📂 **Colecciones Soportadas**
```typescript
const collections = [
  'users',           // Usuarios del sistema
  'branches',        // Sucursales
  'brands',          // Marcas y proveedores
  'contactRequests', // Solicitudes de contacto
  'jobPostings',     // Ofertas de trabajo
  'jobApplications', // Aplicaciones de trabajo
  'itTickets',       // Tickets de soporte IT
  'chatMessages',    // Mensajes de chat
  'systemConfig',    // Configuración del sistema
  'systemLogs'       // Logs del sistema
]
```

### 🔐 **Seguridad**
- **Acceso restringido:** Solo usuarios `admin` e `it`
- **Validación JSON:** Verifica formato antes de guardar
- **Confirmaciones:** Previene eliminaciones accidentales
- **Manejo de errores:** Captura y muestra errores de Firestore

### 🎨 **Componentes UI**
- **Estados de carga:** Spinners y mensajes de estado
- **Iconos Heroicons:** Consistente con el resto de la aplicación
- **Tailwind CSS:** Estilos coherentes con el sistema de diseño
- **Responsive design:** Adaptable a diferentes tamaños de pantalla

## 🚀 **Uso en Producción**

### 📍 **Ubicación**
```
Panel Admin → Firebase Debug
/dashboard/admin (pestaña "Firebase Debug")
```

### 👥 **Permisos Requeridos**
- **Role:** `admin` o `it`
- **Acceso:** Desde el panel de administración

### ⚡ **Casos de Uso**
1. **Debugging:** Inspeccionar datos de colecciones
2. **Mantenimiento:** Corregir datos incorrectos
3. **Testing:** Agregar datos de prueba
4. **Monitoring:** Verificar estructura de documentos
5. **Limpieza:** Eliminar datos obsoletos

## 🎯 **Características Destacadas**

### ✅ **Ventajas**
- **GUI intuitiva:** No requiere conocimientos técnicos avanzados
- **Tiempo real:** Refleja cambios inmediatamente
- **Backup automático:** Los timestamps preservan historial
- **Validación JSON:** Previene errores de formato
- **Integración completa:** Forma parte del panel admin existente

### ⚠️ **Consideraciones**
- **Uso cuidadoso:** Cambios directos en producción
- **Backup recomendado:** Respaldar antes de cambios masivos
- **Validación manual:** Verificar datos críticos después de cambios
- **Logs de auditoría:** Mantener registro de modificaciones importantes

## 📱 **Interfaz de Usuario**

### 🎨 **Pantallas Principales**

#### 1. **Selector de Colección**
```
┌─────────────────────────────────────┐
│ Seleccionar Colección    [Recargar] │
│ [Dropdown: branches     ] [Agregar] │
└─────────────────────────────────────┘
```

#### 2. **Lista de Documentos**
```
┌─────────────────────────────────────┐
│ Documentos en branches (2)          │
├─────────────────────────────────────┤
│ 📄 queretaro-centro        [👁][✏][🗑] │
│    name: Sucursal Centro            │
│    city: Querétaro                  │
│    address: Av. Constituyentes...   │
├─────────────────────────────────────┤
│ 📄 queretaro-boulevares    [👁][✏][🗑] │
│    name: Sucursal Boulevares        │
│    city: Querétaro                  │
│    address: Blvd. Bernardo...       │
└─────────────────────────────────────┘
```

#### 3. **Editor JSON**
```
┌─────────────────────────────────────┐
│ Editar documento: queretaro-centro  │
├─────────────────────────────────────┤
│ {                                   │
│   "id": "queretaro-centro",         │
│   "name": "Sucursal Centro",        │
│   "city": "Querétaro",              │
│   "address": "Av. Constituyentes"   │
│ }                                   │
├─────────────────────────────────────┤
│ [Actualizar] [Cancelar]             │
└─────────────────────────────────────┘
```

---

**🎉 Firebase Debugger completamente funcional e integrado al panel de administración!**
