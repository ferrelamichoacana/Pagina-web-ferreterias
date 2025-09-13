#!/usr/bin/env node

/**
 * Script para probar la eliminación de marcas y diagnosticar el problema
 */

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' })

async function testBrandsAPI() {
  console.log('🧪 Testing Firebase connection and brand deletion...')
  
  // 1. Primero probar obtener todas las marcas
  try {
    console.log('\n1. Obteniendo todas las marcas...')
    const getResponse = await fetch('http://localhost:3000/api/brands')
    
    if (!getResponse.ok) {
      console.error('❌ Error al obtener marcas:', getResponse.status, getResponse.statusText)
      return
    }
    
    const getBrands = await getResponse.json()
    console.log('✅ Marcas obtenidas:', {
      success: getBrands.success,
      count: getBrands.count || 0,
      firstBrand: getBrands.data?.[0] || 'No brands found'
    })
    
    // Buscar la "Test Brand" específicamente
    const testBrand = getBrands.data?.find(b => b.name?.includes('Test Brand') || b.name?.includes('test'))
    
    if (testBrand) {
      console.log('\n2. Test Brand encontrada:', {
        id: testBrand.id,
        name: testBrand.name,
        logoUrl: testBrand.logoUrl || testBrand.logo
      })
      
      // 3. Intentar eliminar la Test Brand
      console.log('\n3. Intentando eliminar Test Brand...')
      const deleteResponse = await fetch(`http://localhost:3000/api/brands?id=${testBrand.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Status de eliminación:', deleteResponse.status)
      
      const deleteResult = await deleteResponse.json()
      console.log('Resultado de eliminación:', deleteResult)
      
    } else {
      console.log('\n2. ⚠️  No se encontró "Test Brand" en la lista')
      console.log('Marcas disponibles:', getBrands.data?.map(b => ({ id: b.id, name: b.name })) || [])
    }
    
  } catch (error) {
    console.error('💥 Error en test:', error.message)
  }
}

// Esperar un poco para que el servidor esté listo
setTimeout(testBrandsAPI, 2000)
