#!/bin/bash

echo "🔥 CREAR ÍNDICES FIRESTORE - FORMATO CORREGIDO"
echo "=============================================="
echo ""

# Índices críticos - BRANDS
echo "🎯 1/16: brands (active + name) - CRÍTICO"
gcloud firestore indexes composite create \
  --collection-group=brands \
  --field-config=field-path=active,order=ASCENDING \
  --field-config=field-path=name,order=ASCENDING \
  --quiet

echo "🎯 2/16: brands (category + name) - ALTO"
gcloud firestore indexes composite create \
  --collection-group=brands \
  --field-config=field-path=category,order=ASCENDING \
  --field-config=field-path=name,order=ASCENDING \
  --quiet

echo "🎯 3/16: brands (featured + name) - ALTO"
gcloud firestore indexes composite create \
  --collection-group=brands \
  --field-config=field-path=featured,order=ASCENDING \
  --field-config=field-path=name,order=ASCENDING \
  --quiet

# Índices críticos - CONTACT REQUESTS
echo "🎯 4/16: contactRequests (branchId + createdAt) - CRÍTICO"
gcloud firestore indexes composite create \
  --collection-group=contactRequests \
  --field-config=field-path=branchId,order=ASCENDING \
  --field-config=field-path=createdAt,order=DESCENDING \
  --quiet

echo "🎯 5/16: contactRequests (branchId + status + createdAt) - CRÍTICO"
gcloud firestore indexes composite create \
  --collection-group=contactRequests \
  --field-config=field-path=branchId,order=ASCENDING \
  --field-config=field-path=status,order=ASCENDING \
  --field-config=field-path=createdAt,order=DESCENDING \
  --quiet

echo "🎯 6/16: contactRequests (assignedTo + status + assignedAt) - CRÍTICO"
gcloud firestore indexes composite create \
  --collection-group=contactRequests \
  --field-config=field-path=assignedTo,order=ASCENDING \
  --field-config=field-path=status,order=ASCENDING \
  --field-config=field-path=assignedAt,order=DESCENDING \
  --quiet

# Índices de alta prioridad
echo "🎯 7/16: branches (active + name) - ALTO"
gcloud firestore indexes composite create \
  --collection-group=branches \
  --field-config=field-path=active,order=ASCENDING \
  --field-config=field-path=name,order=ASCENDING \
  --quiet

echo "🎯 8/16: contactRequests (createdAt) - ALTO"
gcloud firestore indexes composite create \
  --collection-group=contactRequests \
  --field-config=field-path=createdAt,order=DESCENDING \
  --quiet

echo "🎯 9/16: jobPostings (status + createdAt) - ALTO"
gcloud firestore indexes composite create \
  --collection-group=jobPostings \
  --field-config=field-path=status,order=ASCENDING \
  --field-config=field-path=createdAt,order=DESCENDING \
  --quiet

# Índices de prioridad media
echo "🎯 10/16: branches (createdAt) - MEDIO"
gcloud firestore indexes composite create \
  --collection-group=branches \
  --field-config=field-path=createdAt,order=ASCENDING \
  --quiet

echo "🎯 11/16: jobPostings (createdAt) - MEDIO"
gcloud firestore indexes composite create \
  --collection-group=jobPostings \
  --field-config=field-path=createdAt,order=DESCENDING \
  --quiet

echo "🎯 12/16: jobApplications (jobId) - MEDIO"
gcloud firestore indexes composite create \
  --collection-group=jobApplications \
  --field-config=field-path=jobId,order=ASCENDING \
  --quiet

echo "🎯 13/16: testimonials (active + order) - MEDIO"
gcloud firestore indexes composite create \
  --collection-group=testimonials \
  --field-config=field-path=active,order=ASCENDING \
  --field-config=field-path=order,order=ASCENDING \
  --quiet

echo "🎯 14/16: news (active + order) - MEDIO"
gcloud firestore indexes composite create \
  --collection-group=news \
  --field-config=field-path=active,order=ASCENDING \
  --field-config=field-path=order,order=ASCENDING \
  --quiet

echo "🎯 15/16: users (createdAt) - MEDIO"
gcloud firestore indexes composite create \
  --collection-group=users \
  --field-config=field-path=createdAt,order=ASCENDING \
  --quiet

# Índices de baja prioridad
echo "🎯 16/16: newsletterSubscriptions (email) - BAJO"
gcloud firestore indexes composite create \
  --collection-group=newsletterSubscriptions \
  --field-config=field-path=email,order=ASCENDING \
  --quiet

echo ""
echo "✅ ¡Todos los índices enviados para creación!"
echo "⏳ Los índices están siendo construidos en segundo plano"
echo "🌐 Verifica el progreso en: https://console.firebase.google.com/project/website-ferreteria/firestore/indexes"
echo ""
echo "📊 RESUMEN:"
echo "   • 4 índices CRÍTICOS (brands, contactRequests)"
echo "   • 5 índices ALTA prioridad"
echo "   • 6 índices MEDIA prioridad"  
echo "   • 1 índice BAJA prioridad"
echo ""
echo "🎉 ¡Firebase está optimizado para producción!"
