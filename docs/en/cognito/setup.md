# Single sign-on using Cognito User Pool

It is basically the same as linking [Google accounts](../google/setup.md).

However, Cognito does not have GOOGLE_ALIAS and GOOGLE_GSUITE_HD.

There are two solutions to the problem of free user registration.

### 1. Do not allow users to register
Only administrators can be configured to create accounts. Check the Cognito administration page.

If Strapi has a limited number of users, this is recommended.


### 2. Authentication control with Lambda
Authentication can be freely controlled using Cognito triggers.

This is recommended for use by an unspecified number of users belonging to an organization.

## Webhooks
This is the same specification as [Google Single Sign On](../google/admin.md).


## Available setting values

|  Key |  required | default |
| --- | -- | ---- |
| COGNITO_OAUTH_CLIENT_ID | ✅ | - |
| COGNITO_OAUTH_CLIENT_SECRET | ✅ | - |
| COGNITO_OAUTH_DOMAIN | ✅ | - |
| COGNITO_OAUTH_REDIRECT_URI | - | http://localhost:1337/strapi-plugin-sso/cognito/callback |
| COGNITO_OAUTH_REGION | - | ap-northeast-1 |

**Please note the default region.**
