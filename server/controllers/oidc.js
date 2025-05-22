import axios from 'axios';
import {Buffer} from 'buffer';
import { randomUUID } from 'crypto';
import pkceChallenge from "pkce-challenge";

const registerAccount = async (email, locale) => {
  const roleService = strapi.plugin('strapi-plugin-sso').service('role')
  const oidcRoles = await roleService.oidcRoles()
  const roles = oidcRoles?.['roles']?.map(role => ({ id: role })) ?? []
  return oauthService.createUser(
    email,
    userResponse.data[config['OIDC_FAMILY_NAME_FIELD']],
    userResponse.data[config['OIDC_GIVEN_NAME_FIELD']],
    locale,
    roles,
  )
};

const getUserInfo = async (accessToken) => {
  const httpClient = axios.create();
  const params = new URLSearchParams();
  const headers = {};

  if (config["OIDC_USER_INFO_ENDPOINT_WITH_AUTH_HEADER"]) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  } else {
    params.append("access_token", accessToken);
  }

  return httpClient.get(
    config["OIDC_USER_INFO_ENDPOINT"],
    { headers, params },
  );
};

const configValidation = () => {
  const config = strapi.config.get('plugin::strapi-plugin-sso')
  if (config['OIDC_CLIENT_ID'] && config['OIDC_CLIENT_SECRET']
      && config['OIDC_REDIRECT_URI'] && config['OIDC_SCOPES']
      && config['OIDC_TOKEN_ENDPOINT'] && config['OIDC_USER_INFO_ENDPOINT']
      && config['OIDC_GRANT_TYPE'] && config['OIDC_FAMILY_NAME_FIELD']
      && config['OIDC_GIVEN_NAME_FIELD'] && config['OIDC_AUTHORIZATION_ENDPOINT']
      ) {
    return config
  }
  throw new Error('OIDC_AUTHORIZATION_ENDPOINT,OIDC_TOKEN_ENDPOINT, OIDC_USER_INFO_ENDPOINT,OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, OIDC_REDIRECT_URI, and OIDC_SCOPES are required')
}

const oidcGetJwt = async (ctx) => {
  let accessToken = ctx.request.header.authorization;
  const userInfo = getUserInfo(accessToken);
  const email = userInfo.data.email
  await whitelistService.checkWhitelistForEmail(email)
  const user = await userService.findOneByEmail(email)

  if (!user) {
    const defaultLocale = oauthService.localeFindByHeader(headers);
    activateUser = await registerAccount(email, defaultLocale);
  }

  return tokenService.createJwtToken(user)
};

const oidcSignIn = async (ctx) => {
  let { state } = ctx.query;
  const { OIDC_CLIENT_ID, OIDC_REDIRECT_URI, OIDC_SCOPES, OIDC_AUTHORIZATION_ENDPOINT } = configValidation();

  // Generate code verifier and code challenge
  const { code_verifier: codeVerifier, code_challenge: codeChallenge } =
    pkceChallenge();

  // Store the code verifier in the session
  ctx.session.codeVerifier = codeVerifier;

  if (!state) {
    state = crypto.getRandomValues(Buffer.alloc(32)).toString('base64url');
  }
  ctx.session.oidcState = state;

  const params = new URLSearchParams();
  params.append('response_type', 'code');
  params.append('client_id', OIDC_CLIENT_ID);
  params.append('redirect_uri', OIDC_REDIRECT_URI);
  params.append('scope', OIDC_SCOPES);
  params.append('code_challenge', codeChallenge);
  params.append('code_challenge_method', 'S256');
  params.append('state', state);
  const authorizationUrl = `${OIDC_AUTHORIZATION_ENDPOINT}?${params.toString()}`;
  ctx.set('Location', authorizationUrl);
  return ctx.send({}, 302);
};

const oidcSignInCallback = async (ctx) => {
  const config = configValidation()
  const httpClient = axios.create()
  const userService = strapi.service('admin::user')
  const tokenService = strapi.service('admin::token')
  const oauthService = strapi.plugin('strapi-plugin-sso').service('oauth')
  const whitelistService = strapi.plugin('strapi-plugin-sso').service('whitelist')

  if (!ctx.query.code) {
    return ctx.send(oauthService.renderSignUpError(`code Not Found`))
  }
  if (!ctx.query.state || ctx.query.state !== ctx.session.oidcState) {
    return ctx.send(oauthService.renderSignUpError(`Invalid state`))
  }

  const params = new URLSearchParams();
  params.append('code', ctx.query.code);
  params.append('client_id', config['OIDC_CLIENT_ID']);
  params.append('client_secret', config['OIDC_CLIENT_SECRET']);
  params.append('redirect_uri', config['OIDC_REDIRECT_URI']);
  params.append('grant_type', config['OIDC_GRANT_TYPE']);

  // Include the code verifier from the session
  params.append("code_verifier", ctx.session.codeVerifier);

  try {
    const response = await httpClient.post(config['OIDC_TOKEN_ENDPOINT'], params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    const userResponse = getUserInfo(response.data.access_token);
    const email =  userResponse.data.email

    // whitelist check
    await whitelistService.checkWhitelistForEmail(email)

    let user = await userService.findOneByEmail(email)
    let isNewUser = false

    if (!user) {
      const defaultLocale = oauthService.localeFindByHeader(headers)
      user = await registerAccount(email, defaultLocale)
      isNewUser = true
    }

    const jwtToken = await tokenService.createJwtToken(user)

    if (isNewUser) {
      await oauthService.triggerWebHook(user)
    }
    // Login Event Call
    oauthService.triggerSignInSuccess(user)

    // Client-side authentication persistence and redirection
    const nonce = randomUUID()
    const html = oauthService.renderSignUpSuccess(jwtToken, user, nonce)
    ctx.set('Content-Security-Policy', `script-src 'nonce-${nonce}'`)
    ctx.send(html);
  } catch (e) {
    console.error(e)
    ctx.send(oauthService.renderSignUpError(e.message))
  }
};

export default {
  oidcGetJwt,
  oidcSignIn,
  oidcSignInCallback,
};
