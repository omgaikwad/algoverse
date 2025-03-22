const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(422).json({ error: "All input fields are required!" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(422).json({ error: "User already exists!" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ _id: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });
    user.token = token;
    user.password = undefined;

    res
      .status(201)
      .json({ message: "User registered successfully", status: true, user });
  } catch (error) {
    console.log("Error in Register Page", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: "All input fields are required!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const token = jwt.sign({ _id: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });
    user.token = token;
    user.password = undefined;

    res
      .status(200)
      .json({ message: "User logged in successfully", status: true, user });
  } catch (error) {
    console.log("Error in Login Page", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
