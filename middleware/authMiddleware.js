require("dotenv").config();
const jwt = require("jsonwebtoken");
const { secretToken } = process.env;

const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, secretToken, (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkToken = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, secretToken, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkToken };
