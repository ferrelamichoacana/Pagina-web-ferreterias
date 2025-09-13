#!/bin/bash

echo "🔥 FIREBASE FIRESTORE INDEX CREATOR"
echo "===================================="
echo ""

# Verificar si gcloud está instalado
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI no está instalado"
    echo "📥 Instala gcloud CLI desde: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Verificar autenticación
echo "🔍 Verificando autenticación de gcloud..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 &> /dev/null; then
    echo "⚠️  No hay cuenta autenticada en gcloud"
    echo "🔑 Ejecutando autenticación..."
    gcloud auth login
fi

# Verificar proyecto configurado
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "⚠️  No hay proyecto configurado"
    echo "📝 Lista de proyectos disponibles:"
    gcloud projects list
    echo ""
    read -p "🎯 Ingresa el PROJECT_ID de tu proyecto Firebase: " PROJECT_ID
    gcloud config set project $PROJECT_ID
fi

echo "✅ Proyecto configurado: $PROJECT_ID"
echo ""

# Preguntar si desea continuar
echo "🚀 Se crearán 16 índices compuestos en Firestore"
echo "📊 Distribución:"
echo "   • 4 índices CRÍTICOS (contactRequests, brands)"
echo "   • 5 índices de ALTA prioridad"
echo "   • 6 índices de prioridad MEDIA"
echo "   • 1 índice de BAJA prioridad"
echo ""
read -p "¿Deseas continuar? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operación cancelada"
    exit 1
fi

echo ""
echo "🎯 Iniciando creación de índices..."
echo "⏳ Esto puede tomar varios minutos..."
echo ""

# Ejecutar script de creación
./create-all-indexes.sh

echo ""
echo "✅ ¡Proceso completado!"
echo ""
echo "📋 Próximos pasos:"
echo "1. 🌐 Verificar en Firebase Console:"
echo "   https://console.firebase.google.com/project/$PROJECT_ID/firestore/indexes"
echo "2. ⏳ Los índices pueden tardar varios minutos en construirse"
echo "3. 🔄 Algunos índices pueden requerir tiempo adicional para grandes colecciones"
echo "4. ✨ Una vez completados, las consultas serán mucho más rápidas"
echo ""
echo "🎉 ¡Firebase está listo para producción!"
