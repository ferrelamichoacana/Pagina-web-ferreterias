# 🔥 Guía Rápida: Solucionar Error de Índice de Firestore

## ❌ Error Actual
```
FirebaseError: [code=failed-precondition]: The query requires an index.
```

## ✅ Solución Principal

Necesitas crear este índice específico para resolver el error:

### **ÍNDICE PRINCIPAL PARA NEWS COLLECTION**

**📍 URL Directa para Crear Índice:**
```
https://console.firebase.google.com/v1/r/project/website-ferreteria/firestore/indexes?create_composite=Ck9wcm9qZWN0cy93ZWJzaXRlLWZlcnJldGVyaWEvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL25ld3MvaW5kZXhlcy9fEAEaCgoGYWN0aXZlEAEaCQoFb3JkZXIQARoMCghfX25hbWVfXxAB
```

**🛠 Creación Manual:**
1. Ve a [Firebase Console - Firestore Indexes](https://console.firebase.google.com/project/website-ferreteria/firestore/indexes)
2. Haz clic en "Create Index"
3. Configura:
   - **Collection ID**: `news`
   - **Field path 1**: `active` → **Order**: Ascending
   - **Field path 2**: `order` → **Order**: Ascending
4. Haz clic en "Create Index"

---

## 🎯 Índices Adicionales Recomendados

Para evitar futuros errores, crea también estos índices:

### 1. **News - Active + Date**
- Collection: `news`
- Fields: `active` (ASC) + `date` (DESC)

### 2. **News - Featured + Date**  
- Collection: `news`
- Fields: `featured` (ASC) + `date` (DESC)

### 3. **News - Type + Date**
- Collection: `news`  
- Fields: `type` (ASC) + `date` (DESC)

### 4. **Branches - Active + Name**
- Collection: `branches`
- Fields: `active` (ASC) + `name` (ASC)

### 5. **Brands - Active + Name**
- Collection: `brands`
- Fields: `active` (ASC) + `name` (ASC)

---

## ⚡ Comando gcloud (Alternativo)

Si tienes gcloud CLI instalado:

```bash
# Instalar gcloud CLI (solo una vez)
brew install google-cloud-sdk

# Configurar proyecto
gcloud auth login
gcloud config set project website-ferreteria

# Crear el índice principal
gcloud firestore indexes composite create \
  --collection-group=news \
  --field-config=active:ascending,order:ascending
```

---

## ⏱ Tiempo de Creación

- Los índices simples tardan **1-5 minutos**
- Los índices compuestos pueden tardar **5-15 minutos**
- Verifica el estado en la consola de Firebase

---

## 🔍 Verificación

1. Espera a que el índice aparezca como "Enabled" en Firebase Console
2. Recarga tu aplicación
3. El error debe desaparecer

---

## 📱 Enlaces Rápidos

- [Firebase Console - Proyecto](https://console.firebase.google.com/project/website-ferreteria)
- [Firestore Indexes](https://console.firebase.google.com/project/website-ferreteria/firestore/indexes)
- [Documentación Firestore](https://firebase.google.com/docs/firestore/query-data/indexing)

---

## 🆘 Si Necesitas Ayuda

1. Revisa que el proyecto sea correcto: `website-ferreteria`
2. Asegúrate de tener permisos de Editor en Firebase
3. Si el índice falla, usa la URL directa del error proporcionada por Firebase

**¡Listo! 🎉 Tu aplicación debería funcionar sin errores después de crear el índice principal.**
