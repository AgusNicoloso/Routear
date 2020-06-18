require("./config/config.js");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require("./routes/index"));
// parse application/json
app.use(bodyParser.json());

if (process.env.NODE_ENV === "dev") {
  mongoose.connect(
    "mongodb://localhost:27017/routear",
    { dbName: "routear", useUnifiedTopology: true, useNewUrlParser: true },
    (err, res) => {
      if (err) throw err;
      console.log("Base de datos Local ONLINE!!!");
    }
  );
  mongoose.set("useCreateIndex", true);
} else {
  const uri = process.env.MONGO_URI;
  mongoose.connect(
    uri,
    { dbName: "Routear", useUnifiedTopology: true, useNewUrlParser: true },
    (err, res) => {
      if (err) throw err;
      console.log("Base de datos Nube ONLINE!!!");
    }
  );
  mongoose.set("useCreateIndex", true);
}

//LISTENER
app.listen(process.env.PORT, () => {
  console.log("Escuchando puerto: ", process.env.PORT);
});
