# Guía de Optimización y Deploy - Ferretería La Michoacana

## Descripción General

Esta guía detalla todas las optimizaciones implementadas para mejorar el rendimiento, SEO y experiencia de usuario, así como las configuraciones necesarias para el deploy en producción.

## Optimizaciones Implementadas

### 🚀 **Optimización de Rendimiento**

#### **1. Configuración de Next.js (next.config.js)**

**Optimización de Imágenes**
```javascript
images: {
  domains: ['res.cloudinary.com', 'cloudinary.com'],
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
}
```

**Compresión y Caching**
```javascript
compress: true,
headers: [
  {
    source: '/_next/static/(.*)',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable'
      }
    ]
  }
]
```

**Code Splitting Avanzado**
```javascript
webpack: (config, { dev, isServer }) => {
  if (!dev && !isServer) {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /node_modules/,
          priority: 20
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 10
        }
      }
    }
  }
}
```

#### **2. Optimización de Imágenes**

**Script de Optimización Automática**
```bash
# Ejecutar optimización de imágenes
node scripts/optimize-images.js
```

**Características del Script**:
- Conversión automática a WebP
- Generación de múltiples tamaños (mobile, tablet, desktop, large)
- Compresión optimizada por formato
- Componente ResponsiveImage generado automáticamente

**Uso del Componente ResponsiveImage**:
```typescript
<ResponsiveImage
  src="/images/hero-banner"
  alt="Ferretería La Michoacana"
  width={1920}
  height={1080}
  priority={true}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

#### **3. Lazy Loading y Code Splitting**

**Componentes Dinámicos**
```typescript
// Lazy loading de componentes pesados
const FileManager = dynamic(() => import('@/components/files/FileManager'), {
  loading: () => <div>Cargando gestor de archivos...</div>,
  ssr: false
})

const AdminDashboard = dynamic(() => import('@/components/admin/AdminDashboard'), {
  loading: () => <div>Cargando panel de administración...</div>
})
```

**Rutas Dinámicas Optimizadas**
```typescript
// Pre-generación de rutas estáticas
export async function generateStaticParams() {
  const jobs = await getPublicJobs()
  return jobs.map((job) => ({
    id: job.id,
  }))
}
```

### 🔍 **Optimización SEO**

#### **1. Metadatos Dinámicos**

**Componente SEOHead**
```typescript
<SEOHead
  title="Ferretería La Michoacana - Materiales de Construcción"
  description="Ferretería líder en materiales de construcción..."
  keywords={['ferretería', 'construcción', 'cemento']}
  image="/images/og-image.jpg"
  type="website"
/>
```

**Structured Data (JSON-LD)**
```json
{
  "@context": "https://schema.org",
  "@type": "HardwareStore",
  "name": "Ferretería La Michoacana",
  "description": "...",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "MX"
  }
}
```

#### **2. Sitemap y Robots.txt Dinámicos**

**API Sitemap (/api/sitemap)**
- Generación automática de URLs
- Frecuencia de actualización por tipo de página
- Prioridades SEO configuradas
- Cache de 24 horas

**API Robots.txt (/api/robots)**
- Configuración específica por bot
- Exclusión de áreas privadas
- Referencia al sitemap
- Crawl delay optimizado

#### **3. Open Graph y Twitter Cards**

**Metadatos Sociales Completos**
```html
<meta property="og:type" content="website" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta name="twitter:card" content="summary_large_image" />
```

### 🛡️ **Optimización de Seguridad**

#### **Headers de Seguridad**
```javascript
headers: [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }
]
```

#### **Content Security Policy (CSP)**
```javascript
// Configuración recomendada para producción
const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.cloudinary.com https://api.resend.com;
`
```

### 📱 **Progressive Web App (PWA)**

#### **Web App Manifest**
```json
{
  "name": "Ferretería La Michoacana",
  "short_name": "Ferretería LM",
  "display": "standalone",
  "theme_color": "#16a34a",
  "background_color": "#ffffff",
  "start_url": "/",
  "scope": "/"
}
```

#### **Service Worker (Opcional)**
```javascript
// Configuración básica para caching
const CACHE_NAME = 'ferreteria-v1'
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js'
]
```

## Configuración de Deploy

### 🚀 **Deploy en Vercel**

#### **1. Configuración vercel.json**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

#### **2. Variables de Entorno**

**Variables Requeridas para Producción**:
```env
# Base
NEXT_PUBLIC_BASE_URL=https://ferreteria-michoacana.com
NODE_ENV=production

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
FIREBASE_ADMIN_PRIVATE_KEY=your-private-key
FIREBASE_ADMIN_CLIENT_EMAIL=your-client-email

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Resend
RESEND_API_KEY=your-resend-key
FROM_EMAIL=noreply@ferreteria-michoacana.com
REPLY_TO_EMAIL=contacto@ferreteria-michoacana.com

# Configuración
COMPANY_NAME="Ferretería La Michoacana"
COMPANY_WEBSITE=https://ferreteria-michoacana.com
```

#### **3. Scripts de Deploy**
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "deploy": "vercel --prod",
    "deploy:preview": "vercel",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

### 🔧 **Configuración de CI/CD**

#### **GitHub Actions Workflow**
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:ci
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 📊 **Monitoreo y Analytics**

#### **1. Web Vitals**
```typescript
// pages/_app.tsx
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Enviar métricas a analytics
  if (process.env.NODE_ENV === 'production') {
    // Google Analytics, Vercel Analytics, etc.
    console.log(metric)
  }
}
```

#### **2. Error Monitoring**
```typescript
// Configuración de Sentry (opcional)
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

#### **3. Performance Monitoring**
```typescript
// Métricas personalizadas
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    // Enviar métricas de performance
    console.log(entry.name, entry.duration)
  })
})

performanceObserver.observe({ entryTypes: ['measure', 'navigation'] })
```

## Optimizaciones Específicas por Módulo

### 🏠 **Página de Inicio**
- **Hero Section**: Imagen optimizada con WebP
- **Lazy Loading**: Secciones below-the-fold
- **Preload**: Recursos críticos
- **Critical CSS**: Inline para above-the-fold

### 📝 **Formularios**
- **Validación**: Client-side + server-side
- **Debouncing**: En campos de búsqueda
- **Progressive Enhancement**: Funciona sin JS
- **File Upload**: Chunked upload para archivos grandes

### 📊 **Dashboards**
- **Code Splitting**: Por rol de usuario
- **Data Fetching**: SWR con cache
- **Virtual Scrolling**: Para listas grandes
- **Skeleton Loading**: Estados de carga

### 📁 **Sistema de Archivos**
- **Lazy Loading**: Thumbnails bajo demanda
- **Progressive Loading**: Imágenes de baja a alta calidad
- **Compression**: Automática en cliente
- **CDN**: Cloudinary con transformaciones

## Métricas de Performance

### 🎯 **Objetivos Core Web Vitals**
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FCP (First Contentful Paint)**: < 1.8s
- **TTI (Time to Interactive)**: < 3.8s

### 📈 **Lighthouse Scores Objetivo**
- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 90
- **SEO**: > 95
- **PWA**: > 80

### 🔍 **Herramientas de Medición**
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun

# Bundle Analyzer
npm run analyze

# Web Vitals
npx web-vitals-cli https://ferreteria-michoacana.com
```

## Checklist de Deploy

### ✅ **Pre-Deploy**
- [ ] Tests pasando (unit + integration)
- [ ] Build exitoso sin warnings
- [ ] Variables de entorno configuradas
- [ ] Imágenes optimizadas
- [ ] Bundle size analizado
- [ ] Lighthouse scores > objetivos

### ✅ **Deploy**
- [ ] Deploy en preview environment
- [ ] Smoke tests en preview
- [ ] Performance tests
- [ ] Security scan
- [ ] Deploy a producción
- [ ] Verificación post-deploy

### ✅ **Post-Deploy**
- [ ] Monitoreo de errores activo
- [ ] Analytics configurado
- [ ] Sitemap actualizado
- [ ] CDN cache invalidado
- [ ] Notificación a stakeholders

## Troubleshooting

### 🐛 **Problemas Comunes**

#### **Build Failures**
```bash
# Limpiar cache
rm -rf .next node_modules
npm install
npm run build
```

#### **Performance Issues**
```bash
# Analizar bundle
npm run analyze

# Verificar Web Vitals
npx web-vitals-cli https://your-domain.com
```

#### **SEO Issues**
```bash
# Verificar sitemap
curl https://your-domain.com/sitemap.xml

# Verificar robots.txt
curl https://your-domain.com/robots.txt
```

### 📞 **Soporte y Monitoreo**

#### **Logs de Aplicación**
```typescript
// Configuración de logging
const logger = {
  info: (message: string, meta?: any) => {
    if (process.env.NODE_ENV === 'production') {
      // Enviar a servicio de logging
    } else {
      console.log(message, meta)
    }
  }
}
```

#### **Health Checks**
```typescript
// API endpoint para health check
export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV
  }
  
  return NextResponse.json(health)
}
```

---

**Nota**: Esta configuración está optimizada para máximo rendimiento y SEO, siguiendo las mejores prácticas de Next.js y las recomendaciones de Google para Core Web Vitals.