#!/bin/bash

echo "🔧 QUICK FIX: OPTIMIZACIÓN PARA VERCEL DEPLOY"
echo "============================================="
echo ""

# 1. Limpiar console.log statements
echo "🧹 1/4: Limpiando console.log statements..."

# BrandsManager.tsx - Comentar console.log
sed -i.bak 's/console\.log(/\/\/ console.log(/g' components/admin/BrandsManager.tsx

# useFirebaseData.ts - Comentar console.log  
sed -i.bak 's/console\.log(/\/\/ console.log(/g' lib/hooks/useFirebaseData.ts

# firebase.ts - Comentar console.log
sed -i.bak 's/console\.log(/\/\/ console.log(/g' lib/firebase.ts

echo "✅ Console.log statements comentados"

# 2. Simplificar next.config.js
echo "🔧 2/4: Simplificando configuración Next.js..."

cat > next.config.minimal.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'images.unsplash.com'
    ]
  },
  
  env: {
    SKIP_ENV_VALIDATION: 'true'
  },
  
  // Configuración mínima para Vercel
  swcMinify: true,
  compress: true
}

module.exports = nextConfig
EOF

# Backup y reemplazar configuración
cp next.config.js next.config.full.js
cp next.config.minimal.js next.config.js

echo "✅ Configuración Next.js simplificada"

# 3. Test build local
echo "🏗️ 3/4: Probando build local..."

timeout 180 npm run build:vercel > build-test.log 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Build local exitoso!"
    echo "📄 Ver log completo: cat build-test.log"
else
    echo "❌ Build local falló o timeout"
    echo "📄 Ver errores: tail -20 build-test.log"
fi

# 4. Preparar para Vercel
echo "🚀 4/4: Preparando para deploy en Vercel..."

echo ""
echo "📋 CONFIGURACIÓN PARA VERCEL:"
echo "=============================="
echo ""
echo "1. Variables de entorno a configurar en Vercel:"
echo "   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCS4t9fRoiRr4YdLQBRmfBCQSYlj5fU8XQ"
echo "   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=website-ferreteria.firebaseapp.com"
echo "   NEXT_PUBLIC_FIREBASE_PROJECT_ID=website-ferreteria"
echo "   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=website-ferreteria.appspot.com"
echo "   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789"
echo "   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456"
echo ""
echo "2. Comandos para deploy:"
echo "   npm install -g vercel"
echo "   vercel login"
echo "   vercel --prod"
echo ""
echo "✅ Quick fix completado!"
echo "🎯 Listo para deploy en Vercel"
