const express = require("express");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerUser, loginUser } = require("../controllers/authController");
const { runCode } = require("../controllers/compilerController");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Home Page");
});

router.post("/register", registerUser);

router.post("/login", loginUser);

// online code run compiler
router.post("/run", runCode);

module.exports = router;
