// src/models/Cart.js

module.exports = (sequelize, _DataTypes) => {
  const Cart = sequelize.define(
    "Cart",
    {
      // Aucun champ défini ici
    },
    {
      tableName: "Carts",
      timestamps: true,
    },
  );

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
    Cart.hasMany(models.CartItem, { foreignKey: "cartId", as: "cartItems", onDelete: "CASCADE" });
  };

  Cart.prototype.getTotalPrice = async function () {
    // Optimisation : inclure les données Star pour éviter les requêtes N+1
    const cartItems = await this.getCartItems({
      include: [{
        model: sequelize.models.Star,
        attributes: ['price']
      }]
    });

    return cartItems.reduce((total, item) => {
      return total + (item.quantity * parseFloat(item.Star.price));
    }, 0);
  };

  return Cart;
};