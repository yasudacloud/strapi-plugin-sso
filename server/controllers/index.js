"use strict";

const google = require("./google");
const cognito = require("./cognito");
const azuread = require("./azuread");
const role = require("./role");

module.exports = {
  google,
  cognito,
  azuread,
  role,
};
