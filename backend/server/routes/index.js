const express = require("express");
const app = express();

app.use(require("./users"));
app.use(require("./login"));
app.use(require("./trips"));
module.exports = app;
