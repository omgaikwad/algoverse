const express = require("express");
const DBConection = require("./database/db");
const routes = require("./routes/routes");
const cors = require("cors");

const app = express();

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies if needed
  })
);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

DBConection();

app.use("/", routes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
