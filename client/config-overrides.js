// client/config-overrides.js
// Configuration pour react-app-rewired pour supporter les path aliases

const path = require('path');

module.exports = function override(config) {
  // Ajouter les alias de résolution pour Webpack
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/pages': path.resolve(__dirname, 'src/pages'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/stores': path.resolve(__dirname, 'src/stores'),
      '@/services': path.resolve(__dirname, 'src/services'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/context': path.resolve(__dirname, 'src/context'),
      '@/repositories': path.resolve(__dirname, 'src/repositories'),
      '@/interfaces': path.resolve(__dirname, 'src/interfaces'),
      '@/di': path.resolve(__dirname, 'src/di'),
      '@/constants': path.resolve(__dirname, 'src/constants')
    }
  };

  return config;
};