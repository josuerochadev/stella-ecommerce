// src/models/Order.js
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "paid", "shipped", "cancelled", "payment_failed", "refunded", "partially_refunded"),
      allowNull: false,
      defaultValue: "pending",
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    transactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    paymentError: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refundId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    refundReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    tableName: "orders",
    timestamps: true,
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: "UserId" });
    Order.hasMany(models.OrderStar, { foreignKey: "orderId" });
    Order.belongsToMany(models.Star, { through: models.OrderStar, foreignKey: "orderId" });
  };

  return Order;
};
