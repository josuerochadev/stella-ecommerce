// models/Wishlist.js
module.exports = (sequelize, _DataTypes) => {
  const Wishlist = sequelize.define(
    "Wishlist",
    {},
    {
      tableName: "wishlists",
      timestamps: true,
      indexes: [
        { fields: ["userId"] },
        { fields: ["starId"] },
        { fields: ["userId", "starId"], unique: true },
      ],
    },
  );

  Wishlist.associate = (models) => {
    Wishlist.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
    Wishlist.belongsTo(models.Star, { foreignKey: "starId", onDelete: "CASCADE" });
  };

  return Wishlist;
};