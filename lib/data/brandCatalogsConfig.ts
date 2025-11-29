/**
 * Script para actualizar las marcas con sus catálogos
 * 
 * Este script muestra ejemplos de cómo configurar los catálogos
 * para cada marca en Firebase Firestore.
 * 
 * NOTA: Ejecutar manualmente en Firebase Console o adaptar según necesidad
 */

import { db } from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'

// Mapping de catálogos según archivos existentes
export const brandCatalogMapping = {
  // Cerrajes - Tiene múltiples catálogos
  cerrajes: [
    "catalogo cerrajes general.pdf",
    "catalogo cerrajes iluminacion.pdf",
    "catalogo cerrajes industrial.pdf",
    "catalogo cerrajes jaladeras y botones.pdf",
    "catalogo cerrajes lo mas nuevo.pdf"
  ],
  
  // HandyHome - Un catálogo
  handyhome: [
    "catalogo handyhome.pdf"
  ],
  
  // Sayer - Un catálogo
  sayer: [
    "catalogo sayer.pdf"
  ],
  
  // Silverline - Un catálogo
  silverline: [
    "catalogo silverline.pdf"
  ],
  
  // Truper - Un catálogo
  truper: [
    "catalogo truper.pdf"
  ]
}

/**
 * Ejemplo de documento de marca con catálogos en Firestore:
 * 
 * Colección: brands
 * Documento ID: truper
 * 
 * {
 *   "id": "truper",
 *   "name": "Truper",
 *   "logoUrl": "https://...",
 *   "category": "Herramientas",
 *   "description": "Herramientas profesionales de calidad",
 *   "website": "https://www.truper.com",
 *   "active": true,
 *   "catalogos": ["catalogo truper.pdf"]
 * }
 * 
 * Para agregar múltiples catálogos (como Cerrajes):
 * 
 * {
 *   "id": "cerrajes",
 *   "name": "Cerrajes",
 *   "logoUrl": "https://...",
 *   "category": "Cerrajería",
 *   "description": "Soluciones en cerrajería y herrajes",
 *   "active": true,
 *   "catalogos": [
 *     "catalogo cerrajes general.pdf",
 *     "catalogo cerrajes iluminacion.pdf",
 *     "catalogo cerrajes industrial.pdf",
 *     "catalogo cerrajes jaladeras y botones.pdf",
 *     "catalogo cerrajes lo mas nuevo.pdf"
 *   ]
 * }
 */

/**
 * Función helper para actualizar marcas (usar en Admin Panel)
 */
export async function updateBrandWithCatalogs(
  brandId: string,
  catalogos: string[]
) {
  // Esta función se puede usar desde el Admin Panel
  // Para actualizar las marcas con sus catálogos
  
  if (!db) {
    throw new Error('Firebase Firestore no está inicializado')
  }
  
  const brandRef = doc(db, 'brands', brandId)
  
  try {
    await updateDoc(brandRef, {
      catalogos: catalogos,
      updatedAt: new Date()
    })
    console.log(`Marca ${brandId} actualizada con catálogos`)
    return true
  } catch (error) {
    console.error(`Error actualizando marca ${brandId}:`, error)
    return false
  }
}

/**
 * Instrucciones para actualizar en Firebase Console:
 * 
 * 1. Ir a Firebase Console
 * 2. Seleccionar Firestore Database
 * 3. Buscar colección "brands"
 * 4. Seleccionar documento de la marca
 * 5. Click en "Add field" o editar existente
 * 6. Field name: "catalogos"
 * 7. Field type: "array"
 * 8. Array values: agregar nombres de archivos PDF
 *    Ejemplo: "catalogo truper.pdf"
 * 9. Save
 * 
 * Los nombres deben coincidir EXACTAMENTE con los archivos en public/catalogos/
 */
