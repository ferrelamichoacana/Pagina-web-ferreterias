const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

/**
 * Script para optimizar imágenes estáticas
 * Convierte imágenes a WebP y genera diferentes tamaños
 */

const INPUT_DIR = path.join(__dirname, '../public/images')
const OUTPUT_DIR = path.join(__dirname, '../public/images/optimized')

// Tamaños para generar
const SIZES = [
  { width: 320, suffix: '-mobile' },
  { width: 768, suffix: '-tablet' },
  { width: 1024, suffix: '-desktop' },
  { width: 1920, suffix: '-large' }
]

// Calidades por formato
const QUALITY = {
  webp: 80,
  jpeg: 85,
  png: 90
}

async function optimizeImage(inputPath, outputDir, filename) {
  const name = path.parse(filename).name
  const ext = path.parse(filename).ext.toLowerCase()
  
  // Solo procesar imágenes
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    return
  }

  console.log(`Optimizando: ${filename}`)

  try {
    const image = sharp(inputPath)
    const metadata = await image.metadata()

    // Generar diferentes tamaños
    for (const size of SIZES) {
      // Solo redimensionar si la imagen es más grande
      if (metadata.width && metadata.width > size.width) {
        // WebP
        await image
          .resize(size.width, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ quality: QUALITY.webp })
          .toFile(path.join(outputDir, `${name}${size.suffix}.webp`))

        // JPEG (fallback)
        await image
          .resize(size.width, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: QUALITY.jpeg, progressive: true })
          .toFile(path.join(outputDir, `${name}${size.suffix}.jpg`))
      }
    }

    // Versión original optimizada
    if (ext === '.png') {
      await image
        .png({ quality: QUALITY.png, progressive: true })
        .toFile(path.join(outputDir, `${name}-original.png`))
    } else {
      await image
        .jpeg({ quality: QUALITY.jpeg, progressive: true })
        .toFile(path.join(outputDir, `${name}-original.jpg`))
    }

    // Versión WebP original
    await image
      .webp({ quality: QUALITY.webp })
      .toFile(path.join(outputDir, `${name}-original.webp`))

    console.log(`✅ Optimizado: ${filename}`)
  } catch (error) {
    console.error(`❌ Error optimizando ${filename}:`, error.message)
  }
}

async function processDirectory(dir, outputDir) {
  // Crear directorio de salida si no existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // Procesar subdirectorio
      const subOutputDir = path.join(outputDir, file)
      await processDirectory(filePath, subOutputDir)
    } else {
      // Procesar archivo
      await optimizeImage(filePath, outputDir, file)
    }
  }
}

async function generateResponsiveImageComponent() {
  const componentCode = `
import Image from 'next/image'

interface ResponsiveImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  sizes?: string
}

export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: ResponsiveImageProps) {
  const baseName = src.replace(/\\.[^/.]+$/, '')
  
  return (
    <picture className={className}>
      {/* WebP sources */}
      <source
        media="(max-width: 320px)"
        srcSet={\`/images/optimized\${baseName}-mobile.webp\`}
        type="image/webp"
      />
      <source
        media="(max-width: 768px)"
        srcSet={\`/images/optimized\${baseName}-tablet.webp\`}
        type="image/webp"
      />
      <source
        media="(max-width: 1024px)"
        srcSet={\`/images/optimized\${baseName}-desktop.webp\`}
        type="image/webp"
      />
      <source
        srcSet={\`/images/optimized\${baseName}-large.webp\`}
        type="image/webp"
      />
      
      {/* JPEG fallbacks */}
      <source
        media="(max-width: 320px)"
        srcSet={\`/images/optimized\${baseName}-mobile.jpg\`}
        type="image/jpeg"
      />
      <source
        media="(max-width: 768px)"
        srcSet={\`/images/optimized\${baseName}-tablet.jpg\`}
        type="image/jpeg"
      />
      <source
        media="(max-width: 1024px)"
        srcSet={\`/images/optimized\${baseName}-desktop.jpg\`}
        type="image/jpeg"
      />
      
      {/* Fallback image */}
      <Image
        src={\`/images/optimized\${baseName}-original.jpg\`}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
    </picture>
  )
}
`

  const componentPath = path.join(__dirname, '../components/ui/ResponsiveImage.tsx')
  fs.writeFileSync(componentPath, componentCode.trim())
  console.log('✅ Componente ResponsiveImage generado')
}

async function main() {
  console.log('🖼️  Iniciando optimización de imágenes...')
  
  if (!fs.existsSync(INPUT_DIR)) {
    console.error('❌ Directorio de imágenes no encontrado:', INPUT_DIR)
    process.exit(1)
  }

  try {
    await processDirectory(INPUT_DIR, OUTPUT_DIR)
    await generateResponsiveImageComponent()
    
    console.log('✅ Optimización completada')
    console.log(\`📁 Imágenes optimizadas guardadas en: \${OUTPUT_DIR}\`)
  } catch (error) {
    console.error('❌ Error durante la optimización:', error)
    process.exit(1)
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main()
}

module.exports = { optimizeImage, processDirectory }
`