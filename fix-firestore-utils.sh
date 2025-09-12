#!/bin/bash

# Script para arreglar todas las referencias a 'db' en firestore.ts

FILE="lib/utils/firestore.ts"

# Crear un backup
cp "$FILE" "$FILE.backup"

# Arreglar cada función que usa db añadiendo const db = getFirestore() al inicio
sed -i '' '
/^export async function/ {
  a\
  const db = getFirestore()
}
/^export function/ {
  a\
  const db = getFirestore()
}
' "$FILE"

echo "Fixed firestore.ts"
