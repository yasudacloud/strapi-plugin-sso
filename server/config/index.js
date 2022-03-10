'use strict';

module.exports = {
  default: {
    // Required
    GOOGLE_OAUTH_CLIENT_ID: '',
    GOOGLE_OAUTH_CLIENT_SECRET: '',

    GOOGLE_OAUTH_REDIRECT_URI: 'http://localhost:1337/strapi-plugin-sso/google/callback',
    GOOGLE_GSUITE_HD: '',
    GOOGLE_ALIAS: ''
  },
  validator() {
    return {
      GOOGLE_OAUTH_CLIENT_ID22222: 'string.required'
    }
  },
};
