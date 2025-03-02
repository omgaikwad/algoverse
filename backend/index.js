const express = require("express");
const DBConection = require("./database/db");
const User = require("./model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

DBConection();

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.post("/register", async (req, res) => {
  try {
    // GET ALL THE DATA FROM REGISTER PAGE FRONTEND
    const { firstName, lastName, email, password } = req.body;
    console.log(firstName, lastName, email, password);

    // CHECK THAT ALL THE DATA IS PRESENT
    if (!firstName || !lastName || !email || !password) {
      return res.status(422).json({ error: "All input fields are required!" });
    }

    // CHECK IF USER IS ALREADY PRESENT IN THE DATABASE
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(422).json({ error: "User already exists!" });
    }

    // ENCRYPT THE PASSWORD
    const hashedPassword = bcrypt.hashSync(password, 10);

    // SAVE THE DATA IN THE DATABASE
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // GENERATE A TOKEN FOR THE USER AND SEND TO IT
    const token = jwt.sign({ _id: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });
    user.token = token;

    // remove password from the user object before sending it to the client
    user.password = undefined;

    res
      .status(201)
      .json({ message: "User registered successfully", status: true, user });
  } catch (error) {
    console.log("Error in Register Page", error);
  }
});

app.get("/login", async (req, res) => {
  try {
    // GET ALL THE DATA FROM LOGIN PAGE FRONTEND
    const { email, password } = req.body;

    // CHECK THAT ALL THE DATA IS PRESENT
    if (!email || !password) {
      return res.status(422).json({ error: "All input fields are required!" });
    }

    // FIND THE USER IN THE DATABASE
    const user = await User.findOne({ email });

    // WATCH AND COMPARE THE PASSWORD
    const isMatch = bcrypt.compareSync(password, user.password);

    // STORE COOKIES AND SEND THE TOKEN
    const token = jwt.sign({ _id: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });
    user.token = token;

    // remove password from the user object before sending it to the client
    user.password = undefined;

    if (isMatch) {
      res
        .status(200)
        .json({ message: "User logged in successfully", status: true, user });
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (error) {
    console.log("Error in Login Page", error);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
