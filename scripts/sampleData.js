// scripts/sampleData.js
const { Star, User, Order, OrderStar } = require('../src/models');

const stars = [
  { name: "Sirius", description: "L'étoile la plus brillante du ciel nocturne", constellation: "Canis Major", distanceFromEarth: 8.6, luminosity: 25.4, mass: 2.02, magnitude: -1.46, price: 9999.99 },
  { name: "Canopus", description: "La deuxième étoile la plus brillante du ciel nocturne", constellation: "Carina", distanceFromEarth: 310, luminosity: 10700, mass: 8, magnitude: -0.74, price: 15000 },
  { name: "Alpha Centauri A", description: "L'étoile la plus proche de notre système solaire", constellation: "Centaurus", distanceFromEarth: 4.37, luminosity: 1.519, mass: 1.1, magnitude: -0.01, price: 20000 },
  { name: "Arcturus", description: "L'étoile la plus brillante de l'hémisphère nord", constellation: "Boötes", distanceFromEarth: 37, luminosity: 170, mass: 1.08, magnitude: -0.05, price: 12000 },
  { name: "Vega", description: "Ancienne étoile polaire", constellation: "Lyra", distanceFromEarth: 25, luminosity: 40, mass: 2.1, magnitude: 0.03, price: 11000 },
  { name: "Capella", description: "La sixième étoile la plus brillante du ciel nocturne", constellation: "Auriga", distanceFromEarth: 42.9, luminosity: 78.7, mass: 2.57, magnitude: 0.08, price: 13000 },
  { name: "Rigel", description: "Supergéante bleue dans Orion", constellation: "Orion", distanceFromEarth: 860, luminosity: 120000, mass: 23, magnitude: 0.13, price: 18000 },
  { name: "Procyon", description: "Étoile binaire proche", constellation: "Canis Minor", distanceFromEarth: 11.5, luminosity: 7.7, mass: 1.5, magnitude: 0.34, price: 9000 },
  { name: "Betelgeuse", description: "Supergéante rouge dans Orion", constellation: "Orion", distanceFromEarth: 640, luminosity: 126000, mass: 11.6, magnitude: 0.45, price: 17000 },
  { name: "Achernar", description: "Étoile la plus brillante de la constellation de l'Éridan", constellation: "Eridanus", distanceFromEarth: 139, luminosity: 3150, mass: 6.7, magnitude: 0.46, price: 14000 },
  { name: "Hadar", description: "Deuxième étoile la plus brillante de la constellation du Centaure", constellation: "Centaurus", distanceFromEarth: 390, luminosity: 42000, mass: 10.5, magnitude: 0.61, price: 16000 },
  { name: "Altair", description: "L'étoile la plus brillante de la constellation de l'Aigle", constellation: "Aquila", distanceFromEarth: 16.7, luminosity: 10.6, mass: 1.79, magnitude: 0.77, price: 10000 },
  { name: "Aldebaran", description: "L'œil du Taureau", constellation: "Taurus", distanceFromEarth: 65, luminosity: 425, mass: 1.7, magnitude: 0.85, price: 11500 },
  { name: "Spica", description: "L'étoile la plus brillante de la constellation de la Vierge", constellation: "Virgo", distanceFromEarth: 250, luminosity: 2300, mass: 11.43, magnitude: 1.04, price: 13500 },
  { name: "Antares", description: "Le cœur du Scorpion", constellation: "Scorpius", distanceFromEarth: 550, luminosity: 65000, mass: 11.4, magnitude: 1.09, price: 15500 },
  { name: "Pollux", description: "L'étoile la plus brillante de la constellation des Gémeaux", constellation: "Gemini", distanceFromEarth: 33.7, luminosity: 32, mass: 1.9, magnitude: 1.14, price: 9500 },
  { name: "Fomalhaut", description: "L'étoile la plus brillante de la constellation du Poisson austral", constellation: "Piscis Austrinus", distanceFromEarth: 25, luminosity: 16.6, mass: 1.92, magnitude: 1.16, price: 10500 },
  { name: "Deneb", description: "La queue du Cygne", constellation: "Cygnus", distanceFromEarth: 2600, luminosity: 196000, mass: 19, magnitude: 1.25, price: 19000 },
  { name: "Regulus", description: "Le cœur du Lion", constellation: "Leo", distanceFromEarth: 79, luminosity: 316, mass: 3.8, magnitude: 1.35, price: 12500 },
  { name: "Castor", description: "L'une des étoiles principales des Gémeaux", constellation: "Gemini", distanceFromEarth: 51, luminosity: 30, mass: 2.4, magnitude: 1.58, price: 11000 }
];

const users = [
  { firstName: 'Admin', lastName: 'User', email: 'admin@stellaecommerce.com', password: 'adminpassword', role: 'admin' },
  { firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password123', role: 'client' },
  { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', password: 'password456', role: 'client' },
  { firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', password: 'alicepass', role: 'client' },
  { firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', password: 'bobpass', role: 'client' },
  { firstName: 'Carol', lastName: 'Williams', email: 'carol@example.com', password: 'carolpass', role: 'client' }
];

const orders = [
  { UserId: 2, date: new Date('2024-07-15'), status: 'pending', totalAmount: 9999.99 },
  { UserId: 3, date: new Date('2024-07-14'), status: 'paid', totalAmount: 15000 },
  { UserId: 4, date: new Date('2024-07-13'), status: 'shipped', totalAmount: 20000 },
  { UserId: 5, date: new Date('2024-07-12'), status: 'cancelled', totalAmount: 12000 },
  { UserId: 2, date: new Date('2024-07-11'), status: 'paid', totalAmount: 11000 }
];

const orderStars = [
  { OrderId: 1, StarId: 1, quantity: 1 },
  { OrderId: 2, StarId: 2, quantity: 1 },
  { OrderId: 3, StarId: 3, quantity: 1 },
  { OrderId: 4, StarId: 4, quantity: 1 },
  { OrderId: 5, StarId: 5, quantity: 1 },
  { OrderId: 1, StarId: 6, quantity: 2 },
  { OrderId: 2, StarId: 7, quantity: 1 },
  { OrderId: 3, StarId: 8, quantity: 3 },
  { OrderId: 4, StarId: 9, quantity: 1 },
  { OrderId: 5, StarId: 10, quantity: 2 }
];

async function generateSampleData() {
  try {
    await Star.bulkCreate(stars);
    console.log('Stars inserted successfully');

    await User.bulkCreate(users);
    console.log('Users generated successfully');

    await Order.bulkCreate(orders);
    console.log('Orders generated successfully');

    await OrderStar.bulkCreate(orderStars);
    console.log('OrderStars generated successfully');

    console.log('All sample data generated successfully');
  } catch (error) {
    console.error('Error generating sample data:', error);
    throw error;
  }
}

if (require.main === module) {
  const { sequelize } = require('../src/models');
  generateSampleData().then(() => sequelize.close());
}

module.exports = generateSampleData;