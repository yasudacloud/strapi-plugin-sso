'use strict';

const google = require('./google');
const cognito = require('./cognito');
const azuread = require('./azuread');
const keycloak = require('./keycloak');
const role = require('./role');

module.exports = {
  google,
  cognito,
  azuread,
  keycloak,
  role,
};
