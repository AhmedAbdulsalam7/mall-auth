const db = require("./../models");
// const User = require("./../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
// const { decode } = require("punycode");

const signToken = (id) => {
  return jwt.sign({ id }, "ultra-secure-secret", {
    expiresIn: "20d",
  });
};

exports.signup = async (req, res, next) => {
  const hashPassword = await bcrypt.hash(
    req.body.password,
    bcrypt.genSaltSync(8)
  );

  // const pass = await bcrypt.hash("pass123", bcrypt.genSaltSync(8));

  // console.log(`pass${pass}`);
  // const check = await bcrypt.compare("pass1234", hashPassword);
  // console.log(`check==========${check}`);
  // console.log(`hashPassword${hashPassword}`);
  const newUser = await db.User.create({
    username: req.body.username,
    email: req.body.email,
    // password: req.body.password,
    password: hashPassword,
  });

  // create token for the new user

  const token = signToken(newUser.id);

  res.status(201).json({
    status: "success",
    token,
    user: newUser,
  });

  // .then((response) => res.status(200).send(response))
  // .catch((err) => res.status(400).send(err));
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(email);
  // console.log(password);
  if (!email || !password) {
    res.status(400).json({
      status: "field",
      msg: "The Email and Password required",
    });
  }
  const user = await db.User.findOne({ where: { email } });

  const correctPassword = async (candPass, userPass) => {
    return await bcrypt.compare(candPass, userPass);
  };

  if (
    user === null ||
    !(await correctPassword(password, user.dataValues.password))
  ) {
    return res.status(401).json({
      status: "feild",
      msg: "Incorrect Email or Password...",
    });
  }

  const token = signToken(user.id);
  res.status(200).json({
    status: "success",
    token,
  });
};

exports.protect = async (req, res, next) => {
  // 1) getting token and check if token exist in the header request...

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // console.log(token);

  if (!token) {
    return res.status(401).json({
      status: "field",
      msg: "You are not loged in please login to get access.",
    });
  }
  // 2) verification token...

  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, "ultra-secure-secret");
    // console.log(decoded);
  } catch (err) {
    return res.status(401).json({ error: err });
  }

  // 3) check if user still exist...

  let freshUser;
  if (decoded) {
    const id = parseInt(decoded.id);
    console.log(decoded);
    freshUser = await db.User.findOne({ where: { id } });
    console.log(freshUser);
  }

  if (!freshUser) {
    return res.status(401).json({
      status: "field",
      msg: "The user belonging to this token does no longer exist.",
    });
  }

  // chek if the user change the password...

  const changePassword = async (JWTTimestamp, userInfo) => {
    if (userInfo.updatedAt) {
      const chengedTimestamp = parseInt(
        userInfo.updatedAt.getTime() / 1000,
        10
      );
      console.log(chengedTimestamp, JWTTimestamp);

      return JWTTimestamp < chengedTimestamp; // should return FALSE
    }

    // false mean the password NOT changed...

    return false;
  };

  if (changePassword(decoded.iat, freshUser)) {
    return res.status(401).json({
      status: "field",
      msg: "User recently changed password! Please log in again.",
    });
  }

  next();
};
