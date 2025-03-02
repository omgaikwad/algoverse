const mongoose = require("mongoose");
require("dotenv").config();

const DBConection = async () => {
  const MONGO_URL = process.env.MONGO_URI;

  try {
    await mongoose.connect(MONGO_URL);
    console.log("DB Connected");
  } catch (err) {
    console.log("Error in DB Connection", err);
  }
};

module.exports = DBConection;
