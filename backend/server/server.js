require("./config/config.js");
const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(require("./routes/users"));
if (process.env.NODE_ENV === "dev") {
  mongoose.connect("mongodb://localhost:27017/Routear", (err, res) => {
    if (err) throw err;
    console.log("Base de datos Local ONLINE!!!");
  });
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
