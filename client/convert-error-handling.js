// client/convert-error-handling.js
// Script pour remplacer les patterns de gestion d'erreur par l'utilitaire centralisé

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Fichiers à convertir (repositories et stores)
const targetDirs = [
  path.join(srcDir, 'repositories'),
  path.join(srcDir, 'stores')
];

function getAllFiles(dirPaths) {
  const files = [];

  dirPaths.forEach(dirPath => {
    if (!fs.existsSync(dirPath)) return;

    const dirFiles = fs.readdirSync(dirPath);
    dirFiles.forEach(file => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isFile() && file.match(/\.(ts|tsx)$/)) {
        files.push(fullPath);
      }
    });
  });

  return files;
}

function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pattern 1: throw new Error(`...Failed...: ${error instanceof Error ? error.message : 'Unknown error'}`)
  const throwPattern = /throw new Error\(`([^`]*): \${error instanceof Error \? error\.message : '[^']*'}\`\);/g;
  const throwMatches = content.match(throwPattern);

  if (throwMatches) {
    // Ajouter l'import si nécessaire
    if (!content.includes('createFormattedError')) {
      // Trouver la dernière ligne d'import
      const importLines = content.split('\n').filter(line => line.startsWith('import'));
      if (importLines.length > 0) {
        const lastImport = importLines[importLines.length - 1];
        const lastImportIndex = content.indexOf(lastImport) + lastImport.length;
        content = content.slice(0, lastImportIndex) +
                 '\nimport { createFormattedError } from "@/utils/errorHelpers";' +
                 content.slice(lastImportIndex);
        modified = true;
      }
    }

    // Remplacer les patterns
    content = content.replace(
      throwPattern,
      (match, message) => `throw createFormattedError(error, '${message}');`
    );
    modified = true;
  }

  // Pattern 2: const errorMessage = error instanceof Error ? error.message : "..."
  const constPattern = /const errorMessage = error instanceof Error \? error\.message : "([^"]*)";/g;
  const constMatches = content.match(constPattern);

  if (constMatches) {
    // Ajouter l'import si nécessaire
    if (!content.includes('getErrorMessage')) {
      const importLines = content.split('\n').filter(line => line.startsWith('import'));
      if (importLines.length > 0) {
        const lastImport = importLines[importLines.length - 1];
        const lastImportIndex = content.indexOf(lastImport) + lastImport.length;
        content = content.slice(0, lastImportIndex) +
                 '\nimport { getErrorMessage } from "@/utils/errorHelpers";' +
                 content.slice(lastImportIndex);
        modified = true;
      }
    }

    // Remplacer les patterns
    content = content.replace(
      constPattern,
      (match, message) => `const errorMessage = getErrorMessage(error, "${message}");`
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Converted: ${path.relative(srcDir, filePath)}`);
    return 1;
  }

  return 0;
}

// Exécution
console.log('🔄 Converting error handling patterns...\n');

const allFiles = getAllFiles(targetDirs);
let convertedCount = 0;

allFiles.forEach(file => {
  convertedCount += convertFile(file);
});

console.log(`\n✅ Conversion complete! ${convertedCount} files modified.`);