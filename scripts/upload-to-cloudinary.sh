#!/bin/bash

# Script para subir manualmente una imagen a Cloudinary como prueba
# Reemplaza YOUR_CLOUD_NAME, YOUR_API_KEY, y YOUR_API_SECRET con tus credenciales reales

echo "🏷️  Script de subida manual a Cloudinary"
echo "══════════════════════════════════════════"

# Variables de configuración (EDITA ESTAS)
CLOUD_NAME="dino-cloudinary"
API_KEY="YOUR_API_KEY"  # Reemplaza con tu API key real
API_SECRET="YOUR_API_SECRET"  # Reemplaza con tu API secret real

# Verificar que las credenciales estén configuradas
if [ "$API_KEY" = "YOUR_API_KEY" ] || [ "$API_SECRET" = "YOUR_API_SECRET" ]; then
    echo "❌ Error: Configura primero tus credenciales de Cloudinary"
    echo "   Edita este archivo y reemplaza YOUR_API_KEY y YOUR_API_SECRET"
    echo "   Puedes encontrar estas credenciales en: https://cloudinary.com/console"
    exit 1
fi

# Directorio de imágenes
IMAGES_DIR="./public/images"

# Lista de logos a subir
declare -a logos=(
    "haefele_logo.png:hafele"
    "logo_cerrajes.png:cerrajes"
    "logo_dewalt.png:dewalt"
    "logo_handyhome.png:handyhome"
    "logo_herma.png:herma"
    "logo_makita.png:makita"
    "logo_resistol.png:resistol"
    "logo_sayer.png:sayer"
    "logo_silverline.png:silverline"
    "logo_soarma.png:soarma"
    "logo_truper.png:truper"
)

echo "📤 Subiendo ${#logos[@]} logos a Cloudinary..."
echo ""

# Subir cada logo
for logo_info in "${logos[@]}"; do
    IFS=':' read -r filename brand_key <<< "$logo_info"
    filepath="$IMAGES_DIR/$filename"
    
    if [ ! -f "$filepath" ]; then
        echo "❌ $filename - archivo no encontrado"
        continue
    fi
    
    echo "📤 Subiendo $filename..."
    
    # Subir a Cloudinary usando curl
    response=$(curl -s -X POST \
        "https://api.cloudinary.com/v1_1/$CLOUD_NAME/image/upload" \
        -F "file=@$filepath" \
        -F "public_id=ferreteria-la-michoacana/brands/$brand_key" \
        -F "api_key=$API_KEY" \
        -F "api_secret=$API_SECRET" \
        -F "overwrite=true" \
        -F "resource_type=image")
    
    # Verificar respuesta
    if echo "$response" | grep -q "secure_url"; then
        secure_url=$(echo "$response" | grep -o '"secure_url":"[^"]*"' | cut -d'"' -f4)
        echo "   ✅ $filename → $secure_url"
    else
        echo "   ❌ Error subiendo $filename"
        echo "   Respuesta: $response"
    fi
    
    echo ""
done

echo "🎉 Subida completada!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Verifica las imágenes en tu dashboard de Cloudinary"
echo "   2. Ejecuta: npm run migrate-brands-complete"
echo "   3. Las URLs ya están configuradas en el script de migración"
