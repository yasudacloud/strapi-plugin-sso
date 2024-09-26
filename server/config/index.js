export default {
  default: {
    REMEMBER_ME: false,

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

    OIDC_REDIRECT_URI: 'http://localhost:1337/strapi-plugin-sso/oidc/callback',
    OIDC_CLIENT_ID: '',
    OIDC_CLIENT_SECRET: '',
    OIDC_SCOPES: 'openid profile email',
    OIDC_AUTHORIZATION_ENDPOINT: '',
    OIDC_TOKEN_ENDPOINT: '',
    OIDC_USER_INFO_ENDPOINT: '',
    OIDC_USER_INFO_ENDPOINT_WITH_AUTH_HEADER: false,
    OIDC_GRANT_TYPE: 'authorization_code',
    OIDC_FAMILY_NAME_FIELD: 'family_name',
    OIDC_GIVEN_NAME_FIELD: 'given_name',
  },
  validator() {
  },
};
