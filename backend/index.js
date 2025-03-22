const express = require("express");
const DBConection = require("./database/db");
const routes = require("./routes/routes");

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

DBConection();

app.use("/", routes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
