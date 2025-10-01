// client/fix-local-imports.js
// Script pour corriger les imports locaux incorrectement convertis en alias

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

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

function fixLocalImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);

  // Pattern pour détecter les imports avec alias pointant vers le même dossier
  const lines = content.split('\n');
  const newLines = [];

  lines.forEach(line => {
    if (line.match(/^import .* from ["']@\/components\//)) {
      // Si le fichier est dans components/ et importe depuis @/components/
      if (fileDir.includes('/components')) {
        const match = line.match(/from ["']@\/components\/([^"']+)["']/);
        if (match) {
          const importedFile = match[1];
          // Vérifier si le fichier importé existe dans le même dossier
          const localPath = path.join(fileDir, importedFile);
          const possibleExtensions = ['', '.ts', '.tsx', '.js', '.jsx'];

          let exists = false;
          for (const ext of possibleExtensions) {
            if (fs.existsSync(localPath + ext)) {
              exists = true;
              break;
            }
          }

          if (exists) {
            // Remplacer par import local
            const newLine = line.replace(/@\/components\/([^"']+)/, './$1');
            newLines.push(newLine);
            modified = true;
            return;
          }
        }
      }
    } else if (line.match(/^import .* from ["']@\/pages\//)) {
      // Si le fichier est dans pages/ et importe depuis @/pages/
      if (fileDir.includes('/pages')) {
        const match = line.match(/from ["']@\/pages\/([^"']+)["']/);
        if (match) {
          const importedFile = match[1];
          const localPath = path.join(fileDir, importedFile);
          const possibleExtensions = ['', '.ts', '.tsx', '.js', '.jsx'];

          let exists = false;
          for (const ext of possibleExtensions) {
            if (fs.existsSync(localPath + ext)) {
              exists = true;
              break;
            }
          }

          if (exists) {
            const newLine = line.replace(/@\/pages\/([^"']+)/, './$1');
            newLines.push(newLine);
            modified = true;
            return;
          }
        }
      }
    } else if (line.match(/^import .* from ["']@\/hooks\//)) {
      if (fileDir.includes('/hooks')) {
        const match = line.match(/from ["']@\/hooks\/([^"']+)["']/);
        if (match) {
          const importedFile = match[1];
          const localPath = path.join(fileDir, importedFile);
          const possibleExtensions = ['', '.ts', '.tsx', '.js', '.jsx'];

          let exists = false;
          for (const ext of possibleExtensions) {
            if (fs.existsSync(localPath + ext)) {
              exists = true;
              break;
            }
          }

          if (exists) {
            const newLine = line.replace(/@\/hooks\/([^"']+)/, './$1');
            newLines.push(newLine);
            modified = true;
            return;
          }
        }
      }
    } else if (line.match(/^import .* from ["']@\/utils\//)) {
      if (fileDir.includes('/utils')) {
        const match = line.match(/from ["']@\/utils\/([^"']+)["']/);
        if (match) {
          const importedFile = match[1];
          const localPath = path.join(fileDir, importedFile);
          const possibleExtensions = ['', '.ts', '.tsx', '.js', '.jsx'];

          let exists = false;
          for (const ext of possibleExtensions) {
            if (fs.existsSync(localPath + ext)) {
              exists = true;
              break;
            }
          }

          if (exists) {
            const newLine = line.replace(/@\/utils\/([^"']+)/, './$1');
            newLines.push(newLine);
            modified = true;
            return;
          }
        }
      }
    }

    newLines.push(line);
  });

  if (modified) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    console.log(`✓ Fixed: ${path.relative(srcDir, filePath)}`);
    return 1;
  }

  return 0;
}

// Exécution
console.log('🔄 Fixing local imports...\n');

const allFiles = getAllFiles(srcDir);
let fixedCount = 0;

allFiles.forEach(file => {
  fixedCount += fixLocalImports(file);
});

console.log(`\n✅ Fix complete! ${fixedCount} files modified.`);