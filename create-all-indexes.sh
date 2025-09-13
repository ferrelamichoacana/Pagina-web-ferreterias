#!/bin/bash
# Script automático para crear todos los índices Firestore
echo "🚀 Creando índices Firestore..."

echo "Creando índice 1/16: branches..."
gcloud firestore indexes composite create --collection-group=branches --field-config=active:ascending,name:ascending --quiet
echo "Creando índice 2/16: branches..."
gcloud firestore indexes composite create --collection-group=branches --field-config=createdAt:ascending --quiet
echo "Creando índice 3/16: brands..."
gcloud firestore indexes composite create --collection-group=brands --field-config=active:ascending,name:ascending --quiet
echo "Creando índice 4/16: brands..."
gcloud firestore indexes composite create --collection-group=brands --field-config=category:ascending,name:ascending --quiet
echo "Creando índice 5/16: brands..."
gcloud firestore indexes composite create --collection-group=brands --field-config=featured:ascending,name:ascending --quiet
echo "Creando índice 6/16: contactRequests..."
gcloud firestore indexes composite create --collection-group=contactRequests --field-config=branchId:ascending,createdAt:descending --quiet
echo "Creando índice 7/16: contactRequests..."
gcloud firestore indexes composite create --collection-group=contactRequests --field-config=branchId:ascending,status:ascending,createdAt:descending --quiet
echo "Creando índice 8/16: contactRequests..."
gcloud firestore indexes composite create --collection-group=contactRequests --field-config=assignedTo:ascending,status:ascending,assignedAt:descending --quiet
echo "Creando índice 9/16: contactRequests..."
gcloud firestore indexes composite create --collection-group=contactRequests --field-config=createdAt:descending --quiet
echo "Creando índice 10/16: jobPostings..."
gcloud firestore indexes composite create --collection-group=jobPostings --field-config=status:ascending,createdAt:descending --quiet
echo "Creando índice 11/16: jobPostings..."
gcloud firestore indexes composite create --collection-group=jobPostings --field-config=createdAt:descending --quiet
echo "Creando índice 12/16: jobApplications..."
gcloud firestore indexes composite create --collection-group=jobApplications --field-config=jobId:ascending --quiet
echo "Creando índice 13/16: testimonials..."
gcloud firestore indexes composite create --collection-group=testimonials --field-config=active:ascending,order:ascending --quiet
echo "Creando índice 14/16: news..."
gcloud firestore indexes composite create --collection-group=news --field-config=active:ascending,order:ascending --quiet
echo "Creando índice 15/16: users..."
gcloud firestore indexes composite create --collection-group=users --field-config=createdAt:ascending --quiet
echo "Creando índice 16/16: newsletterSubscriptions..."
gcloud firestore indexes composite create --collection-group=newsletterSubscriptions --field-config=email:ascending --quiet

echo "✅ Todos los índices creados exitosamente!"
