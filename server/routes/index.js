module.exports = [
  {
    method: 'GET',
    path: '/google',
    handler: 'google.googleSignIn',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/google/callback',
    handler: 'google.googleSignInCallback',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/cognito',
    handler: 'cognito.cognitoSignIn',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/cognito/callback',
    handler: 'cognito.cognitoSignInCallback',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/azuread',
    handler: 'azuread.azureAdSignIn',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/azuread/callback',
    handler: 'azuread.azureAdSignInCallback',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/keycloack',
    handler: 'keycloack.keycloakSignIn',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/keycloack/callback',
    handler: 'keycloack.keycloackSignInCallback',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/sso-roles',
    handler: 'role.find',
  },
  {
    method: 'PUT',
    path: '/sso-roles',
    handler: 'role.update',
  },
];
