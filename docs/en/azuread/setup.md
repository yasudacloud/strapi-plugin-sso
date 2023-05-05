# Single sign-on using AzureAD

This document provides instructions for integrating AzureAD as a Single Sign-On (SSO) provider for this plugin. The process is similar to linking [Google accounts](../google/setup.md).

## Setup

1. Register your application in the Azure portal and configure it to use AzureAD.
2. Create an OAuth2 client ID and secret.
3. Set up the required environment variables and pass them in to `config/plugins.js`.

## Available setting values

| Key                         | Required | Default                                                  |
| --------------------------- | -------- | -------------------------------------------------------- |
| AZUREAD_OAUTH_CLIENT_ID     | ✅       | -                                                        |
| AZUREAD_OAUTH_CLIENT_SECRET | ✅       | -                                                        |
| AZUREAD_TENANT_ID           | ✅       | -                                                        |
| AZUREAD_OAUTH_REDIRECT_URI  | -        | http://localhost:1337/strapi-plugin-sso/azuread/callback |
| AZUREAD_SCOPE               | -        | user.read                                                |

### Configuring environment variables

Use the following environment variables to configure the AzureAD integration:

1. `AZUREAD_OAUTH_CLIENT_ID`: The Application (client) ID created in AzureAD.
2. `AZUREAD_OAUTH_CLIENT_SECRET`: The Client Secret created in AzureAD.
3. `AZUREAD_TENANT_ID`: The Tenant ID created in AzureAD.
4. `AZUREAD_OAUTH_REDIRECT_URI`: The callback URL used by AzureAD to redirect the user after authentication. Defaults to 'http://localhost:1337/strapi-plugin-sso/azuread/callback'.
5. `AZUREAD_SCOPE`: The permissions your application requires from the user. Defaults to 'user.read'. More information on permissions can be found in the [Microsoft Graph permissions reference](https://docs.microsoft.com/en-us/graph/permissions-reference).

Make sure to replace the placeholders with the actual values you obtained from AzureAD.
