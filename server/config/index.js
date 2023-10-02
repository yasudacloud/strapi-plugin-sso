'use strict';

module.exports = {
  default: {
    GOOGLE_OAUTH_REDIRECT_URI: 'http://localhost:1337/strapi-plugin-sso/google/callback',
    GOOGLE_GSUITE_HD: '',
    GOOGLE_ALIAS: '',

    COGNITO_OAUTH_REDIRECT_URI: 'http://localhost:1337/strapi-plugin-sso/cognito/callback',
    COGNITO_OAUTH_REGION: 'ap-northeast-1',

    AZUREAD_OAUTH_REDIRECT_URI: 'http://localhost:1337/strapi-plugin-sso/azuread/callback',
    AZUREAD_TENANT_ID: '',
    AZUREAD_OAUTH_CLIENT_ID: '',
    AZUREAD_OAUTH_CLIENT_SECRET: '',
    AZUREAD_SCOPE: 'user.read',
    AZUREAD_OAUTH_USE_OIDC: 'true',
  },
  validator() {
  },
};
