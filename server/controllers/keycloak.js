'use strict';
const axios = require('axios');
const { v4 } = require('uuid');
const { getService } = require('@strapi/admin/server/utils');

const configValidation = () => {
  const {
    KEYCLOAK_OAUTH_REDIRECT_URI,
    KEYCLOAK_OAUTH_URL,
    KEYCLOAK_OAUTH_REALM_ID,
    KEYCLOAK_OAUTH_CLIENT_ID,
    KEYCLOAK_OAUTH_CLIENT_SECRET,
    DEBUG,
  } = strapi.config.get('plugin.strapi-plugin-sso');

  if (KEYCLOAK_OAUTH_CLIENT_ID && KEYCLOAK_OAUTH_CLIENT_SECRET && KEYCLOAK_OAUTH_REALM_ID) {
    const endpoint = KEYCLOAK_OAUTH_URL.replace('{realm_id}', KEYCLOAK_OAUTH_REALM_ID);
    return {
      endpoint,
      authEndpoint: `${endpoint}/auth`,
      tokenEndpoint: `${endpoint}/token`,
      userInfoEndpoint: `${endpoint}/userinfo`,
      redirectEndpoint: KEYCLOAK_OAUTH_REDIRECT_URI,
      debug: DEBUG,
      clientId: KEYCLOAK_OAUTH_CLIENT_ID,
      clientSecret: KEYCLOAK_OAUTH_CLIENT_SECRET,
      scope: 'openid email profile offline_access',
    };
  }
  throw new Error(
    'KEYCLOAK_OAUTH_CLIENT_ID, KEYCLOAK_OAUTH_CLIENT_SECRET, and KEYCLOAK_OAUTH_REALM_ID are required',
  );
};

async function keycloakSignIn(ctx) {
  const { authEndpoint, debug, clientId, redirectEndpoint, scope } = configValidation();

  debug && strapi.log.info(`[KEYCLOAK] Login initiated. Started new session.`);
  debug &&
    strapi.log.info(`[KEYCLOAK] Redirect URL after login is set to ${ctx.query.redirectTo}.`);
  const redirectUri = encodeURIComponent(redirectEndpoint);

  const url = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${encodeURIComponent(
    ctx.query.redirectTo,
  )}`;

  debug && strapi.log.info(`[KEYCLOAK] Now forwarding user to Keycloak: ${url}.`);

  ctx.set('Location', url);
  return ctx.send({}, 302);
}

async function keycloakSignInCallback(ctx) {
  const { debug, userInfoEndpoint, tokenEndpoint, clientId, clientSecret, redirectEndpoint } =
    configValidation();
  debug && strapi.log.info(`[KEYCLOAK] Callback received.`);

  const tokenService = getService('token');
  const userService = getService('user');
  const oauthService = strapi.plugin('strapi-plugin-sso').service('oauth');
  const roleService = strapi.plugin('strapi-plugin-sso').service('role');

  if (!ctx.query.code) {
    return ctx.send(oauthService.renderSignUpError(`code Not Found`));
  }

  debug && strapi.log.info(`[KEYCLOAK] Query context. ${JSON.stringify(ctx.query)}`);

  const params = new URLSearchParams();
  params.append('code', ctx.query.code);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectEndpoint);
  params.append('grant_type', 'authorization_code');

  try {
    const response = await axios.post(tokenEndpoint, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    debug &&
      strapi.log.info(`[KEYCLOAK] Token endpoint response: ${JSON.stringify(response.data)}`);
    const userResponse = await axios.get(userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
      },
    });
    debug &&
      strapi.log.info(`[KEYCLOAK] Token endpoint response. ${JSON.stringify(userResponse.data)}`);

    const dbUser = await userService.findOneByEmail(userResponse.data.email, ['roles']);
    const keycloakRoles = await roleService.keycloakAdRoles();
    const roles =
      keycloakRoles && keycloakRoles['roles']
        ? keycloakRoles['roles'].map((role) => ({
            id: role,
          }))
        : [];
    let activateUser;
    let jwtToken;
    debug && strapi.log.info(`[KEYCLOAK] DB user. ${JSON.stringify(dbUser)}`);

    if (dbUser) {
      activateUser = dbUser;
      await oauthService.updateUserRoles(dbUser.id, roles);
      jwtToken = await tokenService.createJwtToken(dbUser);
    } else {
      debug && strapi.log.info(`[KEYCLOAK] Roles. ${JSON.stringify(keycloakRoles)}`);

      const defaultLocale = oauthService.localeFindByHeader(ctx.request.headers);
      activateUser = await oauthService.createUser(
        userResponse.data.email,
        userResponse.data.family_name,
        userResponse.data.given_name,
        defaultLocale,
        roles,
      );
      jwtToken = await tokenService.createJwtToken(activateUser);

      // Trigger webhook
      await oauthService.triggerWebHook(activateUser);
    }
    // Login Event Call
    oauthService.triggerSignInSuccess(activateUser);

    const nonce = v4();
    const html = oauthService.renderSignUpSuccess(jwtToken, activateUser, nonce);
    ctx.set('Content-Security-Policy', `script-src 'nonce-${nonce}'`);
    ctx.send(html);
  } catch (e) {
    console.error(e);
    ctx.send(oauthService.renderSignUpError(e.message));
  }
}

module.exports = {
  keycloakSignIn,
  keycloakSignInCallback,
};
