# Firestore Indexes Creation Script

## Descripción

Este script resuelve el error de Firestore: "The query requires an index" mediante la creación automática de todos los índices compuestos necesarios para las consultas de la aplicación.

## Error Específico Resuelto

```
FirebaseError: [code=failed-precondition]: The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/website-ferreteria/firestore/indexes?create_composite=...
```

## Índices Creados

El script crea los siguientes índices compuestos:

### 1. News Collection
- `active` (ASC) + `order` (ASC) + `__name__` (ASC) - **Resuelve el error principal**
- `active` (ASC) + `date` (DESC) + `__name__` (ASC)
- `active` (ASC) + `featured` (ASC) + `date` (DESC)
- `active` (ASC) + `type` (ASC) + `date` (DESC)
- `featured` (ASC) + `date` (DESC) + `__name__` (ASC)
- `type` (ASC) + `date` (DESC) + `__name__` (ASC)

### 2. Branches Collection
- `active` (ASC) + `name` (ASC) + `__name__` (ASC)

### 3. Brands Collection
- `active` (ASC) + `name` (ASC) + `__name__` (ASC)

### 4. Job Applications Collection
- `status` (ASC) + `createdAt` (DESC) + `__name__` (ASC)
- `branchId` (ASC) + `createdAt` (DESC) + `__name__` (ASC)
- `assignedTo` (ASC) + `createdAt` (DESC) + `__name__` (ASC)

### 5. Quotations Collection
- `status` (ASC) + `createdAt` (DESC) + `__name__` (ASC)
- `branchId` (ASC) + `createdAt` (DESC) + `__name__` (ASC)

### 6. Contact Requests Collection
- `email` (ASC) + `createdAt` (DESC) + `__name__` (ASC)
- `userId` (ASC) + `createdAt` (DESC) + `__name__` (ASC)
- `status` (ASC) + `createdAt` (DESC) + `__name__` (ASC)

### 7. Files Collection
- `uploadedBy` (ASC) + `uploadedAt` (DESC) + `__name__` (ASC)
- `relatedTo` (ASC) + `uploadedAt` (DESC) + `__name__` (ASC)
- `relatedType` (ASC) + `uploadedAt` (DESC) + `__name__` (ASC)
- `category` (ASC) + `uploadedAt` (DESC) + `__name__` (ASC)

## Uso

### Opción 1: Ejecutar el Script (Recomendado)

```bash
npm run create-indexes
```

El script te dará tres opciones:
1. **Firebase Console** (Recomendado para principiantes)
2. **gcloud CLI** (Para usuarios avanzados)
3. **Creación automática** (Requiere gcloud instalado)

### Opción 2: Creación Manual

Si prefieres crear los índices manualmente, el script te proporcionará:
- URLs directas a Firebase Console para cada índice
- Comandos gcloud para cada índice

### Opción 3: Solo el Índice Principal

Para resolver solo el error específico de `news` collection:

1. Ve a: https://console.firebase.google.com/project/website-ferreteria/firestore/indexes
2. Crea un índice compuesto con:
   - Collection: `news`
   - Fields: `active` (Ascending), `order` (Ascending)

## Requisitos

### Para el Script
- Node.js con TypeScript
- Firebase Admin SDK configurado
- Variable de entorno `FIREBASE_SERVICE_ACCOUNT_KEY`

### Para Creación Automática (Opcional)
- gcloud CLI instalado
- Autenticación con permisos de Firestore Editor

## Variables de Entorno Necesarias

```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=website-ferreteria
```

## Instalación de gcloud CLI (Opcional)

### macOS
```bash
# Con Homebrew
brew install google-cloud-sdk

# Configurar
gcloud auth login
gcloud config set project website-ferreteria
```

### Otras Plataformas
https://cloud.google.com/sdk/docs/install

## Verificación

Después de crear los índices:

1. Espera 5-10 minutos para que se activen
2. Recarga tu aplicación
3. Los errores de "index required" deberían desaparecer

## Monitoreo

Verifica el estado de los índices en:
https://console.firebase.google.com/project/website-ferreteria/firestore/indexes

## Notas Importantes

- Los índices pueden tardar varios minutos en estar listos
- Solo crea los índices que realmente necesitas
- Algunos índices pueden ya existir
- El script detecta automáticamente el proyecto de Firebase

## Solución de Problemas

### Error: "Firebase Admin SDK not initialized"
Verifica que `FIREBASE_SERVICE_ACCOUNT_KEY` esté configurado correctamente.

### Error: "Project not found"
Verifica que `NEXT_PUBLIC_FIREBASE_PROJECT_ID` sea correcto.

### Error: "Permission denied"
Asegúrate de que el service account tenga permisos de Firestore Editor.
