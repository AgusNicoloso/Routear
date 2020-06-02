require("./config/config.js");

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(require("./routes/users"));
if (!process.env.NODE_ENV === "dev") {
  var firebaseConfig = {
    apiKey: "AIzaSyCRHqtCPivEKD3WDlzRdH-el0lAboyMXvg",
    authDomain: "myroutes-e81e0.firebaseapp.com",
    databaseURL: "https://myroutes-e81e0.firebaseio.com",
    projectId: "myroutes-e81e0",
    storageBucket: "myroutes-e81e0.appspot.com",
    messagingSenderId: "273893702321",
    appId: "1:273893702321:web:c0ca492742d11e5ca10090",
    measurementId: "G-TEMCYQKRYZ",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
} else {
  mongoose.connect("mongodb://localhost:27017/routear", (err, res) => {
    if (err) throw err;
    console.log("Base de datos ONLINE!!!");
  });
}

//LISTENER
app.listen(process.env.PORT, () => {
  console.log("Escuchando puerto: ", process.env.PORT);
});
