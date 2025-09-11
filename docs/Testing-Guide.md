# Guía de Testing - Ferretería La Michoacana

## Descripción General

Esta guía describe la estrategia de testing implementada para garantizar la calidad y confiabilidad del sistema. Incluye tests unitarios, de integración y end-to-end para todos los componentes críticos.

## Configuración de Testing

### 🛠️ **Stack de Testing**

- **Jest** - Framework de testing principal
- **React Testing Library** - Testing de componentes React
- **@testing-library/jest-dom** - Matchers adicionales para DOM
- **MSW (Mock Service Worker)** - Mocking de APIs (opcional)

### 📁 **Estructura de Tests**

```
__tests__/
├── components/           # Tests de componentes UI
│   ├── FileUploader.test.tsx
│   ├── ContactForm.test.tsx
│   └── AdminDashboard.test.tsx
├── hooks/               # Tests de hooks personalizados
│   ├── useFileManager.test.ts
│   └── useFirebaseData.test.ts
├── lib/                 # Tests de utilidades y servicios
│   ├── emailService.test.ts
│   └── firestore.test.ts
├── api/                 # Tests de API endpoints
│   ├── contact.test.ts
│   ├── files.test.ts
│   └── job-applications.test.ts
└── integration/         # Tests de integración
    ├── auth-flow.test.tsx
    └── file-upload-flow.test.tsx
```

### ⚙️ **Configuración**

#### **jest.config.js**
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}

module.exports = createJestConfig(customJestConfig)
```

#### **jest.setup.js**
```javascript
import '@testing-library/jest-dom'

// Mocks globales para Next.js, Firebase, etc.
```

## Estrategias de Testing

### 🧪 **Tests Unitarios**

#### **Componentes React**
```typescript
// Ejemplo: FileUploader.test.tsx
describe('FileUploader', () => {
  it('renders upload area correctly', () => {
    render(<FileUploader />)
    expect(screen.getByText('Subir archivos')).toBeInTheDocument()
  })

  it('validates file size correctly', async () => {
    const onError = jest.fn()
    render(<FileUploader maxFileSize={1} onError={onError} />)
    
    const largeFile = new File(['x'.repeat(2 * 1024 * 1024)], 'large.pdf')
    // ... test logic
    
    expect(onError).toHaveBeenCalledWith(
      expect.stringContaining('excede el tamaño máximo')
    )
  })
})
```

#### **Hooks Personalizados**
```typescript
// Ejemplo: useFileManager.test.ts
describe('useFileManager', () => {
  it('initializes with empty state', () => {
    const { result } = renderHook(() => useFileManager())
    
    expect(result.current.files).toEqual([])
    expect(result.current.loading).toBe(false)
  })

  it('handles file upload correctly', async () => {
    const { result } = renderHook(() => useFileManager())
    
    await act(async () => {
      await result.current.uploadFiles([mockFile])
    })
    
    expect(result.current.files).toHaveLength(1)
  })
})
```

#### **Servicios y Utilidades**
```typescript
// Ejemplo: emailService.test.ts
describe('Email Service', () => {
  it('sends contact confirmation email', async () => {
    mockResend.mockResolvedValueOnce({ id: 'email-id' })
    
    const result = await sendContactConfirmation(emailData)
    
    expect(result.success).toBe(true)
    expect(mockResend).toHaveBeenCalledWith({
      to: emailData.clientEmail,
      subject: expect.stringContaining(emailData.trackingId)
    })
  })
})
```

### 🔗 **Tests de Integración**

#### **API Endpoints**
```typescript
// Ejemplo: contact.test.ts
describe('/api/contact', () => {
  it('creates contact request successfully', async () => {
    mockCreateContactRequest.mockResolvedValueOnce('REQ-2025-001')
    
    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.trackingId).toBe('REQ-2025-001')
  })
})
```

#### **Flujos Completos**
```typescript
// Ejemplo: auth-flow.test.tsx
describe('Authentication Flow', () => {
  it('completes login process', async () => {
    render(<LoginForm />)
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }))
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })
})
```

### 🎯 **Tests de Componentes Críticos**

#### **1. Sistema de Archivos**

**FileUploader.test.tsx**
- ✅ Renderizado correcto
- ✅ Validación de tamaño de archivo
- ✅ Validación de tipo de archivo
- ✅ Límite máximo de archivos
- ✅ Drag & drop functionality
- ✅ Estados de carga
- ✅ Manejo de errores

**FileGallery.test.tsx**
- ✅ Visualización de archivos
- ✅ Filtros y búsqueda
- ✅ Acciones (ver, descargar, eliminar)
- ✅ Edición de metadatos
- ✅ Modos de vista (grid/list)

**useFileManager.test.ts**
- ✅ Estado inicial
- ✅ Subida de archivos
- ✅ Eliminación de archivos
- ✅ Cálculo de estadísticas
- ✅ Manejo de errores

#### **2. Sistema de Emails**

**emailService.test.ts**
- ✅ Envío de confirmaciones
- ✅ Notificaciones de asignación
- ✅ Cotizaciones por email
- ✅ Aplicaciones de empleo
- ✅ Validación de emails
- ✅ Manejo de rate limiting

#### **3. APIs Principales**

**contact.test.ts**
- ✅ Creación de solicitudes
- ✅ Validaciones de entrada
- ✅ Sanitización de datos
- ✅ Manejo de errores
- ✅ Integración con emails

**job-applications.test.ts**
- ✅ Envío de aplicaciones
- ✅ Actualización de estados
- ✅ Validaciones de archivos
- ✅ Notificaciones automáticas

### 🎨 **Mocking Strategies**

#### **Firebase Mocking**
```typescript
// Mock Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  onSnapshot: jest.fn(),
  // ... otros métodos
}))

// Mock Auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  // ... otros métodos
}))
```

#### **API Mocking**
```typescript
// Mock fetch global
global.fetch = jest.fn()

// Mock específico para Cloudinary
beforeEach(() => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      secure_url: 'https://cloudinary.com/test.jpg',
      public_id: 'test_id'
    })
  })
})
```

#### **Next.js Mocking**
```typescript
// Mock router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {}
  })
}))

// Mock navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn()
  })
}))
```

### 📊 **Coverage y Métricas**

#### **Objetivos de Coverage**
- **Líneas**: 70% mínimo
- **Funciones**: 70% mínimo
- **Branches**: 70% mínimo
- **Statements**: 70% mínimo

#### **Componentes Críticos** (90%+ coverage)
- Sistema de autenticación
- APIs de contacto y empleos
- Gestión de archivos
- Servicio de emails
- Validaciones de formularios

#### **Reportes de Coverage**
```bash
# Generar reporte de coverage
npm run test:coverage

# Ver reporte en HTML
open coverage/lcov-report/index.html
```

### 🚀 **Scripts de Testing**

#### **package.json**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:unit": "jest --testPathPattern=__tests__/(components|hooks|lib)",
    "test:integration": "jest --testPathPattern=__tests__/(api|integration)",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

#### **Comandos Útiles**
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar solo tests unitarios
npm run test:unit

# Ejecutar solo tests de integración
npm run test:integration

# Ejecutar tests específicos
npm test -- FileUploader

# Debug de tests
npm run test:debug
```

### 🔧 **Configuración de CI/CD**

#### **GitHub Actions**
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

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
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
```

### 🎯 **Mejores Prácticas**

#### **Estructura de Tests**
1. **Arrange** - Configurar el test
2. **Act** - Ejecutar la acción
3. **Assert** - Verificar el resultado

```typescript
describe('Component', () => {
  it('should do something', () => {
    // Arrange
    const props = { value: 'test' }
    
    // Act
    render(<Component {...props} />)
    
    // Assert
    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
```

#### **Naming Conventions**
- **Descriptivo**: `it('should validate email format correctly')`
- **Comportamiento**: `it('displays error when file is too large')`
- **Contexto**: `describe('when user is authenticated')`

#### **Test Data**
```typescript
// Usar factories para datos de test
const createMockFile = (overrides = {}) => ({
  name: 'test.pdf',
  size: 1024,
  type: 'application/pdf',
  ...overrides
})

const createMockUser = (overrides = {}) => ({
  uid: 'test-uid',
  email: 'test@example.com',
  role: 'client',
  ...overrides
})
```

#### **Async Testing**
```typescript
// Usar waitFor para operaciones asíncronas
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})

// Usar act para updates de estado
await act(async () => {
  await result.current.uploadFile(mockFile)
})
```

### 🐛 **Debugging Tests**

#### **Técnicas de Debug**
```typescript
// Ver el DOM actual
screen.debug()

// Ver queries disponibles
screen.logTestingPlaygroundURL()

// Usar console.log en tests
console.log('Current state:', result.current.files)

// Breakpoints en tests
debugger
```

#### **Errores Comunes**
1. **Act Warnings** - Usar `act()` para updates de estado
2. **Async Issues** - Usar `waitFor()` para operaciones asíncronas
3. **Mock Issues** - Verificar que los mocks estén configurados correctamente
4. **Cleanup** - Limpiar mocks entre tests

### 📈 **Métricas y Monitoreo**

#### **KPIs de Testing**
- **Test Success Rate**: >95%
- **Coverage**: >70% general, >90% crítico
- **Test Execution Time**: <2 minutos
- **Flaky Test Rate**: <5%

#### **Reportes Automáticos**
- Coverage reports en cada PR
- Test results en CI/CD
- Performance metrics de tests
- Alertas por tests fallidos

### 🔄 **Mantenimiento de Tests**

#### **Revisión Regular**
- **Semanal**: Revisar tests fallidos
- **Mensual**: Actualizar mocks y datos de test
- **Trimestral**: Revisar coverage y métricas
- **Anual**: Refactorizar tests obsoletos

#### **Actualización de Tests**
```typescript
// Mantener tests actualizados con cambios de API
// Actualizar mocks cuando cambien las dependencias
// Refactorizar tests duplicados
// Eliminar tests obsoletos
```

---

**Nota**: Esta guía de testing asegura la calidad y confiabilidad del sistema mediante una cobertura completa de tests unitarios, de integración y end-to-end, siguiendo las mejores prácticas de la industria.