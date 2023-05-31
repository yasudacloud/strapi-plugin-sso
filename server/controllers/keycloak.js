'use strict';
const axios = require('axios');
const { v4 } = require('uuid');
const { getService } = require('@strapi/admin/server/utils');
const pkceChallenge = require('pkce-challenge').default;

const config = strapi.config.get('plugin.strapi-plugin-sso');
const debug = config['DEBUG'];

const configValidation = () => {
  if (
    config['KEYCLOAK_OAUTH_CLIENT_ID'] &&
    config['KEYCLOAK_OAUTH_CLIENT_SECRET'] &&
    config['KEYCLOAK_OAUTH_REALM_ID']
  ) {
    return config;
  }
  throw new Error(
    'KEYCLOAK_OAUTH_CLIENT_ID, KEYCLOAK_OAUTH_CLIENT_SECRET, and KEYCLOAK_OAUTH_REALM_ID are required',
  );
};

/**
 * Common constants
 */
const KEYCLOAK_ENDPOINT = strapi.config['KEYCLOAK_OAUTH_URL'].replace(
  '{realm_id}',
  strapi.config['KEYCLOAK_OAUTH_REALM_ID'],
);
const OAUTH_ENDPOINT = `${KEYCLOAK_ENDPOINT}/auth`;
const OAUTH_TOKEN_ENDPOINT = `${KEYCLOAK_ENDPOINT}/token`;
const OAUTH_USER_INFO_ENDPOINT = `${KEYCLOAK_ENDPOINT}/userinfo`;
const OAUTH_LOGOUT_ENDPOINT = `${KEYCLOAK_ENDPOINT}/logout`;
const OAUTH_SCOPE = 'openid profile offline_access';

async function keycloakSignIn(ctx) {
  configValidation();

  debug && strapi.log.info(`[KEYCLOAK] Login initiated. Started new session.`);
  debug &&
    strapi.log.info(`[KEYCLOAK] Redirect URL after login is set to ${ctx.query.redirectTo}.`);

  const clientId = config['KEYCLOAK_OAUTH_CLIENT_ID'];
  const redirectUri = encodeURIComponent(config['KEYCLOAK_OAUTH_REDIRECT_URI']);

  const url = `${KEYCLOAK_ENDPOINT}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${OAUTH_SCOPE}&response_type=code&state=${encodeURIComponent(
    ctx.query.redirectTo,
  )}`;

  debug && strapi.log.info(`[KEYCLOAK] Now forwarding user to Keycloak: ${url}.`);

  ctx.set('Location', url);
  return ctx.send({}, 302);
}

async function keycloakSignInCallback(ctx) {
  debug && strapi.log.info(`[KEYCLOAK] Callback received.`);

  configValidation();

  const tokenService = getService('token');
  const userService = getService('user');
  const oauthService = strapi.plugin('strapi-plugin-sso').service('oauth');
  const roleService = strapi.plugin('strapi-plugin-sso').service('role');

  if (!ctx.query.code) {
    return ctx.send(oauthService.renderSignUpError(`code Not Found`));
  }

  const params = new URLSearchParams();
  params.append('code', ctx.query.code);
  params.append('client_id', config['KEYCLOAK_OAUTH_CLIENT_ID']);
  params.append('client_secret', config['KEYCLOAK_OAUTH_CLIENT_SECRET']);
  params.append('redirect_uri', config['KEYCLOAK_OAUTH_REDIRECT_URI']);
  params.append('grant_type', 'authorization_code');

  try {
    const response = await axios.post(OAUTH_TOKEN_ENDPOINT, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    debug && strapi.log.info(`[KEYCLOAK] Token endpoint response.`, response);
    const userResponse = await axios.get(OAUTH_USER_INFO_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
      },
    });
    debug && strapi.log.info(`[KEYCLOAK] Token endpoint response.`, userResponse);

    const dbUser = await userService.findOneByEmail(userResponse.data.email);
    let activateUser;
    let jwtToken;
    debug && strapi.log.info(`[KEYCLOAK] DB user.`, dbUser);

    if (dbUser) {
      activateUser = dbUser;
      jwtToken = await tokenService.createJwtToken(dbUser);
    } else {
      const keycloakRoles = await roleService.keycloakAdRoles();
      const roles =
        keycloakRoles && keycloakRoles['roles']
          ? keycloakRoles['roles'].map((role) => ({
              id: role,
            }))
          : [];

      debug && strapi.log.info(`[KEYCLOAK] Roles.`, keycloakRoles);

      const defaultLocale = oauthService.localeFindByHeader(ctx.request.headers);
      // activateUser = await oauthService.createUser(
      //   userResponse.data.email,
      //   userResponse.data.family_name,
      //   userResponse.data.given_name,
      //   defaultLocale,
      //   roles,
      // );
      // jwtToken = await tokenService.createJwtToken(activateUser);

      // // Trigger webhook
      // await oauthService.triggerWebHook(activateUser);
    }
    // Login Event Call
    oauthService.triggerSignInSuccess(activateUser);

    const nonce = v4();
    const html = oauthService.renderSignUpSuccess(jwtToken, activateUser, nonce);
    ctx.set('Content-Security-Policy', `script-src 'nonce-${nonce}'`);
    ctx.send(html);
  } catch (e) {
    console.error(e.response.data);
    ctx.send(oauthService.renderSignUpError(e.message));
  }
}

module.exports = {
  keycloakSignIn,
  keycloakSignInCallback,
};
