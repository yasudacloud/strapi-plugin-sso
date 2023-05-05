"use strict";

const google = require("./google");
const cognito = require("./cognito");
const azuread = require("./azuread");
const role = require("./role");
const login = require("./login");

module.exports = {
  google,
  cognito,
  azuread,
  role,
  login,
};
