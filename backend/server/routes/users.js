const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const User = require("../models/user");
const app = express();
const {
  verificationToken,
  verificationRole,
} = require("../middlewares/authentication");
//GET
app.get("/users", verificationToken, (req, res) => {
  let filter = req.query;
  let from = req.query.from || 0;
  from = Number(from);
  let to = req.query.to || 5;
  to = Number(to);
  delete filter.from;
  delete filter.to;
  User.find({ state: true, $and: [filter] }, "name email role state img")
    .skip(from)
    .limit(to)
    .exec((err, userDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      User.countDocuments({ state: true }, (err, count) => {
        res.json({
          ok: true,
          count,
          userDB,
        });
      });
    });
});

//POST
app.post("/users", function (req, res) {
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
app.put("/users/:id", [verificationToken, verificationRole], function (
  req,
  res
) {
  let id = req.params.id;
  let body = _.pick(req.body, ["name", "email", "img", "role", "state"]);

  User.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, userDB) => {
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
    }
  );
});

//DELETE
app.delete("/users/:id", [verificationToken, verificationRole], function (
  req,
  res
) {
  let id = req.params.id;
  let changeState = {
    state: false,
  };

  User.findByIdAndUpdate(id, changeState, { new: true }, (err, userDeleted) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!userDeleted) {
      return res.status(400).json({
        ok: false,
        error: {
          message: "Usuario no encontrado",
        },
      });
    }
    res.json({
      ok: true,
      userDeleted,
    });
  });
});

module.exports = app;
