const db = require("./../models");
// const User = require("./../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getAllProducts = async (req, res, next) => {
  res.status(200).json({
    status: "success",
    product: "no product yet",
  });
};
