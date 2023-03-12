// const bcrypt = require("bcrypt");

module.exports = (sequelize, DataType) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataType.STRING,
        allowNull: false,
      },
      email: {
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        isEmail: true,
      },
      photo: {
        type: DataType.STRING,
      },
      password: {
        type: DataType.STRING,
        allowNull: false,
        min: 8,
      },
    }
    // {
    //   //   freezeTableName: true,
    //   instanceMethods: {
    //     generateHash(password) {
    //       return bcrypt.hash(password, bcrypt.genSaltSync(8));
    //     },
    //     validPassword(password) {
    //       return bcrypt.compare(password, this.password);
    //     },
    //   },
    // }
  );

  //   User.prototype.generateHash = function generateHash(password) {
  //     return bcrypt.hash(password, bcrypt.genSaltSync(8));
  //   };
  User.associate = (models) => {
    User.hasMany(models.Product, {
      onDelete: "cascade",
    });
    User.hasOne(models.Profile, {
      onDelete: "cascade",
    });
  };
  return User;
};
