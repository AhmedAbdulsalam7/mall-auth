module.exports = (sequelize, DataType) => {
  const Product = sequelize.define("Product", {
    name: {
      type: DataType.STRING,
      allowNull: false,
    },
    price: {
      type: DataType.STRING,
    },
  });
  Product.associate = (models) => {
    Product.belongsTo(models.User, {
      onDelete: "cascade",
    });
  };
  return Product;
};
