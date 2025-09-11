# 🐛 Debug Guide - Firebase & Marcas

## 🔧 **Cambios Implementados**

### ✅ **Mocks Eliminados**
- ❌ Removidos datos mock de `BrandsManager.tsx`
- ✅ Ahora usa solo datos reales de Firebase
- ✅ Debug logs agregados para rastrear problemas

### ✅ **Validación de Sitio Web Mejorada**
- ❌ Removida validación estricta `type="url"`
- ✅ Permite escribir solo dominio (ej: `marca.com`)
- ✅ Auto-agrega `https://` si no tiene protocolo
- ✅ Acepta campo vacío

### ✅ **Debug Completo Implementado**
- 🔍 Logs detallados en consola del navegador
- 🧪 Componente de test de conexión Firebase
- 📊 Info de estado en tiempo real
- 🔄 Botones de recarga y retry

---

## 🕵️ **Cómo Debuggear**

### **1. Abrir Panel de Administración**
```
1. Ir a /dashboard/admin
2. Hacer clic en pestaña "Marcas"
3. Abrir DevTools (F12)
4. Ver pestaña "Console"
```

### **2. Verificar Logs en Consola**
Busca estos logs en la consola:

#### **🔥 Firebase Configuration**
```
🔥 Firebase initialized successfully
📋 Project ID: tu-project-id
🔑 API Key (obfuscated): AIz***
🗄️ Firestore DB: Inicializada
🔐 Auth: Inicializada
```

#### **🔄 Hook de Marcas**
```
🔄 Iniciando useBrands hook
🔥 Firebase db: Configurado
📥 Snapshot recibido: { size: 0, empty: true, docs: 0 }
✅ Marcas procesadas: []
📊 useBrands estado actual: { brandsCount: 0, loading: false, error: null }
```

#### **🚀 API Calls**
```
🚀 API POST /api/brands iniciado
📥 Datos recibidos: { name: "Test", category: "Test" }
🌐 Website procesado: { original: "test.com", processed: "https://test.com" }
💾 Guardando en Firestore: { name: "Test", ... }
✅ Marca creada con ID: xyz123
```

### **3. Test de Conexión Firebase**
El componente de test aparece arriba del formulario y muestra:

#### **✅ Conexión Exitosa**
```
✅ Conexión exitosa

Resultados de Pruebas:
✅ Firebase DB Configuration - DB configurada correctamente
✅ Read Brands Collection - 0 documentos encontrados  
✅ Write Test Document - Documento creado con ID: abc123
```

#### **❌ Error de Conexión**
```
❌ Error de conexión
Error: Missing or insufficient permissions

Resultados de Pruebas:
✅ Firebase DB Configuration - DB configurada correctamente
❌ Firebase Operations - Missing or insufficient permissions
```

---

## 🚨 **Problemas Comunes y Soluciones**

### **Problem 1: "Firebase no está configurado"**

#### **Síntomas:**
- Error en consola: `❌ Firebase db no configurado`
- Test muestra: `❌ DB no configurada`

#### **Solución:**
```bash
# Verificar variables de entorno
echo $NEXT_PUBLIC_FIREBASE_API_KEY
echo $NEXT_PUBLIC_FIREBASE_PROJECT_ID

# Si están vacías, configurar en .env.local:
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
# ... resto de variables
```

### **Problem 2: "Permission denied"**

#### **Síntomas:**
- Error: `Missing or insufficient permissions`
- Logs: `💥 Error creating brand: FirebaseError: Missing or insufficient permissions`

#### **Solución:**
```javascript
// Verificar reglas de Firestore en Firebase Console:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /brands/{document} {
      allow read, write: if true; // Temporalmente para debug
    }
  }
}
```

### **Problem 3: "No se ven las marcas"**

#### **Síntomas:**
- Log: `📥 Snapshot recibido: { size: 0, empty: true }`
- UI muestra: "No hay marcas registradas"

#### **Solución:**
```bash
# Ejecutar migración de datos reales:
npm run migrate-brands

# O usar Firebase Debugger:
# Dashboard Admin → Firebase Debug → brands → Agregar documentos
```

### **Problem 4: "Website inválido"**

#### **Síntomas:**
- Error al guardar: "URL del sitio web debe comenzar con http"
- Form no acepta dominios simples

#### **✅ Solucionado:**
- Ahora acepta: `marca.com`, `www.marca.com`, `https://marca.com`
- Auto-convierte `marca.com` → `https://marca.com`
- Campo opcional (puede estar vacío)

---

## 📝 **Comandos de Debug Útiles**

### **En el Navegador (Console):**
```javascript
// Verificar Firebase
console.log('Firebase DB:', window.firebase?.db)

// Probar conexión manual
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
getDocs(collection(db, 'brands')).then(console.log)

// Ver estado de React
// (En React DevTools)
```

### **En Terminal:**
```bash
# Migrar datos reales
npm run migrate-brands
npm run migrate-branches

# Verificar build
npm run build

# Revisar logs
npm run dev # y ver consola
```

### **Firebase Console:**
```
1. Ir a Firebase Console
2. Seleccionar proyecto
3. Firestore Database
4. Ver colección "brands"
5. Verificar documentos y permisos
```

---

## 🎯 **Testing Steps**

### **Test 1: Crear Nueva Marca**
```
1. Ir a Admin → Marcas
2. Clic "Agregar Marca"
3. Llenar formulario:
   - Nombre: "Test Brand"
   - Categoría: "Test"
   - Website: "test.com" (debe auto-convertir)
4. Clic "Crear"
5. Verificar logs en consola
6. Verificar que aparece en la lista
```

### **Test 2: Verificar Firebase**
```
1. Ver componente "Test de Conexión Firebase"
2. Debe mostrar ✅ en todas las pruebas
3. Si hay errores, clic "Reintentar"
4. Revisar variables de entorno mostradas
```

### **Test 3: Debug con Firebase Debugger**
```
1. Ir a Admin → Firebase Debug
2. Seleccionar colección "brands"
3. Ver documentos existentes
4. Crear documento de prueba
5. Verificar que aparece en Marcas
```

---

**🎉 Ahora tienes debug completo para identificar cualquier problema con Firebase y las marcas!**
