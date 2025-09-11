# Componente MaintenancePage

## Descripción
Componente reutilizable para mostrar páginas en mantenimiento con un diseño atractivo y profesional. Incluye animaciones, soporte bilingüe y información de contacto.

## Ubicación
`components/ui/MaintenancePage.tsx`

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | `string` | Auto (según idioma) | Título principal de la página |
| `message` | `string` | Auto (según idioma) | Mensaje descriptivo |
| `showBackButton` | `boolean` | `true` | Mostrar botón "Volver al Inicio" |
| `estimatedTime` | `string` | `undefined` | Tiempo estimado de finalización |
| `contactInfo` | `boolean` | `true` | Mostrar información de contacto |

## Características

### 🎨 Diseño
- Gradiente de fondo corporativo (verde a naranja)
- Animaciones CSS suaves (bounce, pulse, ping)
- Iconos de Heroicons con animaciones
- Responsive design completo

### 🌐 Internacionalización
- Soporte automático para español e inglés
- Textos por defecto en ambos idiomas
- Integración con el sistema de traducciones

### 📱 Responsive
- Diseño mobile-first
- Adaptable a todas las pantallas
- Elementos apilados en móvil, lado a lado en desktop

### ♿ Accesibilidad
- Semántica HTML correcta
- Contrastes de color adecuados
- Enlaces con aria-labels apropiados

## Uso Básico

```tsx
import MaintenancePage from '@/components/ui/MaintenancePage'

// Uso simple
<MaintenancePage />

// Uso personalizado
<MaintenancePage
  title="Sistema en Mantenimiento"
  message="Estamos actualizando el sistema para mejorar tu experiencia."
  estimatedTime="2-3 horas"
  showBackButton={true}
  contactInfo={true}
/>
```

## Ejemplos de Implementación

### 1. Página de Dashboard
```tsx
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <MaintenancePage
      title="Panel de Usuario"
      message="Los paneles están siendo desarrollados..."
      estimatedTime="En desarrollo activo"
    />
  )
}
```

### 2. Página con Layout
```tsx
// app/contacto/page.tsx
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <MaintenancePage
          title="Formulario de Contacto"
          showBackButton={false}
        />
      </main>
      <Footer />
    </div>
  )
}
```

### 3. Sin Información de Contacto
```tsx
<MaintenancePage
  title="Función Temporal"
  message="Esta función estará disponible pronto."
  contactInfo={false}
  estimatedTime="Próximamente"
/>
```

## Elementos Visuales

### Iconos Animados
- **Icono principal**: Llave y destornillador (WrenchScrewdriverIcon)
- **Elementos decorativos**: Círculos de colores con animaciones
- **Puntos de carga**: Animación de bounce secuencial

### Colores Utilizados
- **Fondo**: Gradiente `from-primary-50 via-white to-accent-50`
- **Icono principal**: `text-primary-600`
- **Acentos**: `bg-accent-400` y `bg-primary-400`
- **Texto**: Escala de grises estándar

### Animaciones CSS
```css
/* Ejemplos de animaciones utilizadas */
.animate-pulse     /* Pulsación suave */
.animate-bounce    /* Rebote */
.animate-ping      /* Expansión circular */
```

## Información de Contacto

### Datos Incluidos
- **Teléfono**: (443) 123-4567 (enlace tel:)
- **Email**: soporte@ferreterialamichoacana.com (enlace mailto:)
- **Formato**: Tabla responsive con iconos

### Personalización
Los datos de contacto están hardcodeados pero pueden modificarse fácilmente en el componente:

```tsx
// Líneas 95-105 en MaintenancePage.tsx
<a href="tel:+524431234567">
  (443) 123-4567
</a>
<a href="mailto:soporte@ferreterialamichoacana.com">
  soporte@ferreterialamichoacana.com
</a>
```

## Integración con Traducciones

El componente utiliza el hook `useLanguage()` y tiene textos por defecto:

```tsx
const defaultTexts = {
  es: {
    title: 'Página en Mantenimiento',
    message: 'Estamos trabajando para mejorar...',
    // ... más textos
  },
  en: {
    title: 'Page Under Maintenance',
    message: 'We are working to improve...',
    // ... más textos
  }
}
```

## Mejoras Futuras

### Funcionalidades Planeadas
1. **Progreso visual**: Barra de progreso para desarrollos en curso
2. **Notificaciones**: Sistema de suscripción para avisos de disponibilidad
3. **Temas**: Soporte para modo oscuro
4. **Animaciones avanzadas**: Transiciones más elaboradas

### Configuración Dinámica
```tsx
// Futuro: Configuración desde CMS o base de datos
interface MaintenanceConfig {
  isEnabled: boolean
  title: Record<string, string>
  message: Record<string, string>
  estimatedCompletion: Date
  contactMethods: ContactMethod[]
}
```

## Notas de Desarrollo

### Dependencias
- `@heroicons/react` - Iconos
- `@/lib/i18n/LanguageProvider` - Internacionalización
- `next/link` - Navegación

### Archivos Relacionados
- `lib/i18n/translations.ts` - Textos de mantenimiento
- `app/globals.css` - Clases CSS utilizadas
- `tailwind.config.js` - Configuración de colores

### Consideraciones de Performance
- Componente ligero (~2KB gzipped)
- Animaciones CSS puras (no JavaScript)
- Imágenes optimizadas (solo iconos SVG)

## Créditos
- **Desarrollador**: David Padilla Ruiz - DINOS Tech
- **Contacto**: atencionaclientes@dinoraptor.tech
- **Versión**: 0.2.0