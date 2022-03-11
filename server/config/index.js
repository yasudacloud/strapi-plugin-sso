'use strict';

module.exports = {
  default: {
    GOOGLE_OAUTH_REDIRECT_URI: 'http://localhost:1337/strapi-plugin-sso/google/callback',
    GOOGLE_GSUITE_HD: '',
    GOOGLE_ALIAS: '',

    COGNITO_OAUTH_REDIRECT_URI: 'http://localhost:1337/strapi-plugin-sso/cognito/callback',
    COGNITO_OAUTH_REGION: 'ap-northeast-1',
  },
  validator() {
  },
};
