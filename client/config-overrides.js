// client/config-overrides.js
// Configuration pour react-app-rewired pour supporter les path aliases

const path = require('path');

module.exports = function override(config) {
  // Ajouter les alias de résolution pour Webpack
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src')
    }
  };

  return config;
};