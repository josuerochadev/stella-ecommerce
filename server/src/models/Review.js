// models/Review.js
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "Review",
    {
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "reviews",
      timestamps: true,
      indexes: [
        { fields: ["user_id"] },
        { fields: ["star_id"] },
        { fields: ["user_id", "star_id"], unique: true },
      ],
    },
  );

  Review.associate = (models) => {
    Review.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
    Review.belongsTo(models.Star, { foreignKey: "starId", onDelete: "CASCADE" });
  };

  return Review;
};
