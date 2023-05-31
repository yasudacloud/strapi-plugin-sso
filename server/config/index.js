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

    KEYCLOAK_OAUTH_REDIRECT_URI: 'http://localhost:1337/strapi-plugin-sso/keycloak/callback',
    KEYCLOAK_OAUTH_REALM_ID: '',
    KEYCLOAK_OAUTH_CLIENT_ID: '',
    KEYCLOAK_OAUTH_CLIENT_SECRET: '',
    KEYCLOAK_OAUTH_URL: 'http://localhost:8080/realms/{realm_id}/protocol/openid-connect',

    DEBUG: false,
  },
  validator() {},
};
