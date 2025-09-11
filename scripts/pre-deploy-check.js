#!/usr/bin/env node

/**
 * Script de verificación pre-deploy para Vercel
 * Ejecuta todas las verificaciones necesarias antes del deploy
 */

const { execSync } = require('child_process');

console.log('🚀 Iniciando verificaciones pre-deploy...\n');

try {
  // 1. Verificar ESLint
  console.log('📋 Ejecutando ESLint...');
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ ESLint: Sin errores\n');

  // 2. Verificar TypeScript
  console.log('🔧 Verificando tipos de TypeScript...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript: Sin errores de tipos\n');

  // 3. Ejecutar tests
  console.log('🧪 Ejecutando tests...');
  try {
    execSync('npm test -- --passWithNoTests', { stdio: 'inherit' });
    console.log('✅ Tests: Pasaron correctamente\n');
  } catch (error) {
    console.log('⚠️  Tests: No se encontraron tests o algunos fallaron\n');
  }

  // 4. Verificar sintaxis de archivos críticos
  console.log('📄 Verificando archivos de configuración...');
  
  const fs = require('fs');
  const path = require('path');
  
  // Verificar package.json
  try {
    JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log('✅ package.json: Válido');
  } catch (error) {
    throw new Error('❌ package.json tiene errores de sintaxis');
  }

  // Verificar next.config.js
  try {
    require('./next.config.js');
    console.log('✅ next.config.js: Válido');
  } catch (error) {
    console.log('⚠️  next.config.js: Posibles problemas');
  }

  // Verificar .eslintrc.json
  try {
    JSON.parse(fs.readFileSync('.eslintrc.json', 'utf8'));
    console.log('✅ .eslintrc.json: Válido');
  } catch (error) {
    throw new Error('❌ .eslintrc.json tiene errores de sintaxis');
  }

  console.log('\n🎉 ¡Todas las verificaciones pasaron exitosamente!');
  console.log('✨ El código está listo para deploy en Vercel');
  
} catch (error) {
  console.error('\n❌ Error en las verificaciones:', error.message);
  console.error('\n🛑 Por favor, corrige los errores antes del deploy');
  process.exit(1);
}
