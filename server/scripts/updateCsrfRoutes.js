// scripts/updateCsrfRoutes.js
// Script pour migrer automatiquement les routes CSRF vers le nouveau système

const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '../src/routes');
const routeFiles = [
  'usersRoutes.js',
  'cartRoutes.js',
  'ordersRoutes.js',
  'wishlistRoutes.js',
  'reviewRoutes.js'
];

for (const routeFile of routeFiles) {
  const filePath = path.join(routesDir, routeFile);

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remplacer l'import csurf obsolète
    content = content.replace(
      /const csrfProtection = require\("csurf"\)\(\{[^}]*\}\);?/g,
      'const { csrfValidate } = require("../middlewares/modernCsrf");'
    );

    content = content.replace(
      /\/\/ csrfProtection = require\("csurf"\).*$/gm,
      'const { csrfValidate } = require("../middlewares/modernCsrf");'
    );

    // Remplacer csrfProtection par csrfValidate dans les routes
    content = content.replace(/csrfProtection/g, 'csrfValidate');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Mis à jour: ${routeFile}`);
  } catch (error) {
    console.log(`⚠️  Fichier non trouvé ou erreur: ${routeFile}`);
  }
}

console.log('🎉 Migration CSRF terminée !');