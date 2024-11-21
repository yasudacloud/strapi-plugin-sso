"use strict";
module.exports = {
  default: {
    REMEMBER_ME: false,
    GOOGLE_OAUTH_REDIRECT_URI:
      "http://localhost:1337/webunal-login/google/callback",
    GOOGLE_GSUITE_HD: "",
    GOOGLE_ALIAS: "",
    CUSTOM_GOOGLE_SIGNIN_URL: "", // Añadir esta línea para permitir la personalización
  },
  validator() {},
};
