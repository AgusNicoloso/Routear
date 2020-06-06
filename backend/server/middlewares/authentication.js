const jwt = require("jsonwebtoken");
let verificationToken = (req, res, next) => {
  let token = req.get("Authorization");

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token invalido",
        },
      });
    }

    req.user = decoded.user;
    next();
  });
};

let verificationRole = (req, res, next) => {
  let user = req.user;

  if (user.role === "ADMIN_ROLE") {
    next();
  } else {
    return res.json({
      ok: false,
      err: {
        message: "El usuario no es administrador",
      },
    });
  }
};

module.exports = {
  verificationToken,
  verificationRole,
};
