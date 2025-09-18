// server/scripts/createAdmin.js
// Script pour créer un utilisateur administrateur

require('dotenv').config();
const bcrypt = require('bcrypt');
const { User } = require('../src/models');

const createAdminUser = async () => {
  try {
    console.log('🔧 Création d\'un utilisateur administrateur...');

    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ where: { role: 'admin' } });

    if (existingAdmin) {
      console.log('✅ Un administrateur existe déjà:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Nom: ${existingAdmin.firstName} ${existingAdmin.lastName}`);
      return;
    }

    // Données de l'admin par défaut
    const adminData = {
      firstName: 'Admin',
      lastName: 'Stella',
      email: 'admin@stella.com',
      password: process.env.ADMIN_DEFAULT_PASSWORD || 'Admin123!@#', // Mot de passe depuis l'env ou défaut
      role: 'admin'
    };

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Créer l'utilisateur admin
    const admin = await User.create({
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role
    });

    console.log('🎉 Administrateur créé avec succès !');
    console.log('📧 Identifiants de connexion:');
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Mot de passe: ${adminData.password}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Changez ce mot de passe après la première connexion !');
    console.log('');
    console.log('🔗 URLs utiles:');
    console.log('   Panel Admin: http://localhost:3000/api/admin/dashboard');
    console.log('   API Docs: http://localhost:3000/api-docs');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error.message);

    if (error.name === 'SequelizeUniqueConstraintError') {
      console.log('💡 Un utilisateur avec cet email existe déjà.');
      console.log('   Pour créer un admin, modifiez le rôle d\'un utilisateur existant.');
    }
  }
};

const main = async () => {
  try {
    await createAdminUser();
    process.exit(0);
  } catch (error) {
    console.error('💥 Échec du script:', error);
    process.exit(1);
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  main();
}

module.exports = { createAdminUser };