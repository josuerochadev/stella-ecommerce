// client/config-overrides.js
// Configuration pour react-app-rewired pour supporter les path aliases

const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = function override(config) {
  // Ajouter les alias de résolution pour Webpack
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src')
    }
  };

  // Bundle analyzer (ANALYZE=true npm run build)
  if (process.env.ANALYZE === 'true') {
    config.plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: true,
    }));
  }

  return config;
};