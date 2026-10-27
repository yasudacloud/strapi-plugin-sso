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
| OIDC_LOGOUT_ENDPOINT | - | - |

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
      // optional: also log out of the provider when logging out of Strapi
      OIDC_LOGOUT_ENDPOINT: '[API Endpoint]',
    }
  }
})
```

## 3. Sign in with your OIDC account
```
http://localhost:1337/strapi-plugin-sso/oidc
```
If you can see the authentication screen of your OIDC Provider and then log in to the administration screen, you are done!

## 4. Logging out of the provider (optional)

By default, logging out of Strapi only ends the Strapi session. The session with your OIDC provider stays active, so the next OIDC sign-in logs the user straight back in without asking for credentials.

Set `OIDC_LOGOUT_ENDPOINT` to end the provider session as well. The plugin keeps the refresh token from the user's last OIDC sign-in, and when the user logs out of Strapi it sends it to this endpoint together with the client credentials:

```
POST OIDC_LOGOUT_ENDPOINT
Content-Type: application/x-www-form-urlencoded

client_id=...&client_secret=...&refresh_token=...
```

This works with providers that end a session from its refresh token, such as Keycloak (`https://[host]/realms/[realm]/protocol/openid-connect/logout`). Your provider must return a refresh token at sign-in.

If the provider can't be reached, the Strapi logout still succeeds and a warning is logged.
