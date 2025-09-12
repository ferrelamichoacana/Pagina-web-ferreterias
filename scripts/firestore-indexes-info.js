#!/usr/bin/env node

/**
 * Firestore Index Generator - Manual Creation Guide
 * 
 * Este script genera todas las URLs e instrucciones necesarias para crear
 * los índices de Firestore que resuelven el error:
 * "The query requires an index"
 */

console.log(`
🔥 FIRESTORE INDEX CREATION GUIDE
=====================================

📍 Proyecto: website-ferreteria
❌ Error: The query requires an index
✅ Solución: Crear índices compuestos

`);

// Índices necesarios basados en las consultas encontradas
const requiredIndexes = [
  {
    collection: 'news',
    fields: [
      { name: 'active', order: 'ASCENDING' },
      { name: 'order', order: 'ASCENDING' }
    ],
    priority: 'CRÍTICO',
    description: 'Resuelve el error principal de news/noticias'
  },
  {
    collection: 'news',
    fields: [
      { name: 'active', order: 'ASCENDING' },
      { name: 'date', order: 'DESCENDING' }
    ],
    priority: 'ALTO',
    description: 'Para consultas de noticias activas ordenadas por fecha'
  },
  {
    collection: 'news',
    fields: [
      { name: 'featured', order: 'ASCENDING' },
      { name: 'date', order: 'DESCENDING' }
    ],
    priority: 'MEDIO',
    description: 'Para noticias destacadas ordenadas por fecha'
  },
  {
    collection: 'news',
    fields: [
      { name: 'type', order: 'ASCENDING' },
      { name: 'date', order: 'DESCENDING' }
    ],
    priority: 'MEDIO',
    description: 'Para filtrar por tipo de noticia y ordenar por fecha'
  },
  {
    collection: 'branches',
    fields: [
      { name: 'active', order: 'ASCENDING' },
      { name: 'name', order: 'ASCENDING' }
    ],
    priority: 'ALTO',
    description: 'Para sucursales activas ordenadas por nombre'
  },
  {
    collection: 'brands',
    fields: [
      { name: 'active', order: 'ASCENDING' },
      { name: 'name', order: 'ASCENDING' }
    ],
    priority: 'ALTO',  
    description: 'Para marcas activas ordenadas por nombre'
  },
  {
    collection: 'job-applications',
    fields: [
      { name: 'status', order: 'ASCENDING' },
      { name: 'createdAt', order: 'DESCENDING' }
    ],
    priority: 'MEDIO',
    description: 'Para aplicaciones de trabajo por estado y fecha'
  },
  {
    collection: 'quotations',
    fields: [
      { name: 'status', order: 'ASCENDING' },
      { name: 'createdAt', order: 'DESCENDING' }
    ],
    priority: 'MEDIO',
    description: 'Para cotizaciones por estado y fecha'
  }
];

// Función para generar comando gcloud
function generateGcloudCommand(index) {
  const fields = index.fields
    .map(field => `${field.name}:${field.order.toLowerCase()}`)
    .join(',');
  
  return `gcloud firestore indexes composite create --collection-group=${index.collection} --field-config=${fields}`;
}

// Función para generar URL de Firebase Console
function generateFirebaseConsoleUrl(index) {
  const projectId = 'website-ferreteria';
  return `https://console.firebase.google.com/project/${projectId}/firestore/indexes/single`;
}

// Mostrar información de cada índice
console.log('📋 ÍNDICES NECESARIOS:\n');

requiredIndexes.forEach((index, i) => {
  const priorityEmoji = {
    'CRÍTICO': '🚨',
    'ALTO': '⚠️',
    'MEDIO': '📝'
  };

  console.log(`${i + 1}. ${priorityEmoji[index.priority]} ${index.priority} - COLLECTION: ${index.collection.toUpperCase()}`);
  console.log(`   📝 Descripción: ${index.description}`);
  console.log(`   📊 Campos:`);
  
  index.fields.forEach(field => {
    console.log(`      • ${field.name} (${field.order})`);
  });
  
  console.log(`   🔧 Comando gcloud:`);
  console.log(`      ${generateGcloudCommand(index)}`);
  console.log('');
});

console.log(`
🎯 INSTRUCCIONES DE CREACIÓN:

OPCIÓN 1: Firebase Console (Recomendado)
----------------------------------------
1. Ve a: https://console.firebase.google.com/project/website-ferreteria/firestore/indexes
2. Haz clic en "Create Index"
3. Para cada índice de arriba:
   - Collection ID: [collection name]
   - Agrega cada campo con su orden (ASC/DESC)
   - Haz clic en "Create Index"

OPCIÓN 2: Usar URL del Error (Más Rápido)
-----------------------------------------
Cuando veas el error en la consola del navegador:
1. Busca la URL que aparece en el mensaje de error
2. Haz clic en esa URL
3. Confirma la creación del índice

OPCIÓN 3: gcloud CLI (Para Expertos)
-----------------------------------
1. Instala gcloud CLI: https://cloud.google.com/sdk/docs/install
2. Autentícate: gcloud auth login
3. Configura proyecto: gcloud config set project website-ferreteria
4. Ejecuta cada comando gcloud mostrado arriba

📌 ORDEN RECOMENDADO:
====================
1. Crear primero el índice CRÍTICO (news: active + order)
2. Crear los índices de ALTO nivel
3. Crear los de nivel MEDIO según necesidad

⏱ TIEMPO ESPERADO:
==================
• Índices simples: 1-5 minutos
• Índices compuestos: 5-15 minutos
• Verifica estado en Firebase Console

🔗 ENLACES ÚTILES:
==================
• Proyecto Firebase: https://console.firebase.google.com/project/website-ferreteria
• Índices Firestore: https://console.firebase.google.com/project/website-ferreteria/firestore/indexes
• Documentación: https://firebase.google.com/docs/firestore/query-data/indexing

¡Listo! 🎉 Una vez creados los índices, tu aplicación debería funcionar sin errores.
`);

// Agregar información específica sobre el error actual
console.log(`
🆘 SOLUCIÓN RÁPIDA PARA EL ERROR ACTUAL:
========================================

El error específico que estás viendo requiere este índice:

Collection: news
Fields: 
  • active (ASCENDING)
  • order (ASCENDING)

URL Rápida: https://console.firebase.google.com/project/website-ferreteria/firestore/indexes

Comando gcloud:
${generateGcloudCommand(requiredIndexes[0])}

Este es el índice más importante y debería resolver el error inmediatamente.
`);
