const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let tripSchema = new Schema({
  driver: { type: Schema.Types.ObjectId, ref: "User" },
  brand: { type: String, required: [true, "La marca es necesaria"] },
  model: { type: String, required: [true, "El modelo es necesario"] },
  patent: { type: String, required: [true, "La patente es necesaria"] },
  countpassengers: {
    type: Number,
    required: [true, "La cantidad de pasajeros es necesaria"],
  },
});

module.exports = mongoose.model("Trip", tripSchema);
