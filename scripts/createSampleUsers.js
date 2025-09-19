// scripts/createSampleUsers.js
// Script pour créer les utilisateurs sample avec mots de passe hashés

const { User } = require("../server/src/models");

const users = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "password123",
    role: "client",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    password: "password456",
    role: "client",
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    password: "password789",
    role: "client",
  },
  {
    firstName: "Bob",
    lastName: "Brown",
    email: "bob@example.com",
    password: "password101",
    role: "client",
  },
  {
    firstName: "Charlie",
    lastName: "Wilson",
    email: "charlie@example.com",
    password: "password112",
    role: "client",
  },
];

async function createSampleUsers() {
  try {
    console.log('🔧 Création des utilisateurs sample avec mots de passe hashés...');

    // Créer chaque utilisateur individuellement pour déclencher le hashing
    for (const userData of users) {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ where: { email: userData.email } });

      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ Utilisateur créé: ${userData.email}`);
      } else {
        console.log(`⏭️  Utilisateur existe déjà: ${userData.email}`);
      }
    }

    console.log('🎉 Tous les utilisateurs sample ont été créés avec succès !');
    console.log('');
    console.log('📧 Identifiants de test disponibles:');
    users.forEach(user => {
      console.log(`   ${user.email} / ${user.password}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs:', error.message);
  }
}

const main = async () => {
  try {
    await createSampleUsers();
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

module.exports = { createSampleUsers };