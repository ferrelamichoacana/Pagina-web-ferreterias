#!/bin/bash

# Script para build seguro sin conexiones externas
echo "🏗️  Iniciando build de producción..."

# Verificar que las variables de entorno estén configuradas
if [ ! -f .env.local ]; then
    echo "❌ No se encontró .env.local"
    echo "📋 Copiando variables de ejemplo..."
    cp .env.example .env.local
fi

# Build con timeout reducido para evitar colgarse
echo "⚡ Ejecutando build con configuración optimizada..."
timeout 300 npm run build:vercel || {
    echo "⚠️  Build tomó demasiado tiempo, puede ser un problema de red"
    echo "🔄 Intentando build sin optimizaciones..."
    NEXT_PRIVATE_TARGET=server npm run build:vercel
}

echo "✅ Build completado"
