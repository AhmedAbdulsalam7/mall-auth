module.exports = (sequelize, DataType) => {
  const Profile = sequelize.define("Profile", {
    firstname: {
      type: DataType.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataType.STRING,
      allowNull: false,
    },
    county: {
      type: DataType.STRING,
    },
  });
  Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
      onDelete: "cascade",
    });
  };
  return Profile;
};
