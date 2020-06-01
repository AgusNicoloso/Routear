const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const app = express();
//GET
app.get("/user", function (req, res) {
  res.json("Get user");
});

//POST
app.post("/user", function (req, res) {
  let body = req.body;
  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });
  user.save((err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      user: userDB,
    });
  });
});

//PUT
app.put("/user/:id", function (req, res) {
  let id = req.params.id;
  res.json({
    id,
  });
});

//DELETE
app.delete("/user", function (req, res) {
  res.json("Delete user");
});

module.exports = app;
