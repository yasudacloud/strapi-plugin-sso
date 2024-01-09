'use strict';

const google = require("./google");
const cognito = require("./cognito");
const azuread = require("./azuread");
const oidc = require("./oidc");
const keycloak = require('./keycloak');
const role = require("./role");

module.exports = {
  google,
  cognito,
  azuread,
  keycloak,
  oidc,
  role,
};
