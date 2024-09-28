<div align="center">
 <img src="https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/strapi-plugin-sso.png?raw=true" width="180"/>
</div>

# Strapi plugin strapi-plugin-sso

This plugin can provide single sign-on.

You will be able to log in to the administration screen using one of the following providers:

- Google
- Cognito
- Azure
- OIDC

Please read the [documents](#user-content-documentationenglish) for some precautions.

**If possible, consider using the Gold Plan features.**

# Version

| NodeJS          | Strapi | strapi-plugin-sso |
|-----------------|--------|-------------------|
| 16.0.0 - 21.0.0 | v4     | 0.\*.\*           |
| 18.0.0 - 21.0.0 | v5     | 1.\*.\*           |

# Easy to install

```shell
yarn add strapi-plugin-sso
```

or

```shell
npm i strapi-plugin-sso
```

# Requirements

- **strapi-plugin-sso**
- Google Account or AWS Cognito UserPool or a OIDC provider

# Example Configuration

```javascript
// config/plugins.js
module.exports = ({env}) => ({
  'strapi-plugin-sso': {
    enabled: true,
    config: {
      // Either sets token to session storage if false or local storage if true
      REMEMBER_ME: false,
      // Google
      GOOGLE_OAUTH_CLIENT_ID: '[Client ID created in GCP]',
      GOOGLE_OAUTH_CLIENT_SECRET: '[Client Secret created in GCP]',
      GOOGLE_OAUTH_REDIRECT_URI: 'http://localhost:1337/strapi-plugin-sso/google/callback', // URI after successful login
      GOOGLE_ALIAS: '', // Gmail Aliases
      GOOGLE_GSUITE_HD: '', // G Suite Primary Domain

      // Cognito
      COGNITO_OAUTH_CLIENT_ID: '[Client ID created in AWS Cognito]',
      COGNITO_OAUTH_CLIENT_SECRET: '[Client Secret created in AWS Cognito]',
      COGNITO_OAUTH_DOMAIN: '[OAuth Domain created in AWS Cognito]',
      COGNITO_OAUTH_REDIRECT_URI: 'http://localhost:1337/strapi-plugin-sso/cognito/callback', //  // URI after successful login
      COGNITO_OAUTH_REGION: 'ap-northeast-1', // AWS Cognito Region 

      // AzureAD
      AZUREAD_OAUTH_REDIRECT_URI: 'http://localhost:1337/strapi-plugin-sso/azuread/callback',
      AZUREAD_TENANT_ID: '[Tenant ID created in AzureAD]',
      AZUREAD_OAUTH_CLIENT_ID: '[Client ID created in AzureAD]', // [Application (client) ID]
      AZUREAD_OAUTH_CLIENT_SECRET: '[Client Secret created in AzureAD]',
      AZUREAD_SCOPE: 'user.read', // https://learn.microsoft.com/en-us/graph/permissions-reference

      // OpenID Connect
      OIDC_REDIRECT_URI: 'http://localhost:1337/strapi-plugin-sso/oidc/callback', // URI after successful login
      OIDC_CLIENT_ID: '[Client ID from OpenID Provider]',
      OIDC_CLIENT_SECRET: '[Client Secret from OpenID Provider]',

      OIDC_SCOPES: 'openid profile email', // https://oauth.net/2/scope/
      // API Endpoints required for OIDC
      OIDC_AUTHORIZATION_ENDPOINT: '[API Endpoint]',
      OIDC_TOKEN_ENDPOINT: '[API Endpoint]',
      OIDC_USER_INFO_ENDPOINT: '[API Endpoint]',
      OIDC_USER_INFO_ENDPOINT_WITH_AUTH_HEADER: false,
      OIDC_GRANT_TYPE: 'authorization_code', // https://oauth.net/2/grant-types/
      // customizable username arguments
      OIDC_FAMILY_NAME_FIELD: 'family_name',
      OIDC_GIVEN_NAME_FIELD: 'given_name',
    }
  }
})
```

Of the above, the environment variable for the provider you wish to use is all that is needed.

# Documentation(English)

[Google Single Sign On Setup](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/en/google/setup.md)

[Google Single Sign On Specifications](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/en/google/admin.md)

[Cognito Single Sign On Setup](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/en/cognito/setup.md)

[AzureAD Single Sign On Setup](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/en/azuread/setup.md)

[OIDC Single Sign On Setup](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/en/oidc/setup.md)

# Documentation(Japanese)

[Description](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/README.md)

[Google Single Sign On Setup](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/ja/google/setup.md)

[Google Single Sign-On Specifications](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/ja/google/admin.md)

[Cognito Single Sign On Setup](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/ja/cognito/setup.md)

[Cognito Single Sign-On Specifications](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/ja/cognito/admin.md)

TODO AzureAD Single Sign On Setup

TODO OIDC Single Sign On Setup

# Demo

![CognitoDemo](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/demo.gif?raw=true "DemoMovie")
