const express = require("express");

const router = express.Router();
const authController = require("./../controllers/authController");
const productController = require("./../controllers/productController");

router.get(
  "/products",
  authController.protect,
  productController.getAllProducts
);

module.exports = router;
