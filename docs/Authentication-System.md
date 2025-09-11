# Sistema de Autenticación - Ferretería La Michoacana

## 📋 Descripción General

El sistema de autenticación está completamente integrado con Firebase Authentication y Firestore, proporcionando registro, inicio de sesión, gestión de roles y sincronización de datos de usuario.

## 🔐 Arquitectura de Autenticación

### Componentes Principales

#### AuthProvider (`lib/auth/AuthProvider.tsx`)
- **Contexto global** para el estado de autenticación
- **Integración Firebase Auth** con Firestore
- **Gestión de roles** y permisos
- **Sincronización automática** de datos

#### Funcionalidades del AuthProvider
```typescript
interface AuthContextType {
  user: User | null                    // Usuario completo con datos de Firestore
  firebaseUser: FirebaseUser | null    // Usuario básico de Firebase Auth
  loading: boolean                     // Estado de carga
  login: (email, password) => Promise  // Función de inicio de sesión
  register: (email, password, name, role) => Promise // Función de registro
  logout: () => Promise                // Función de cierre de sesión
  refreshUser: () => Promise           // Refrescar datos del usuario
}
```

## 👤 Gestión de Usuarios

### Estructura de Usuario
```typescript
interface User {
  uid: string           // ID único de Firebase
  email: string         // Email del usuario
  displayName?: string  // Nombre completo
  role: UserRole        // Rol del usuario
  branchId?: string     // Sucursal asignada (vendedores/gerentes)
  phone?: string        // Teléfono de contacto
  companyName?: string  // Empresa (clientes)
  createdAt: Date       // Fecha de creación
  updatedAt: Date       // Última actualización
}
```

### Roles Disponibles
```typescript
type UserRole = 'cliente' | 'vendedor' | 'gerente' | 'rrhh' | 'it' | 'admin'
```

#### Descripción de Roles
- **cliente**: Usuario final que solicita cotizaciones
- **vendedor**: Atiende solicitudes asignadas por gerentes
- **gerente**: Gestiona sucursal, asigna vendedores, crea tickets IT
- **rrhh**: Gestiona vacantes y candidatos (ATS)
- **it**: Soporte técnico y administración del sistema
- **admin**: Acceso completo al panel de administración

## 🚪 Proceso de Registro

### Flujo de Registro
1. **Validación frontend**: Campos requeridos, formato email, contraseñas
2. **Creación en Firebase Auth**: `createUserWithEmailAndPassword()`
3. **Actualización de perfil**: `updateProfile()` con displayName
4. **Documento en Firestore**: Crear en colección `users`
5. **Rol por defecto**: Asignar rol 'cliente'
6. **Redirección**: Al dashboard correspondiente

### Validaciones de Registro
```typescript
// Validaciones implementadas
- Nombre completo requerido
- Email válido y único
- Contraseña mínimo 6 caracteres
- Confirmación de contraseña
- Aceptación de términos y condiciones
```

### Código de Ejemplo - Registro
```typescript
const result = await register(
  formData.email,
  formData.password,
  formData.displayName,
  'cliente' // Rol por defecto
)

if (result.success) {
  // Redirección automática por useEffect
} else {
  setError(result.error)
}
```

## 🔑 Proceso de Inicio de Sesión

### Flujo de Login
1. **Validación frontend**: Email y contraseña requeridos
2. **Autenticación Firebase**: `signInWithEmailAndPassword()`
3. **Obtención de datos**: Consulta documento en Firestore
4. **Actualización de contexto**: Estado global del usuario
5. **Redirección por rol**: Dashboard específico según rol

### Redirección Inteligente
```typescript
// Redirección según rol del usuario
switch (user.role) {
  case 'admin':
  case 'it':
    router.push('/dashboard/admin')
    break
  case 'gerente':
    router.push('/dashboard/gerente')
    break
  case 'vendedor':
    router.push('/dashboard/vendedor')
    break
  case 'rrhh':
    router.push('/dashboard/rrhh')
    break
  default:
    router.push('/dashboard') // Cliente
}
```

### Manejo de Errores
```typescript
// Errores específicos de Firebase Auth
switch (error.code) {
  case 'auth/user-not-found':
    return 'Usuario no encontrado'
  case 'auth/wrong-password':
    return 'Contraseña incorrecta'
  case 'auth/invalid-email':
    return 'Email inválido'
  case 'auth/too-many-requests':
    return 'Demasiados intentos. Intenta más tarde'
}
```

## 📱 Componentes de UI

### LoginForm (`components/auth/LoginForm.tsx`)

#### Características
- **Diseño responsive** con Tailwind CSS
- **Validación en tiempo real** de campos
- **Mostrar/ocultar contraseña** con iconos
- **Estados de carga** durante autenticación
- **Mensajes de error** específicos y claros
- **Información de cuentas demo** para testing

#### Funcionalidades
- Recordar usuario (checkbox)
- Enlace a recuperación de contraseña
- Redirección automática si ya está autenticado
- Cuentas de demostración para testing

### RegisterForm (`components/auth/RegisterForm.tsx`)

#### Características
- **Formulario completo** con validaciones
- **Confirmación de contraseña** en tiempo real
- **Campo opcional** para nombre de empresa
- **Términos y condiciones** requeridos
- **Información de beneficios** del registro

#### Validaciones Frontend
```typescript
const validateForm = () => {
  if (!formData.displayName.trim()) return false
  if (!formData.email.trim()) return false
  if (formData.password.length < 6) return false
  if (formData.password !== formData.confirmPassword) return false
  if (!formData.acceptTerms) return false
  return true
}
```

## 🔄 Sincronización con Firestore

### Creación Automática de Documentos
Cuando un usuario se registra, se crea automáticamente un documento en Firestore:

```typescript
await setDoc(doc(db, 'users', result.user.uid), {
  uid: result.user.uid,
  email: result.user.email,
  displayName,
  role: 'cliente', // Por defecto
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
})
```

### Obtención de Datos Completos
```typescript
const fetchUserData = async (firebaseUser: FirebaseUser) => {
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
  
  if (userDoc.exists()) {
    // Combinar datos de Firebase Auth + Firestore
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || userData.displayName,
      role: userData.role || 'cliente',
      // ... más campos
    }
  }
  
  // Si no existe, crear documento básico
  return await createBasicUserDocument(firebaseUser)
}
```

## 🛡️ Protección de Rutas

### Middleware de Autenticación
El middleware (`middleware.ts`) protege rutas según roles:

```typescript
const protectedRoutes = [
  '/dashboard',
  '/dashboard/vendedor', 
  '/dashboard/gerente',
  '/dashboard/rrhh',
  '/dashboard/it',
  '/dashboard/admin'
]

const roleRoutes = {
  '/dashboard/vendedor': ['vendedor', 'gerente', 'admin'],
  '/dashboard/gerente': ['gerente', 'admin'],
  '/dashboard/rrhh': ['rrhh', 'admin'],
  '/dashboard/it': ['it', 'admin'],
  '/dashboard/admin': ['admin']
}
```

### Verificación en Componentes
```typescript
// Ejemplo en AdminDashboard
if (!user || (user.role !== 'admin' && user.role !== 'it')) {
  return <MaintenancePage title="Acceso Restringido" />
}
```

## 📊 Estados de Autenticación

### Estados Posibles
1. **loading: true** - Verificando autenticación inicial
2. **user: null, loading: false** - No autenticado
3. **user: User, loading: false** - Autenticado correctamente

### Manejo en Componentes
```typescript
const { user, loading } = useAuth()

if (loading) {
  return <LoadingSpinner />
}

if (!user) {
  return <LoginRequired />
}

// Usuario autenticado - mostrar contenido
return <DashboardContent />
```

## 🔧 Configuración y Variables

### Variables de Entorno Requeridas
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Firebase Admin (para APIs del servidor)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@tu_proyecto.iam.gserviceaccount.com
```

### Configuración de Firebase
```typescript
// lib/firebase/config.ts
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... más configuración
}
```

## 🧪 Testing y Cuentas Demo

### Cuentas de Demostración
Para facilitar el testing, se proporcionan cuentas demo:

```typescript
// Usuarios de demostración disponibles
const demoAccounts = [
  {
    email: 'administrador@ferrelamichoacana.com',
    role: 'admin',
    password: 'password123'
  },
  {
    email: 'gerente.morelia@ferreterialamichoacana.com',
    role: 'gerente',
    password: 'password123'
  },
  {
    email: 'vendedor1.morelia@ferreterialamichoacana.com',
    role: 'vendedor',
    password: 'password123'
  }
]
```

### Creación de Cuentas Demo
Las cuentas demo deben crearse manualmente en Firebase Console:
1. **Authentication** → **Users** → **Add user**
2. Usar emails y contraseñas de la lista
3. Los documentos en Firestore se crean automáticamente al primer login

## 🔍 Debugging y Logs

### Logs de Autenticación
```typescript
// Logs automáticos en consola
console.log('User signed in:', user.email)
console.log('User role:', user.role)
console.error('Authentication error:', error.code)
```

### Verificación de Estado
```typescript
// Hook para debugging
const { user, firebaseUser, loading } = useAuth()

console.log({
  authenticated: !!user,
  firebaseUID: firebaseUser?.uid,
  userRole: user?.role,
  loading
})
```

## 🚀 Próximas Mejoras

### Funcionalidades Planeadas
1. **Recuperación de contraseña** - Reset password por email
2. **Verificación de email** - Email verification obligatorio
3. **Autenticación social** - Google, Facebook login
4. **2FA** - Autenticación de dos factores
5. **Sesiones múltiples** - Gestión de dispositivos
6. **Audit logs** - Registro de actividades de usuario

### Mejoras de Seguridad
1. **Rate limiting** - Límites de intentos de login
2. **IP blocking** - Bloqueo por IP sospechosa
3. **Password policies** - Políticas de contraseña más estrictas
4. **Session management** - Gestión avanzada de sesiones

## 📞 Soporte

**Desarrollador**: David Padilla Ruiz - DINOS Tech  
**Email**: atencionaclientes@dinoraptor.tech  
**Teléfono**: 3333010376

Para problemas de autenticación, verificar:
1. Configuración de Firebase en Console
2. Variables de entorno correctas
3. Reglas de Firestore apropiadas
4. Logs de consola para errores específicos