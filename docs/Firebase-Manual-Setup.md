# Configuración Manual de Firebase

## 🔥 Pasos para Configurar Firebase

### 1. **Habilitar Firestore Database**
1. Ve a https://console.firebase.google.com/
2. Selecciona proyecto "website-ferreteria"
3. **Firestore Database** → **Create database**
4. **Start in test mode** → **Next**
5. Selecciona ubicación (us-central) → **Done**

### 2. **Habilitar Authentication**
1. **Authentication** → **Get started**
2. **Sign-in method** → **Email/Password** → **Enable**
3. **Users** → **Add user**:
   - Email: `administrador@ferrelamichoacana.com`
   - Password: `admin123` (temporal)

### 3. **Configurar Reglas de Firestore (Temporal)**
Ve a **Firestore Database** → **Rules** y pega:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas temporales para desarrollo
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 📊 Estructura de Colecciones a Crear

### **Colección: branches**
```json
// Documento: morelia-centro
{
  "id": "morelia-centro",
  "name": "Sucursal Morelia Centro",
  "city": "Morelia",
  "state": "Michoacán",
  "address": "Av. Madero #123, Centro Histórico",
  "phone": "(443) 123-4567",
  "email": "morelia@ferreterialamichoacana.com",
  "schedule": "Lun-Vie: 8:00-19:00, Sáb: 8:00-17:00, Dom: 9:00-15:00",
  "coordinates": {
    "lat": 19.7026,
    "lng": -101.1947
  },
  "isMain": true,
  "services": ["Venta al público", "Venta mayorista", "Entrega a domicilio", "Asesoría técnica"],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}

// Documento: uruapan
{
  "id": "uruapan",
  "name": "Sucursal Uruapan",
  "city": "Uruapan",
  "state": "Michoacán",
  "address": "Blvd. Industrial #456, Col. Industrial",
  "phone": "(452) 234-5678",
  "email": "uruapan@ferreterialamichoacana.com",
  "schedule": "Lun-Vie: 8:00-18:00, Sáb: 8:00-16:00",
  "coordinates": {
    "lat": 19.4215,
    "lng": -102.0630
  },
  "isMain": false,
  "services": ["Venta al público", "Venta mayorista", "Entrega a domicilio"],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}

// Documento: zamora
{
  "id": "zamora",
  "name": "Sucursal Zamora",
  "city": "Zamora",
  "state": "Michoacán",
  "address": "Carr. Nacional #789, Col. Centro",
  "phone": "(351) 345-6789",
  "email": "zamora@ferreterialamichoacana.com",
  "schedule": "Lun-Vie: 8:00-18:00, Sáb: 8:00-16:00",
  "coordinates": {
    "lat": 19.9872,
    "lng": -102.2831
  },
  "isMain": false,
  "services": ["Venta al público", "Entrega a domicilio", "Asesoría técnica"],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}

// Documento: guadalajara
{
  "id": "guadalajara",
  "name": "Sucursal Guadalajara",
  "city": "Guadalajara",
  "state": "Jalisco",
  "address": "Av. López Mateos #321, Col. Americana",
  "phone": "(33) 456-7890",
  "email": "guadalajara@ferreterialamichoacana.com",
  "schedule": "Lun-Vie: 8:00-19:00, Sáb: 8:00-17:00",
  "coordinates": {
    "lat": 20.6597,
    "lng": -103.3496
  },
  "isMain": false,
  "services": ["Venta al público", "Venta mayorista", "Entrega a domicilio", "Asesoría técnica"],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}

// Documento: leon
{
  "id": "leon",
  "name": "Sucursal León",
  "city": "León",
  "state": "Guanajuato",
  "address": "Blvd. Adolfo López Mateos #654, Col. Centro",
  "phone": "(477) 567-8901",
  "email": "leon@ferreterialamichoacana.com",
  "schedule": "Lun-Vie: 8:00-18:00, Sáb: 8:00-16:00",
  "coordinates": {
    "lat": 21.1619,
    "lng": -101.6739
  },
  "isMain": false,
  "services": ["Venta al público", "Venta mayorista", "Entrega a domicilio"],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### **Colección: users**
```json
// Documento: admin-user-1
{
  "uid": "admin-user-1",
  "email": "administrador@ferrelamichoacana.com",
  "displayName": "Administrador Principal",
  "role": "admin",
  "phone": "(443) 123-4567",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### **Colección: systemConfig**
```json
// Documento: general
{
  "siteName": "Ferretería La Michoacana",
  "maintenanceMode": false,
  "allowRegistration": true,
  "defaultUserRole": "cliente",
  "contactEmail": "contacto@ferreterialamichoacana.com",
  "supportEmail": "soporte@ferreterialamichoacana.com",
  "phone": "(443) 123-4567",
  "address": "Av. Madero #123, Centro Histórico, Morelia, Michoacán",
  "socialMedia": {
    "facebook": "https://facebook.com/ferreterialamichoacana",
    "whatsapp": "+524431234567"
  },
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### **Colección: brands**
```json
// Documento: dewalt
{
  "name": "DeWalt",
  "logoUrl": "https://res.cloudinary.com/demo/image/upload/v1/brands/dewalt-logo.png",
  "category": "Herramientas Eléctricas",
  "description": "Herramientas profesionales de alta calidad",
  "website": "https://www.dewalt.com",
  "active": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}

// Documento: makita
{
  "name": "Makita",
  "logoUrl": "https://res.cloudinary.com/demo/image/upload/v1/brands/makita-logo.png",
  "category": "Herramientas",
  "description": "Innovación en herramientas eléctricas",
  "website": "https://www.makita.com",
  "active": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}

// Documento: truper
{
  "name": "Truper",
  "logoUrl": "https://res.cloudinary.com/demo/image/upload/v1/brands/truper-logo.png",
  "category": "Herramientas Mexicanas",
  "description": "Herramientas mexicanas de calidad",
  "website": "https://www.truper.com",
  "active": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

## 🚀 Pasos para Crear Manualmente

### **En Firebase Console:**

1. **Ve a Firestore Database**
2. **Click "Start collection"**
3. **Collection ID**: `branches`
4. **Document ID**: `morelia-centro`
5. **Pega el JSON** de arriba campo por campo
6. **Repite** para cada sucursal

### **Colecciones Mínimas para Empezar:**
- ✅ `branches` (5 documentos)
- ✅ `users` (1 documento)
- ✅ `systemConfig` (1 documento)
- ✅ `brands` (3 documentos)

### **Colecciones que se Crearán Automáticamente:**
- `contactRequests` (cuando alguien envíe formulario)
- `jobPostings` (cuando se creen vacantes)
- `jobApplications` (cuando alguien aplique)
- `itTickets` (cuando se reporten problemas)
- `chatMessages` (cuando se use el chat)

## ✅ Verificación

Una vez creadas las colecciones básicas, el proyecto debería funcionar correctamente y podrás:

1. **Ver sucursales** en la página principal
2. **Enviar formularios** de contacto
3. **Autenticarse** como administrador
4. **Acceder a dashboards** según el rol

## 🔧 Próximos Pasos

1. Crear las colecciones básicas manualmente
2. Probar la autenticación
3. Implementar el formulario de contacto funcional
4. Desarrollar los dashboards por rol