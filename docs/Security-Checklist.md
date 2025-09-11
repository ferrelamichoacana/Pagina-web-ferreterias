# 🔒 Security Checklist para Firebase

## ✅ Variables de Entorno Seguras vs Sensibles

### 🟢 SEGURO para NEXT_PUBLIC_ (se exponen al cliente)
- `NEXT_PUBLIC_FIREBASE_API_KEY` ✅ **SEGURO**
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` ✅ **SEGURO**  
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` ✅ **SEGURO**
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` ✅ **SEGURO**
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` ✅ **SEGURO**
- `NEXT_PUBLIC_FIREBASE_APP_ID` ✅ **SEGURO**

### 🔴 SENSIBLE - NUNCA uses NEXT_PUBLIC_
- `FIREBASE_PRIVATE_KEY` ❌ **PRIVADA**
- `FIREBASE_CLIENT_EMAIL` ❌ **PRIVADA**
- `RESEND_API_KEY` ❌ **PRIVADA**
- `CLOUDINARY_API_SECRET` ❌ **PRIVADA**

## 🛡️ Medidas de Seguridad Implementadas

### 1. Firebase Security Rules
- ✅ Reglas de Firestore configuradas
- ✅ Reglas de Storage configuradas
- ✅ Autenticación por roles
- ✅ Validación de permisos por documento

### 2. Validación de Dominio
- ✅ Lista de dominios permitidos
- ✅ Validación en tiempo de ejecución
- ✅ Configuración por ambiente

### 3. Configuración de Red
- ✅ Headers de seguridad
- ✅ Políticas de CORS
- ✅ Rate limiting en APIs

### 4. Monitoreo y Logs
- ✅ Logs de sistema
- ✅ Alertas de seguridad
- ✅ Auditoría de accesos

## 🔧 Configuración Recomendada

### En Firebase Console:
1. **Authentication:**
   - Habilitar solo métodos necesarios (Email/Password)
   - Configurar dominios autorizados
   - Establecer límites de intentos

2. **Firestore:**
   - Aplicar reglas de seguridad estrictas
   - Habilitar auditoría
   - Configurar índices necesarios

3. **Storage:**
   - Reglas de acceso por usuario/rol
   - Límites de tamaño de archivo
   - Validación de tipos de archivo

### En Vercel:
1. **Variables de Entorno:**
   - Configurar todas las variables Firebase
   - NO exponer las claves privadas
   - Usar variables diferentes por ambiente

2. **Configuración de Red:**
   - Headers de seguridad
   - Rate limiting
   - Configuración de dominios

## ⚠️ Recordatorios Importantes

1. **Firebase API Key es PUBLIC por diseño** - Google lo confirma en su documentación
2. **La seguridad está en las Rules, no en la API Key**
3. **NUNCA expongas las claves privadas del Admin SDK**
4. **Siempre valida permisos en el backend**
5. **Monitorea el uso y accesos regularmente**

## 📚 Referencias
- [Firebase Security Documentation](https://firebase.google.com/docs/rules)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Security Best Practices](https://vercel.com/docs/security)
