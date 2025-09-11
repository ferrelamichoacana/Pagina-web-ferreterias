# Firebase Security Rules Configuration

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios - solo pueden leer/escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Solicitudes de contacto - solo lectura para administradores, escritura para usuarios autenticados
    match /contact-requests/{requestId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'manager']);
    }
    
    // Cotizaciones - usuarios pueden crear, admin/manager pueden gestionar
    match /quotations/{quotationId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'manager', 'vendor']);
      allow update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'manager'];
    }
    
    // Aplicaciones de trabajo - usuarios pueden aplicar, HR puede gestionar
    match /job-applications/{applicationId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
        (resource.data.applicantId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'hr']);
      allow update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'hr'];
    }
    
    // Configuración del sistema - solo administradores
    match /system-config/{configId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Logs del sistema - solo lectura para administradores
    match /system-logs/{logId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'it'];
      allow create: if request.auth != null;
    }
    
    // Sucursales - lectura pública, escritura para admin/manager
    match /branches/{branchId} {
      allow read: if true; // Información pública
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'manager'];
    }
    
    // Marcas - lectura pública, escritura para admin/manager
    match /brands/{brandId} {
      allow read: if true; // Información pública
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'manager'];
    }
    
    // Denegar todo lo demás
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Firebase Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Archivos de usuario - solo el propietario puede acceder
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Archivos públicos - lectura pública, escritura para admin
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/(default)/documents/users/$(request.auth.uid)).data.role in ['admin', 'manager'];
    }
    
    // Archivos de cotizaciones - acceso controlado
    match /quotations/{quotationId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        (get(/databases/(default)/documents/quotations/$(quotationId)).data.userId == request.auth.uid ||
         get(/databases/(default)/documents/users/$(request.auth.uid)).data.role in ['admin', 'manager', 'vendor']);
    }
    
    // Archivos temporales - solo para usuarios autenticados
    match /temp/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Configuración de Authentication

- Habilitar solo los métodos de autenticación necesarios
- Configurar dominios autorizados
- Establecer límites de tasa para prevenir ataques
