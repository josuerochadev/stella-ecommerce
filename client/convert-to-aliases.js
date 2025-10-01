// client/convert-to-aliases.js
// Script pour convertir les imports relatifs en imports avec alias @/

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Mapping des dossiers vers les alias
const aliasMapping = {
  'components': '@/components',
  'pages': '@/pages',
  'hooks': '@/hooks',
  'stores': '@/stores',
  'services': '@/services',
  'utils': '@/utils',
  'types': '@/types',
  'context': '@/context',
  'repositories': '@/repositories',
  'interfaces': '@/interfaces',
  'di': '@/di',
  'constants': '@/constants'
};

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.match(/\.(ts|tsx)$/)) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function convertImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Regex pour capturer les imports relatifs
  const importRegex = /from\s+["'](\.\.\/?[^"']+)["']/g;

  content = content.replace(importRegex, (match, importPath) => {
    // Résoudre le chemin absolu depuis le fichier actuel
    const currentDir = path.dirname(filePath);
    const absolutePath = path.resolve(currentDir, importPath);
    const relativePath = path.relative(srcDir, absolutePath);

    // Déterminer quel alias utiliser
    const segments = relativePath.split(path.sep);
    const topFolder = segments[0];

    if (aliasMapping[topFolder]) {
      const restPath = segments.slice(1).join('/');
      const newImport = restPath
        ? `${aliasMapping[topFolder]}/${restPath}`
        : aliasMapping[topFolder];

      modified = true;
      return `from "${newImport}"`;
    }

    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Converted: ${path.relative(srcDir, filePath)}`);
    return 1;
  }

  return 0;
}

// Exécution
console.log('🔄 Converting relative imports to path aliases...\n');

const allFiles = getAllFiles(srcDir);
let convertedCount = 0;

allFiles.forEach(file => {
  convertedCount += convertImportsInFile(file);
});

console.log(`\n✅ Conversion complete! ${convertedCount} files modified.`);