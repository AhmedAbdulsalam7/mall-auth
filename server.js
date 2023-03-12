const express = require("express");
const app = express();
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const db = require("./models");

// app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});

app.use("/", userRoutes);
app.use("/", productRoutes);

db.sequelize.sync().then(() => {
  app.listen(3000, () => console.log("listen on port 3000"));
});
