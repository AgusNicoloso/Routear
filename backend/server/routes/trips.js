const express = require("express");
let { verificationToken } = require("../middlewares/authentication");

let app = express();
let Trip = require("../models/trip");

app.get("/trips", (req, res) => {});

app.get("/trips/:id", (req, res) => {});

app.post("/trips", verificationToken, (req, res) => {
  let body = req.body;
  let trip = new Trip({
    driver: req.user._id,
    brand: body.brand,
    model: body.model,
    patent: body.patent,
    countpassengers: body.countpassengers,
  });

  trip.save((err, tripDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!tripDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      trip: tripDB,
    });
  });
});
app.put("/trips/:id", verificationToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;
  let updateTrip = {
    brand: body.brand,
    model: body.model,
    patent: body.patent,
    countpassengers: body.countpassengers,
  };
  Trip.findByIdAndUpdate(
    id,
    updateTrip,
    { new: true, runValidators: true },
    (err, tripDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!tripDB) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        trip: tripDB,
      });
    }
  );
});

app.delete("/trips/:id", verificationToken, (req, res) => {
  let id = req.params.id;

  Trip.findOneAndRemove(id, (err, tripDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!tripDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El id no existe",
        },
      });
    }
  });
});
module.exports = app;
