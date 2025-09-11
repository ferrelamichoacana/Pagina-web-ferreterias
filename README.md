# Ferretería La Michoacana - Sistema Web

Sistema web completo para Ferretería La Michoacana, desarrollado con Next.js, Firebase y tecnologías modernas.

## 🚀 Características Principales

- **Sistema Multirol**: Cliente, Vendedor, Gerente, RRHH, IT/Admin
- **Bilingüe**: Español e Inglés con selector dinámico
- **Responsive**: Diseño adaptable a todos los dispositivos
- **Tiempo Real**: Chat y notificaciones en tiempo real
- **Gestión Completa**: Desde cotizaciones hasta recursos humanos

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Email**: Resend API
- **Imágenes**: Cloudinary
- **Mapas**: Google Maps API
- **Deploy**: Vercel

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase
- Cuenta de Resend
- Cuenta de Cloudinary
- API Key de Google Maps

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone [repository-url]
cd ferreteria-la-michoacana
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Firebase Admin (Server-side)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu_proyecto.iam.gserviceaccount.com

# Resend API
RESEND_API_KEY=re_xxxxxxxxxx

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_maps_api_key
GOOGLE_MAPS_API_KEY=tu_server_maps_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Verificar que todo compile correctamente**
```bash
npm run build
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

> **Nota**: Si encuentras errores relacionados con `undici` o Firebase, es normal en desarrollo. El proyecto se compila correctamente como se muestra en el paso 4.

## 🏗️ Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes React
│   ├── home/             # Componentes de la página de inicio
│   └── layout/           # Componentes de layout
├── lib/                  # Utilidades y configuraciones
│   ├── auth/             # Autenticación
│   ├── firebase/         # Configuración de Firebase
│   ├── i18n/             # Internacionalización
│   └── utils/            # Utilidades generales
├── types/                # Definiciones de TypeScript
├── public/               # Archivos estáticos
├── tasks.md              # Lista de tareas del proyecto
└── CHANGELOG.md          # Registro de cambios
```

## 🎨 Paleta de Colores

- **Verde Principal**: #22c55e (primary-500)
- **Naranja Acento**: #f97316 (accent-500)
- **Blanco**: #ffffff (fondos)
- **Grises**: Para texto y elementos secundarios

## 👥 Roles de Usuario

### Cliente
- Solicitar cotizaciones
- Ver estado de solicitudes
- Chat con vendedores
- Gestionar perfil

### Vendedor
- Ver solicitudes asignadas
- Chat con clientes
- Actualizar estados
- Historial de ventas

### Gerente de Sucursal
- Asignar solicitudes a vendedores
- Crear tickets IT
- Gestionar vacantes de empleo
- Supervisar sucursal

### RRHH
- Sistema ATS completo
- Gestionar todas las vacantes
- Filtrar y contactar candidatos
- Seguimiento de aplicaciones

### IT/Admin
- Gestionar tickets de soporte
- Ver logs del sistema
- Administrar usuarios
- Configuraciones globales

## 📱 Funcionalidades Principales

### Página de Inicio
- Hero section con logo corporativo
- Sección "¿Quiénes Somos?" (editable)
- Marcas que vendemos (dinámico)
- Sucursales con mapas
- Testimonios de clientes
- Noticias y promociones

### Sistema de Cotizaciones
- Formulario de contacto completo
- Asignación automática por sucursal
- Chat en tiempo real
- Seguimiento de estados
- Notificaciones por email

### Bolsa de Trabajo
- Publicación de vacantes
- Sistema de aplicaciones
- Filtros avanzados para RRHH
- Gestión de candidatos
- Seguimiento completo

### Soporte IT
- Sistema de tickets
- Categorización de problemas
- Asignación de técnicos
- Seguimiento de resolución

## 🔐 Seguridad

- Autenticación con Firebase Auth
- Roles y permisos granulares
- Validación en frontend y backend
- Protección de rutas sensibles
- Logs de auditoría

## 📧 Sistema de Emails

Plantillas automáticas para:
- Confirmación de cotizaciones
- Asignación a vendedores
- Notificaciones de tickets IT
- Confirmación de aplicaciones
- Newsletter y promociones

## 🗺️ Integración con Mapas

- Ubicación de sucursales
- Cálculo de distancias
- Geocoding de direcciones
- Mapas interactivos

## 📊 Base de Datos (Firestore)

### Colecciones Principales
- `users` - Usuarios y roles
- `branches` - Sucursales
- `contactRequests` - Solicitudes de cotización
- `chatMessages` - Mensajes de chat
- `jobPostings` - Vacantes de empleo
- `jobApplications` - Aplicaciones de trabajo
- `itTickets` - Tickets de soporte
- `systemLogs` - Logs del sistema

## 🚀 Deploy en Vercel

1. **Conectar repositorio a Vercel**
2. **Configurar variables de entorno en Vercel**
3. **Deploy automático**

```bash
npm run build
npm run deploy
```

## 📝 Desarrollo

### Agregar Nueva Marca
1. Subir logo a Cloudinary
2. Editar `components/home/BrandsSection.tsx`
3. Agregar entrada en el array `brands`

### Agregar Nueva Sucursal
1. Editar `components/home/BranchesSection.tsx`
2. Agregar entrada en el array `branches`
3. Incluir coordenadas para mapas

### Modificar Textos
- Textos estáticos: `lib/i18n/translations.ts`
- Textos de secciones: Componentes individuales (comentados)

## 🐛 Troubleshooting

### Error de Firebase
- Verificar configuración en `.env.local`
- Comprobar reglas de Firestore
- Validar service account

### Error de Cloudinary
- Verificar API keys
- Comprobar límites de cuenta
- Validar formatos de archivo

### Error de Resend
- Verificar API key
- Comprobar dominio verificado
- Revisar límites de envío

## 📞 Soporte

**Desarrollador**: David Padilla Ruiz - DINOS Tech
- **Teléfono**: 3333010376
- **Email**: atencionaclientes@dinoraptor.tech

## 📄 Licencia

© 2024 Ferretería La Michoacana. Todos los derechos reservados.
Desarrollado por DINOS Tech.

---

## 🔄 Próximas Actualizaciones

Ver `tasks.md` para lista completa de funcionalidades pendientes y `CHANGELOG.md` para historial de cambios.