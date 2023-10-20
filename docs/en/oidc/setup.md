# Single sign-on using OIDC providers

First, follow README.md to install the plugin to Strapi Version 4.

A sample local environment is shown below.

## 1. OIDC Provider Settings

Depending on your OIDC Provider the setup may vary. 

## 2. Plugin Settings

|  Key |  required | default |
| --- | -- | ---- |
| OIDC_REDIRECT_URI | - | http://localhost:1337/strapi-plugin-sso/oidc/callback |
| OIDC_CLIENT_ID | ✅ | - |
| OIDC_CLIENT_SECRET | ✅ | - |
| OIDC_SCOPES | - | openid profile email |
| OIDC_AUTHORIZATION_ENDPOINT | ✅ | - |
| OIDC_TOKEN_ENDPOINT | ✅ | - |
| OIDC_USER_INFO_ENDPOINT | ✅ | - |
| OIDC_USER_INFO_ENDPOINT_WITH_AUTH_HEADER | - | false |
| OIDC_GRANT_TYPE | - | authorization_code |
| OIDC_FAMILY_NAME_FIELD| - | family_name |
| OIDC_GIVEN_NAME_FIELD | - | given_name |

### edit config/plugins.js
```javascript
module.exports = ({env}) => ({
  'strapi-plugin-sso': {
    enabled: true,
    config: {
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

## 3. Sign in with your OIDC account
```
http://localhost:1337/strapi-plugin-sso/oidc
```
If you can see the authentication screen of your OIDC Provider and then log in to the administration screen, you are done!
