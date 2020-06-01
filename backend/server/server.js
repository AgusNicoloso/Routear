//Prueba commit cambio de nombre
require("./config/config.js");

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(require("./routes/users"));

mongoose.connect("mongodb://localhost:27017/routear", (err, res) => {
  if (err) throw err;
  console.log("Base de datos ONLINE!!!");
});

//LISTENER
app.listen(process.env.PORT, () => {
  console.log("Escuchando puerto: ", process.env.PORT);
});
