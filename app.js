require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const { requireAuth, checkToken } = require("./middleware/authMiddleware");

const app = express();
const PORT = 3000 || process.env.PORT;
const { connectURL } = process.env;

// middleware
app.use(express.static("public"));
app.use(express.json({ extended: true, limit: "30mb" }));
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// connect database
mongoose
  .connect(connectURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, console.log(`Server running on port ${PORT}`)))
  .catch((err) => console.log(`${err} did not connect.`));

// routes
app.get("*", checkToken); // * => all routes

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/smoothies", requireAuth, (req, res) => {
  res.render("smoothies");
});

app.use(authRoutes);
