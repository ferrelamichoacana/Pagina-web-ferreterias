# .gitignore - Resumen de Configuración

## ✅ Archivos Críticos Protegidos:

### 🔥 **CREDENCIALES Y SECRETOS - NO DEBEN SUBIRSE NUNCA:**
- `website-ferreteria-firebase-adminsdk-*.json` - Credenciales de Firebase
- `.env.local` - Variables de entorno locales
- `.env` - Variables de entorno
- `*.key`, `*.crt`, `*.p12`, `*.pem` - Certificados y llaves

### 🏗️ **ARCHIVOS DE BUILD Y CACHE:**
- `.next/` - Build de Next.js
- `.swc/` - Cache de SWC compiler
- `tsconfig.tsbuildinfo` - Cache de TypeScript
- `node_modules/` - Dependencias de npm

### 🧪 **ARCHIVOS DE TESTING:**
- `coverage/` - Reportes de cobertura
- `.jest/` - Cache de Jest
- `.nyc_output/` - Cobertura de NYC

### 💻 **ARCHIVOS DE IDE Y OS:**
- `.vscode/` - Configuración de VS Code
- `.DS_Store` - Archivos de macOS
- `Thumbs.db` - Archivos de Windows

## 📝 Estado Actual:
```
✅ Firebase credentials: PROTEGIDO
✅ Environment variables: PROTEGIDO  
✅ Build artifacts: PROTEGIDO
✅ Node modules: PROTEGIDO
✅ IDE files: PROTEGIDO
✅ OS files: PROTEGIDO
```

## ⚠️ Verificación de Seguridad:
- NO hay credenciales de Firebase en el repositorio
- NO hay variables de entorno sensibles expuestas
- NO hay archivos de build o cache en git

## 🔄 Para revisar archivos ignorados:
```bash
git status --ignored
```

## 🚨 Si accidentalmente subes credenciales:
1. `git rm --cached archivo-sensible`
2. Agregar al .gitignore
3. `git commit -m "Remove sensitive file"`
4. Regenerar las credenciales en Firebase Console
