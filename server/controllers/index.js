"use strict";

const google = require("./google");
const cognito = require("./cognito");
const azuread = require("./azuread");
const oidc = require("./oidc");
const role = require("./role");

module.exports = {
  google,
  cognito,
  azuread,
  oidc,
  role,
};
