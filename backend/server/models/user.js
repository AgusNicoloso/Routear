const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
let Schema = mongoose.Schema;

let rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol válido",
};
let userSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es necesario"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El email es necesario"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es necesaria"],
  },
  img: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "USER_ROLE",
    enum: rolesValidos,
  },
  state: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.toJSON = function () {
  let user = this;
  let userObj = user.toObject();
  delete userObj.password;

  return userObj;
};

userSchema.plugin(uniqueValidator, { message: "{PATH} debe ser único" });

module.exports = mongoose.model("User", userSchema);
