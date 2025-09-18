// server/scripts/addDatabaseIndexes.js
// Script pour ajouter les index de performance critiques

require('dotenv').config();
const { sequelize } = require('../src/models');

const addPerformanceIndexes = async () => {
  try {
    console.log('🚀 Début de l\'ajout des index de performance...');

    // Index sur la table users
    console.log('📧 Ajout d\'index sur users.email...');
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    // Index sur la table stars pour les filtres fréquents
    console.log('⭐ Ajout d\'index sur stars.constellation...');
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_stars_constellation ON stars(constellation);
    `);

    console.log('💰 Ajout d\'index sur stars.price...');
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_stars_price ON stars(price);
    `);

    console.log('🌟 Ajout d\'index sur stars.magnitude...');
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_stars_magnitude ON stars(magnitude);
    `);

    // Index composite pour les filtres combinés (constellation + prix)
    console.log('🔍 Ajout d\'index composite constellation+price...');
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_stars_constellation_price ON stars(constellation, price);
    `);

    // Index sur RefreshTokens pour les requêtes de validation
    console.log('🔐 Ajout d\'index sur RefreshTokens...');
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_active
      ON "RefreshTokens"("user_id", "is_revoked", "expires_at");
    `);

    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token
      ON "RefreshTokens"("token") WHERE "is_revoked" = false;
    `);

    // Index sur les tables de relations pour éviter les N+1
    console.log('🛒 Ajout d\'index sur CartItems (skip si inexistant)...');
    try {
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cartitems("cart_id");
      `);
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_cart_items_star_id ON cartitems("star_id");
      `);
    } catch (error) {
      console.log('⚠️  Table cartitems n\'existe pas encore');
    }

    console.log('💝 Ajout d\'index sur Wishlist...');
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlists("user_id");
    `);

    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_wishlist_star_id ON wishlists("star_id");
    `);

    console.log('📦 Ajout d\'index sur Orders...');
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders("user_id");
    `);

    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders("status");
    `);

    console.log('⭐ Ajout d\'index sur Reviews...');
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_reviews_star_id ON reviews("star_id");
    `);

    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews("user_id");
    `);

    // Index pour les timestamps (createdAt) pour les tris par date
    console.log('📅 Ajout d\'index sur les timestamps...');
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_stars_created_at ON stars("created_at" DESC);
    `);

    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders("created_at" DESC);
    `);

    console.log('✅ Tous les index ont été ajoutés avec succès !');

    // Afficher les index créés pour vérification
    console.log('\n📊 Vérification des index créés :');
    const indexes = await sequelize.query(`
      SELECT
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE indexname LIKE 'idx_%'
      ORDER BY tablename, indexname;
    `, { type: sequelize.QueryTypes.SELECT });

    indexes.forEach(index => {
      console.log(`✓ ${index.tablename}.${index.indexname}`);
    });

    console.log(`\n🎉 ${indexes.length} index de performance ajoutés !`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des index :', error);
    throw error;
  }
};

const main = async () => {
  try {
    await addPerformanceIndexes();
    console.log('\n🏁 Script terminé avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('💥 Échec du script :', error);
    process.exit(1);
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  main();
}

module.exports = { addPerformanceIndexes };