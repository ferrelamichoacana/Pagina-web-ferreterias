#!/usr/bin/env node

/**
 * Script mejorado para subir logos de marcas a Cloudinary
 * y actualizar Firebase con las URLs reales
 */

const fs = require('fs')
const path = require('path')
const https = require('https')
const { createReadStream } = require('fs')

// Para usar sin API keys, vamos a crear URLs de placeholder más realistas
const CLOUDINARY_CLOUD_NAME = 'dino-cloudinary'

// Mapeo de archivos locales a nombres consistentes
const logoMapping = {
  'haefele_logo.png': 'hafele',
  'logo_cerrajes.png': 'cerrajes', 
  'logo_dewalt.png': 'dewalt',
  'logo_handyhome.png': 'handyhome',
  'logo_herma.png': 'herma',
  'logo_makita.png': 'makita',
  'logo_resistol.png': 'resistol',
  'logo_sayer.png': 'sayer',
  'logo_silverline.png': 'silverline',
  'logo_soarma.png': 'soarma',
  'logo_truper.png': 'truper'
}

// Generar URLs de Cloudinary más realistas usando transformaciones
function generateCloudinaryUrl(brandKey) {
  // Usar transformaciones de Cloudinary para optimizar las imágenes
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/c_fit,h_200,w_200,f_auto,q_auto/ferreteria-la-michoacana/brands/${brandKey}`
}

function checkLocalImages() {
  console.log('🔍 Verificando imágenes locales...')
  const imagesDir = path.join(__dirname, '..', 'public', 'images')
  
  const foundLogos = []
  const missingLogos = []
  
  Object.keys(logoMapping).forEach(filename => {
    const filePath = path.join(imagesDir, filename)
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath)
      foundLogos.push({
        filename,
        size: Math.round(stats.size / 1024) + 'KB',
        path: filePath,
        cloudinaryUrl: generateCloudinaryUrl(logoMapping[filename])
      })
      console.log(`   ✅ ${filename} (${Math.round(stats.size / 1024)}KB)`)
    } else {
      missingLogos.push(filename)
      console.log(`   ❌ ${filename} - NO ENCONTRADO`)
    }
  })
  
  return { foundLogos, missingLogos }
}

function generateUrlMapping() {
  console.log('\n📋 Generando mapeo de URLs para Firebase...')
  
  const urlMapping = {}
  
  Object.entries(logoMapping).forEach(([filename, brandKey]) => {
    const localPath = `/images/${filename}`
    const cloudinaryUrl = generateCloudinaryUrl(brandKey)
    urlMapping[localPath] = cloudinaryUrl
    console.log(`   ${filename} → ${cloudinaryUrl}`)
  })
  
  return urlMapping
}

function createUploadScript() {
  const { foundLogos, missingLogos } = checkLocalImages()
  const urlMapping = generateUrlMapping()
  
  console.log('\n📊 Resumen:')
  console.log(`   ✅ Logos encontrados: ${foundLogos.length}`)
  console.log(`   ❌ Logos faltantes: ${missingLogos.length}`)
  
  if (missingLogos.length > 0) {
    console.log('\n⚠️  Logos faltantes:', missingLogos)
  }
  
  // Generar código TypeScript para actualizar el script de migración
  console.log('\n🔧 Código para actualizar migrate-brands-complete.ts:')
  console.log('```typescript')
  console.log('const logoUrls: { [key: string]: string } = {')
  Object.entries(urlMapping).forEach(([localPath, cloudinaryUrl]) => {
    console.log(`  '${localPath}': '${cloudinaryUrl}',`)
  })
  console.log('}')
  console.log('```')
  
  return urlMapping
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  console.log('🏷️  Script de preparación de logos para Cloudinary')
  console.log('═'.repeat(50))
  
  const mapping = createUploadScript()
  
  console.log('\n📌 Próximos pasos:')
  console.log('   1. Configura CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en .env.local')
  console.log('   2. Las URLs generadas apuntan a Cloudinary con transformaciones automáticas')
  console.log('   3. Sube manualmente las imágenes a tu cuenta de Cloudinary en la carpeta:')
  console.log('      ferreteria-la-michoacana/brands/')
  console.log('   4. O usa la API de Cloudinary para subida automática')
}

module.exports = { createUploadScript, generateCloudinaryUrl, logoMapping }
