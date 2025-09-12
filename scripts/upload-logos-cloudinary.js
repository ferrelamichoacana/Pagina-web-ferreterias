#!/usr/bin/env node

/**
 * Script para subir logos de marcas a Cloudinary
 * Usa la API REST de Cloudinary para subir todas las imágenes
 */

const fs = require('fs')
const path = require('path')
const FormData = require('form-data')
const fetch = require('node-fetch')

// Configuración de Cloudinary
const CLOUDINARY_CLOUD_NAME = 'dino-cloudinary' // Cambia por tu cloud name
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

// Directorio de imágenes
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images')

// Lista de logos de marcas
const brandLogos = [
  'haefele_logo.png',
  'logo_cerrajes.png',
  'logo_dewalt.png',
  'logo_handyhome.png',
  'logo_herma.png',
  'logo_makita.png',
  'logo_resistol.png',
  'logo_sayer.png',
  'logo_silverline.png',
  'logo_soarma.png',
  'logo_truper.png'
]

async function uploadToCloudinary(imagePath, filename) {
  try {
    const formData = new FormData()
    formData.append('file', fs.createReadStream(imagePath))
    formData.append('upload_preset', 'ml_default') // Usa un upload preset público
    formData.append('public_id', `ferreteria-la-michoacana/brands/${filename.replace('.png', '')}`)
    formData.append('folder', 'ferreteria-la-michoacana/brands')
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )
    
    const result = await response.json()
    
    if (result.error) {
      throw new Error(result.error.message)
    }
    
    return result.secure_url
  } catch (error) {
    console.error(`Error subiendo ${filename}:`, error.message)
    return null
  }
}

async function uploadAllLogos() {
  console.log('🏷️  Subiendo logos a Cloudinary...')
  
  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error('❌ Variables de Cloudinary no configuradas')
    console.log('   Configura CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET')
    return
  }
  
  const results = []
  
  for (const logo of brandLogos) {
    const imagePath = path.join(IMAGES_DIR, logo)
    
    if (!fs.existsSync(imagePath)) {
      console.log(`   ⚠️  No encontrado: ${logo}`)
      continue
    }
    
    console.log(`   📤 Subiendo: ${logo}...`)
    const url = await uploadToCloudinary(imagePath, logo)
    
    if (url) {
      console.log(`   ✅ ${logo} → ${url}`)
      results.push({ file: logo, url })
    } else {
      console.log(`   ❌ Error subiendo ${logo}`)
    }
  }
  
  console.log(`\n🎉 Subida completada: ${results.length}/${brandLogos.length} logos`)
  
  // Generar mapeo para el script de migración
  console.log('\n📋 Mapeo para migrate-brands-complete.ts:')
  console.log('const logoUrls: { [key: string]: string } = {')
  results.forEach(({ file, url }) => {
    console.log(`  '/images/${file}': '${url}',`)
  })
  console.log('}')
  
  return results
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  uploadAllLogos()
}

module.exports = { uploadAllLogos }
