# Sistema Avanzado de Cotizaciones - Ferretería La Michoacana

## Descripción General

El Sistema Avanzado de Cotizaciones es una herramienta completa que permite a los vendedores crear, gestionar y enviar cotizaciones profesionales a los clientes de manera eficiente y organizada.

## Características Principales

### 🎯 Constructor de Cotizaciones (QuotationBuilder)

#### Funcionalidades Clave
- **Búsqueda inteligente de productos** con filtros por nombre, categoría y marca
- **Catálogo integrado** con precios base, stock y descripciones
- **Cálculos automáticos** de subtotales, descuentos e IVA
- **Configuración flexible** de términos y condiciones
- **Validación en tiempo real** de datos y fechas

#### Interfaz de Usuario
- **Layout responsivo** optimizado para desktop y móvil
- **Sidebar informativo** con datos del cliente y configuración
- **Tabla dinámica** de productos con edición inline
- **Vista de totales** actualizada automáticamente
- **Modal de búsqueda** con resultados filtrados

### 📊 Gestor de Cotizaciones (QuotationViewer)

#### Funcionalidades de Gestión
- **Lista completa** de cotizaciones con filtros avanzados
- **Estados visuales** con iconos y colores distintivos
- **Búsqueda por cliente** o número de cotización
- **Acciones contextuales** según el estado de la cotización
- **Vista detallada** con información completa

#### Estados de Cotización
```typescript
type QuotationStatus = 'borrador' | 'enviada' | 'aceptada' | 'rechazada' | 'vencida'
```

- **Borrador**: En proceso de creación, editable
- **Enviada**: Enviada al cliente, pendiente de respuesta
- **Aceptada**: Cliente aceptó la cotización
- **Rechazada**: Cliente rechazó la cotización
- **Vencida**: Fecha de vigencia expirada

### 🔧 Estructura de Datos

#### Producto
```typescript
interface Product {
  id: string
  name: string              // Nombre del producto
  category: string          // Categoría (Cemento, Blocks, etc.)
  brand: string            // Marca del producto
  unit: string             // Unidad de medida (saco, pieza, m³)
  basePrice: number        // Precio base
  stock: number            // Inventario disponible
  description?: string     // Descripción detallada
  image?: string          // URL de imagen del producto
}
```

#### Item de Cotización
```typescript
interface QuotationItem {
  id: string
  productId: string        // Referencia al producto
  productName: string      // Nombre del producto
  description: string      // Descripción personalizada
  unit: string            // Unidad de medida
  quantity: number        // Cantidad solicitada
  unitPrice: number       // Precio unitario (puede diferir del base)
  discount: number        // Descuento por producto (%)
  subtotal: number        // Subtotal calculado
}
```

#### Cotización Completa
```typescript
interface Quotation {
  id: string
  quotationNumber: string  // Número único (COT-2025-001)
  requestId: string       // ID de solicitud relacionada
  
  // Información del cliente
  clientName: string
  clientEmail: string
  clientPhone: string
  clientCompany: string
  
  // Información del vendedor
  vendorId: string
  vendorName: string
  
  // Productos y cálculos
  items: QuotationItem[]
  subtotal: number        // Suma de subtotales
  discount: number        // Descuento general (%)
  tax: number            // IVA (%)
  total: number          // Total final
  
  // Configuración
  validUntil: string     // Fecha de vigencia
  notes: string          // Notas adicionales
  terms: string          // Términos y condiciones
  
  // Estado y metadatos
  status: QuotationStatus
  createdAt: Date
  updatedAt: Date
  sentAt?: Date          // Fecha de envío
  respondedAt?: Date     // Fecha de respuesta del cliente
}
```

### 🎨 Experiencia de Usuario

#### Flujo de Creación
1. **Selección de cliente** desde solicitud existente o manual
2. **Búsqueda de productos** con filtros inteligentes
3. **Configuración de cantidades** y precios personalizados
4. **Aplicación de descuentos** por producto o general
5. **Revisión de totales** con cálculo automático de IVA
6. **Configuración de términos** y fecha de vigencia
7. **Guardado como borrador** o envío directo

#### Validaciones en Tiempo Real
- **Campos requeridos** marcados visualmente
- **Cálculos automáticos** al cambiar cantidades o precios
- **Validación de fechas** para vigencia futura
- **Verificación de stock** disponible
- **Formato de email** del cliente

#### Estados Visuales
- **Iconos descriptivos** para cada estado
- **Colores distintivos** para identificación rápida
- **Badges informativos** con estado actual
- **Indicadores de vencimiento** para cotizaciones expiradas

### 🔗 Integración con Sistema Existente

#### Con RequestManager
- **Botón directo** "Nueva Cotización" en gestión de solicitudes
- **Datos pre-llenados** del cliente desde la solicitud
- **Vinculación automática** entre solicitud y cotización
- **Historial completo** de cotizaciones por solicitud

#### Con VendorDashboard
- **Acceso rápido** desde panel principal
- **Estadísticas integradas** de cotizaciones
- **Enlace directo** a gestión completa
- **Métricas de rendimiento** por vendedor

#### Con Sistema de Chat
- **Notificaciones** de nuevas cotizaciones
- **Enlaces directos** desde conversaciones
- **Seguimiento** de respuestas del cliente
- **Historial** de comunicaciones relacionadas

### 📊 Cálculos y Fórmulas

#### Cálculo de Subtotal por Item
```typescript
const itemDiscount = (unitPrice * discount) / 100
const priceAfterDiscount = unitPrice - itemDiscount
const subtotal = priceAfterDiscount * quantity
```

#### Cálculo de Total General
```typescript
const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
const generalDiscountAmount = (subtotal * generalDiscount) / 100
const taxableAmount = subtotal - generalDiscountAmount
const taxAmount = (taxableAmount * taxRate) / 100
const total = taxableAmount + taxAmount
```

### 🌐 API Endpoints

#### POST `/api/quotations`
Crear nueva cotización

**Request Body:**
```json
{
  "requestId": "req-123",
  "clientName": "Juan Pérez",
  "clientEmail": "juan@empresa.com",
  "clientPhone": "(443) 123-4567",
  "vendorId": "vendor-123",
  "items": [
    {
      "productId": "prod-1",
      "productName": "Cemento Portland",
      "quantity": 10,
      "unitPrice": 185.00,
      "discount": 5
    }
  ],
  "validUntil": "2025-11-15",
  "status": "borrador"
}
```

**Response:**
```json
{
  "success": true,
  "quotation": {
    "id": "quot-123",
    "quotationNumber": "COT-2025-001",
    "total": 2156.50
  },
  "message": "Cotización creada exitosamente"
}
```

#### GET `/api/quotations`
Obtener cotizaciones del vendedor

**Query Parameters:**
- `vendorId`: ID del vendedor
- `status`: Filtrar por estado
- `requestId`: Cotizaciones de una solicitud específica

#### PUT `/api/quotations`
Actualizar cotización existente

#### DELETE `/api/quotations`
Eliminar cotización (solo borradores)

### 📧 Sistema de Notificaciones (Futuro)

#### Email al Cliente
- **Plantilla profesional** con branding de la empresa
- **PDF adjunto** con cotización detallada
- **Enlaces de respuesta** para aceptar/rechazar
- **Información de contacto** del vendedor

#### Notificaciones Internas
- **Alertas de vencimiento** para vendedores
- **Notificaciones de respuesta** del cliente
- **Recordatorios de seguimiento** automáticos
- **Reportes de conversión** para gerentes

### 📈 Métricas y Reportes

#### KPIs por Vendedor
- **Cotizaciones creadas** por período
- **Tasa de conversión** (enviadas → aceptadas)
- **Valor promedio** de cotizaciones
- **Tiempo de respuesta** del cliente
- **Productos más cotizados**

#### Análisis de Rendimiento
- **Cotizaciones por estado** (dashboard visual)
- **Tendencias temporales** de creación y aceptación
- **Análisis de descuentos** aplicados
- **Comparativa entre vendedores**

### 🔄 Flujos de Trabajo

#### Flujo Estándar
```
Solicitud del Cliente → Asignación a Vendedor → Creación de Cotización → 
Envío al Cliente → Respuesta del Cliente → Seguimiento/Cierre
```

#### Flujo con Modificaciones
```
Cotización Inicial → Feedback del Cliente → Modificación → 
Nueva Versión → Aceptación Final
```

#### Flujo de Vencimiento
```
Cotización Enviada → Fecha de Vencimiento → Estado "Vencida" → 
Notificación al Vendedor → Seguimiento Manual
```

### 🛡️ Seguridad y Validaciones

#### Validaciones Frontend
- **Campos obligatorios** con feedback visual
- **Formatos de datos** (email, teléfono, fechas)
- **Rangos numéricos** para cantidades y precios
- **Fechas futuras** para vigencia

#### Validaciones Backend
- **Autenticación** del vendedor
- **Permisos de acceso** a cotizaciones
- **Integridad de datos** en cálculos
- **Límites de cantidad** según stock disponible

#### Auditoría
- **Logs de creación** y modificación
- **Historial de cambios** de estado
- **Seguimiento de accesos** por usuario
- **Backup automático** de cotizaciones importantes

### 🚀 Funcionalidades Futuras

#### Plantillas de Cotización
- **Plantillas predefinidas** por tipo de proyecto
- **Productos frecuentes** por vendedor
- **Configuraciones guardadas** de términos y descuentos
- **Cotizaciones recurrentes** para clientes habituales

#### Integración Avanzada
- **Sincronización con inventario** en tiempo real
- **Precios dinámicos** según disponibilidad
- **Descuentos automáticos** por volumen
- **Integración con sistema de facturación**

#### Analytics Avanzados
- **Predicción de conversión** con ML
- **Recomendaciones de productos** complementarios
- **Optimización de precios** según mercado
- **Análisis de competencia** automático

### 💡 Mejores Prácticas

#### Para Vendedores
1. **Respuesta rápida**: Crear cotización dentro de 4 horas
2. **Información completa**: Incluir descripciones detalladas
3. **Precios competitivos**: Considerar descuentos estratégicos
4. **Seguimiento activo**: Contactar antes del vencimiento
5. **Documentación**: Agregar notas sobre negociaciones

#### Para Gerentes
1. **Monitoreo regular**: Revisar métricas semanalmente
2. **Capacitación continua**: Entrenar en uso de herramientas
3. **Análisis de conversión**: Identificar oportunidades de mejora
4. **Estandarización**: Definir términos y condiciones uniformes
5. **Feedback**: Recopilar comentarios de vendedores y clientes

### 📋 Checklist de Implementación

#### Configuración Inicial
- [ ] Catálogo de productos actualizado
- [ ] Precios base configurados
- [ ] Términos y condiciones estándar
- [ ] Plantillas de email preparadas
- [ ] Permisos de usuario configurados

#### Capacitación
- [ ] Manual de usuario creado
- [ ] Sesiones de entrenamiento programadas
- [ ] Casos de uso documentados
- [ ] FAQ preparadas
- [ ] Soporte técnico disponible

#### Monitoreo
- [ ] Métricas de adopción definidas
- [ ] Dashboard de seguimiento configurado
- [ ] Alertas automáticas activadas
- [ ] Reportes periódicos programados
- [ ] Feedback continuo establecido

---

**Nota**: Este sistema está diseñado para optimizar el proceso de cotización, mejorar la experiencia del cliente y aumentar las tasas de conversión, proporcionando herramientas profesionales y eficientes para el equipo de ventas.