const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Limpiando proyecto...');

// Eliminar directorios de cache
const dirsToDelete = ['.next', 'node_modules/.cache'];

dirsToDelete.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`Eliminando ${dir}...`);
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`✅ ${dir} eliminado`);
    } catch (error) {
      console.log(`⚠️  Error eliminando ${dir}:`, error.message);
    }
  }
});

console.log('🚀 Iniciando servidor de desarrollo...');

try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Error iniciando el servidor:', error.message);
}