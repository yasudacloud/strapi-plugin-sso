"use strict";

module.exports = {
  default: {
    REMEMBER_ME: false,

    GOOGLE_OAUTH_REDIRECT_URI:
      "http://localhost:1337/strapi-plugin-sso/api/connect/google/callback",
    GOOGLE_GSUITE_HD: "",
    GOOGLE_ALIAS: "",
  },
  validator() {},
};
