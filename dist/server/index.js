"use strict";
const axios = require("axios");
const buffer = require("buffer");
const node_crypto = require("node:crypto");
const pkceChallenge = require("pkce-challenge");
const strapiUtils = require("@strapi/utils");
const generator = require("generate-password");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const axios__default = /* @__PURE__ */ _interopDefault(axios);
const pkceChallenge__default = /* @__PURE__ */ _interopDefault(pkceChallenge);
const strapiUtils__default = /* @__PURE__ */ _interopDefault(strapiUtils);
const generator__default = /* @__PURE__ */ _interopDefault(generator);
const register$1 = ({ strapi: strapi2 }) => {
};
const bootstrap = async ({ strapi: strapi2 }) => {
  const actions = [
    {
      section: "plugins",
      displayName: "Read",
      uid: "read",
      pluginName: "strapi-plugin-sso"
    }
  ];
  await strapi2.admin.services.permission.actionProvider.registerMany(actions);
};
const destroy = ({ strapi: strapi2 }) => {
};
const config = {
  default: {
    REMEMBER_ME: false,
    GOOGLE_OAUTH_REDIRECT_URI: "http://localhost:1337/strapi-plugin-sso/google/callback",
    GOOGLE_GSUITE_HD: "",
    GOOGLE_ALIAS: "",
    COGNITO_OAUTH_REDIRECT_URI: "http://localhost:1337/strapi-plugin-sso/cognito/callback",
    COGNITO_OAUTH_REGION: "ap-northeast-1",
    AZUREAD_OAUTH_REDIRECT_URI: "http://localhost:1337/strapi-plugin-sso/azuread/callback",
    AZUREAD_TENANT_ID: "",
    AZUREAD_OAUTH_CLIENT_ID: "",
    AZUREAD_OAUTH_CLIENT_SECRET: "",
    AZUREAD_SCOPE: "user.read",
    OIDC_REDIRECT_URI: "http://localhost:1337/strapi-plugin-sso/oidc/callback",
    OIDC_CLIENT_ID: "",
    OIDC_CLIENT_SECRET: "",
    OIDC_SCOPES: "openid profile email",
    OIDC_AUTHORIZATION_ENDPOINT: "",
    OIDC_TOKEN_ENDPOINT: "",
    OIDC_USER_INFO_ENDPOINT: "",
    OIDC_USER_INFO_ENDPOINT_WITH_AUTH_HEADER: false,
    OIDC_GRANT_TYPE: "authorization_code",
    OIDC_FAMILY_NAME_FIELD: "family_name",
    OIDC_GIVEN_NAME_FIELD: "given_name"
  },
  validator() {
  }
};
const info$2 = {
  singularName: "roles",
  pluralName: "sso-roles",
  collectionName: "sso-roles",
  displayName: "sso-role",
  description: ""
};
const options$1 = {
  draftAndPublish: false
};
const pluginOptions$1 = {
  "content-manager": {
    visible: false
  },
  "content-type-builder": {
    visible: false
  }
};
const attributes$1 = {
  oauth_type: {
    type: "string",
    configurable: false,
    required: true
  },
  roles: {
    type: "json",
    configurable: false
  }
};
const schema$1 = {
  info: info$2,
  options: options$1,
  pluginOptions: pluginOptions$1,
  attributes: attributes$1
};
const roles = {
  schema: schema$1
};
const info$1 = {
  singularName: "whitelists",
  pluralName: "whitelists",
  collectionName: "whitelists",
  displayName: "whitelist",
  description: ""
};
const options = {
  draftAndPublish: false
};
const pluginOptions = {
  "content-manager": {
    visible: false
  },
  "content-type-builder": {
    visible: false
  }
};
const attributes = {
  email: {
    type: "string",
    configurable: false,
    required: true,
    unique: true
  }
};
const schema = {
  info: info$1,
  options,
  pluginOptions,
  attributes
};
const whitelists = {
  schema
};
const contentTypes = {
  roles,
  whitelists
};
const configValidation$3 = () => {
  const config2 = strapi.config.get("plugin::strapi-plugin-sso");
  if (config2["GOOGLE_OAUTH_CLIENT_ID"] && config2["GOOGLE_OAUTH_CLIENT_SECRET"]) {
    return config2;
  }
  throw new Error("GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET are required");
};
const OAUTH_ENDPOINT$2 = "https://accounts.google.com/o/oauth2/auth";
const OAUTH_TOKEN_ENDPOINT$2 = "https://accounts.google.com/o/oauth2/token";
const OAUTH_USER_INFO_ENDPOINT$2 = "https://www.googleapis.com/oauth2/v1/userinfo";
const OAUTH_GRANT_TYPE$2 = "authorization_code";
const OAUTH_RESPONSE_TYPE$2 = "code";
const OAUTH_SCOPE$1 = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
async function googleSignIn(ctx) {
  const config2 = configValidation$3();
  const { code_verifier: codeVerifier, code_challenge: codeChallenge } = pkceChallenge__default.default();
  ctx.session.codeVerifier = codeVerifier;
  const state = node_crypto.getRandomValues(buffer.Buffer.alloc(32)).toString("base64url");
  ctx.session.oidcState = state;
  const params = new URLSearchParams();
  params.append("client_id", config2["GOOGLE_OAUTH_CLIENT_ID"]);
  params.append("redirect_uri", config2["GOOGLE_OAUTH_REDIRECT_URI"]);
  params.append("scope", OAUTH_SCOPE$1);
  params.append("response_type", OAUTH_RESPONSE_TYPE$2);
  params.append("code_challenge", codeChallenge);
  params.append("code_challenge_method", "S256");
  params.append("state", state);
  const url = `${OAUTH_ENDPOINT$2}?${params.toString()}`;
  ctx.set("Location", url);
  return ctx.send({}, 302);
}
async function googleSignInCallback(ctx) {
  const config2 = configValidation$3();
  const httpClient = axios__default.default.create();
  const userService = strapi.service("admin::user");
  const oauthService = strapi.plugin("strapi-plugin-sso").service("oauth");
  const roleService = strapi.plugin("strapi-plugin-sso").service("role");
  const whitelistService = strapi.plugin("strapi-plugin-sso").service("whitelist");
  if (!ctx.query.code) {
    return ctx.send(oauthService.renderSignUpError(`code Not Found`));
  }
  if (!ctx.query.state || ctx.query.state !== ctx.session.oidcState) {
    return ctx.send(oauthService.renderSignUpError(`Invalid state`));
  }
  const params = new URLSearchParams();
  params.append("code", ctx.query.code);
  params.append("client_id", config2["GOOGLE_OAUTH_CLIENT_ID"]);
  params.append("client_secret", config2["GOOGLE_OAUTH_CLIENT_SECRET"]);
  params.append("redirect_uri", config2["GOOGLE_OAUTH_REDIRECT_URI"]);
  params.append("grant_type", OAUTH_GRANT_TYPE$2);
  params.append("code_verifier", ctx.session.codeVerifier);
  try {
    const response = await httpClient.post(OAUTH_TOKEN_ENDPOINT$2, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    const userInfoEndpoint = `${OAUTH_USER_INFO_ENDPOINT$2}?access_token=${response.data.access_token}`;
    const userResponse = await httpClient.get(userInfoEndpoint);
    if (config2["GOOGLE_GSUITE_HD"]) {
      if (userResponse.data.hd !== config2["GOOGLE_GSUITE_HD"]) {
        throw new Error("Unauthorized email address");
      }
    }
    const email = config2["GOOGLE_ALIAS"] ? oauthService.addGmailAlias(userResponse.data.email, config2["GOOGLE_ALIAS"]) : userResponse.data.email;
    await whitelistService.checkWhitelistForEmail(email);
    const dbUser = await userService.findOneByEmail(email);
    let activateUser;
    let jwtToken;
    if (dbUser) {
      activateUser = dbUser;
      jwtToken = await oauthService.generateToken(dbUser, ctx);
    } else {
      const googleRoles = await roleService.googleRoles();
      const roles2 = googleRoles && googleRoles["roles"] ? googleRoles["roles"].map((role2) => ({
        id: role2
      })) : [];
      const defaultLocale = oauthService.localeFindByHeader(ctx.request.headers);
      activateUser = await oauthService.createUser(
        email,
        userResponse.data.family_name,
        userResponse.data.given_name,
        defaultLocale,
        roles2
      );
      jwtToken = await oauthService.generateToken(activateUser, ctx);
      await oauthService.triggerWebHook(activateUser);
    }
    oauthService.triggerSignInSuccess(activateUser);
    const nonce = node_crypto.randomUUID();
    const html = oauthService.renderSignUpSuccess(jwtToken, activateUser, nonce);
    ctx.set("Content-Security-Policy", `script-src 'nonce-${nonce}'`);
    ctx.send(html);
  } catch (e) {
    console.error(e);
    ctx.send(oauthService.renderSignUpError(e.message));
  }
}
const google = {
  googleSignIn,
  googleSignInCallback
};
const configValidation$2 = () => {
  const config2 = strapi.config.get("plugin::strapi-plugin-sso");
  if (config2["COGNITO_OAUTH_CLIENT_ID"] && config2["COGNITO_OAUTH_CLIENT_SECRET"] && config2["COGNITO_OAUTH_DOMAIN"]) {
    return config2;
  }
  throw new Error("COGNITO_OAUTH_CLIENT_ID, COGNITO_OAUTH_CLIENT_SECRET AND COGNITO_OAUTH_DOMAIN are required");
};
const OAUTH_ENDPOINT$1 = (domain, region) => {
  return `https://${domain}.auth.${region}.amazoncognito.com/oauth2/authorize`;
};
const OAUTH_TOKEN_ENDPOINT$1 = (domain, region) => {
  return `https://${domain}.auth.${region}.amazoncognito.com/oauth2/token`;
};
const OAUTH_USER_INFO_ENDPOINT$1 = (domain, region) => {
  return `https://${domain}.auth.${region}.amazoncognito.com/oauth2/userInfo`;
};
const OAUTH_GRANT_TYPE$1 = "authorization_code";
const OAUTH_SCOPE = "openid email profile";
const OAUTH_RESPONSE_TYPE$1 = "code";
async function cognitoSignIn(ctx) {
  const config2 = configValidation$2();
  const endpoint = OAUTH_ENDPOINT$1(config2["COGNITO_OAUTH_DOMAIN"], config2["COGNITO_OAUTH_REGION"]);
  const { code_verifier: codeVerifier, code_challenge: codeChallenge } = pkceChallenge__default.default();
  ctx.session.codeVerifier = codeVerifier;
  const state = node_crypto.getRandomValues(buffer.Buffer.alloc(32)).toString("base64url");
  ctx.session.oidcState = state;
  const params = new URLSearchParams();
  params.append("client_id", config2["COGNITO_OAUTH_CLIENT_ID"]);
  params.append("redirect_uri", config2["COGNITO_OAUTH_REDIRECT_URI"]);
  params.append("scope", OAUTH_SCOPE);
  params.append("response_type", OAUTH_RESPONSE_TYPE$1);
  params.append("code_challenge", codeChallenge);
  params.append("code_challenge_method", "S256");
  params.append("state", state);
  const url = `${endpoint}?${params.toString()}`;
  ctx.set("Location", url);
  return ctx.send({}, 302);
}
async function cognitoSignInCallback(ctx) {
  const config2 = configValidation$2();
  const userService = strapi.service("admin::user");
  const oauthService = strapi.plugin("strapi-plugin-sso").service("oauth");
  const roleService = strapi.plugin("strapi-plugin-sso").service("role");
  const whitelistService = strapi.plugin("strapi-plugin-sso").service("whitelist");
  if (!ctx.query.code) {
    return ctx.send(oauthService.renderSignUpError(`code Not Found`));
  }
  if (!ctx.query.state || ctx.query.state !== ctx.session.oidcState) {
    return ctx.send(oauthService.renderSignUpError(`Invalid state`));
  }
  const params = new URLSearchParams();
  params.append("code", ctx.query.code);
  params.append("client_id", config2["COGNITO_OAUTH_CLIENT_ID"]);
  params.append("client_secret", config2["COGNITO_OAUTH_CLIENT_SECRET"]);
  params.append("redirect_uri", config2["COGNITO_OAUTH_REDIRECT_URI"]);
  params.append("grant_type", OAUTH_GRANT_TYPE$1);
  params.append("code_verifier", ctx.session.codeVerifier);
  try {
    const tokenEndpoint = OAUTH_TOKEN_ENDPOINT$1(config2["COGNITO_OAUTH_DOMAIN"], config2["COGNITO_OAUTH_REGION"]);
    const userInfoEndpoint = OAUTH_USER_INFO_ENDPOINT$1(config2["COGNITO_OAUTH_DOMAIN"], config2["COGNITO_OAUTH_REGION"]);
    const response = await axios__default.default.post(tokenEndpoint, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    const userResponse = await axios__default.default.get(userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`
      }
    });
    if (userResponse.data.email_verified !== "true") {
      throw new Error("Your email address has not been verified.");
    }
    const userGroup = config2["COGNITO_USER_GROUP"];
    if (userGroup) {
      const claims = JSON.parse(buffer.Buffer.from(response.data.access_token.split(".")[1], "base64").toString());
      if ((claims["cognito:groups"] || []).includes(userGroup) === false) {
        throw new Error("You do not belong to the specified user group.");
      }
    }
    await whitelistService.checkWhitelistForEmail(userResponse.data.email);
    const dbUser = await userService.findOneByEmail(userResponse.data.email);
    let activateUser;
    let jwtToken;
    if (dbUser) {
      activateUser = dbUser;
      jwtToken = await oauthService.generateToken(dbUser, ctx);
    } else {
      const cognitoRoles = await roleService.cognitoRoles();
      const roles2 = cognitoRoles && cognitoRoles["roles"] ? cognitoRoles["roles"].map((role2) => ({
        id: role2
      })) : [];
      const defaultLocale = oauthService.localeFindByHeader(ctx.request.headers);
      activateUser = await oauthService.createUser(
        userResponse.data.email,
        "",
        userResponse.data.username,
        defaultLocale,
        roles2
      );
      jwtToken = await oauthService.generateToken(activateUser, ctx);
      await oauthService.triggerWebHook(activateUser);
    }
    oauthService.triggerSignInSuccess(activateUser);
    const nonce = node_crypto.randomUUID();
    const html = oauthService.renderSignUpSuccess(jwtToken, activateUser, nonce);
    ctx.set("Content-Security-Policy", `script-src 'nonce-${nonce}'`);
    ctx.send(html);
  } catch (e) {
    console.error(e);
    ctx.send(oauthService.renderSignUpError(e.message));
  }
}
const cognito = {
  cognitoSignIn,
  cognitoSignInCallback
};
const configValidation$1 = () => {
  const config2 = strapi.config.get("plugin::strapi-plugin-sso");
  if (config2["AZUREAD_OAUTH_CLIENT_ID"] && config2["AZUREAD_OAUTH_CLIENT_SECRET"] && config2["AZUREAD_TENANT_ID"]) {
    return config2;
  }
  throw new Error(
    "AZUREAD_OAUTH_CLIENT_ID, AZUREAD_OAUTH_CLIENT_SECRET, and AZUREAD_TENANT_ID are required"
  );
};
const OAUTH_ENDPOINT = (tenantId) => `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
const OAUTH_TOKEN_ENDPOINT = (tenantId) => `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
const OAUTH_USER_INFO_ENDPOINT = "https://graph.microsoft.com/oidc/userinfo";
const OAUTH_GRANT_TYPE = "authorization_code";
const OAUTH_RESPONSE_TYPE = "code";
async function azureAdSignIn(ctx) {
  const config2 = configValidation$1();
  const endpoint = OAUTH_ENDPOINT(config2["AZUREAD_TENANT_ID"]);
  const { code_verifier: codeVerifier, code_challenge: codeChallenge } = pkceChallenge__default.default();
  ctx.session.codeVerifier = codeVerifier;
  const state = node_crypto.getRandomValues(buffer.Buffer.alloc(32)).toString("base64url");
  ctx.session.oidcState = state;
  const params = new URLSearchParams();
  params.append("client_id", config2["AZUREAD_OAUTH_CLIENT_ID"]);
  params.append("redirect_uri", config2["AZUREAD_OAUTH_REDIRECT_URI"]);
  params.append("scope", config2["AZUREAD_SCOPE"]);
  params.append("response_type", OAUTH_RESPONSE_TYPE);
  params.append("code_challenge", codeChallenge);
  params.append("code_challenge_method", "S256");
  params.append("state", state);
  const url = `${endpoint}?${params.toString()}`;
  ctx.set("Location", url);
  return ctx.send({}, 302);
}
async function azureAdSignInCallback(ctx) {
  const config2 = configValidation$1();
  const userService = strapi.service("admin::user");
  const oauthService = strapi.plugin("strapi-plugin-sso").service("oauth");
  const roleService = strapi.plugin("strapi-plugin-sso").service("role");
  const whitelistService = strapi.plugin("strapi-plugin-sso").service("whitelist");
  if (!ctx.query.code) {
    return ctx.send(oauthService.renderSignUpError(`code Not Found`));
  }
  if (!ctx.query.state || ctx.query.state !== ctx.session.oidcState) {
    return ctx.send(oauthService.renderSignUpError(`Invalid state`));
  }
  const params = new URLSearchParams();
  params.append("code", ctx.query.code);
  params.append("client_id", config2["AZUREAD_OAUTH_CLIENT_ID"]);
  params.append("client_secret", config2["AZUREAD_OAUTH_CLIENT_SECRET"]);
  params.append("redirect_uri", config2["AZUREAD_OAUTH_REDIRECT_URI"]);
  params.append("grant_type", OAUTH_GRANT_TYPE);
  params.append("code_verifier", ctx.session.codeVerifier);
  try {
    const tokenEndpoint = OAUTH_TOKEN_ENDPOINT(config2["AZUREAD_TENANT_ID"]);
    const response = await axios__default.default.post(tokenEndpoint, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    const userResponse = await axios__default.default.get(OAUTH_USER_INFO_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`
      }
    });
    if (!userResponse.data.email) {
      throw new Error("Email address is not set. Please set email property to the Azure AD user.");
    }
    await whitelistService.checkWhitelistForEmail(userResponse.data.email);
    const dbUser = await userService.findOneByEmail(userResponse.data.email);
    let activateUser;
    let jwtToken;
    if (dbUser) {
      activateUser = dbUser;
      jwtToken = await oauthService.generateToken(dbUser, ctx);
    } else {
      const azureAdRoles = await roleService.azureAdRoles();
      const roles2 = azureAdRoles && azureAdRoles["roles"] ? azureAdRoles["roles"].map((role2) => ({
        id: role2
      })) : [];
      const defaultLocale = oauthService.localeFindByHeader(
        ctx.request.headers
      );
      activateUser = await oauthService.createUser(
        userResponse.data.email,
        userResponse.data.family_name,
        userResponse.data.given_name,
        defaultLocale,
        roles2
      );
      jwtToken = await oauthService.generateToken(activateUser, ctx);
      await oauthService.triggerWebHook(activateUser);
    }
    oauthService.triggerSignInSuccess(activateUser);
    const nonce = node_crypto.randomUUID();
    const html = oauthService.renderSignUpSuccess(
      jwtToken,
      activateUser,
      nonce
    );
    ctx.set("Content-Security-Policy", `script-src 'nonce-${nonce}'`);
    ctx.send(html);
  } catch (e) {
    console.error(e);
    ctx.send(oauthService.renderSignUpError(e.message));
  }
}
const azuread = {
  azureAdSignIn,
  azureAdSignInCallback
};
const configValidation = () => {
  const config2 = strapi.config.get("plugin::strapi-plugin-sso");
  if (config2["OIDC_CLIENT_ID"] && config2["OIDC_CLIENT_SECRET"] && config2["OIDC_REDIRECT_URI"] && config2["OIDC_SCOPES"] && config2["OIDC_TOKEN_ENDPOINT"] && config2["OIDC_USER_INFO_ENDPOINT"] && config2["OIDC_GRANT_TYPE"] && config2["OIDC_FAMILY_NAME_FIELD"] && config2["OIDC_GIVEN_NAME_FIELD"] && config2["OIDC_AUTHORIZATION_ENDPOINT"]) {
    return config2;
  }
  throw new Error("OIDC_AUTHORIZATION_ENDPOINT,OIDC_TOKEN_ENDPOINT, OIDC_USER_INFO_ENDPOINT,OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, OIDC_REDIRECT_URI, and OIDC_SCOPES are required");
};
const oidcSignIn = async (ctx) => {
  let { state } = ctx.query;
  const { OIDC_CLIENT_ID, OIDC_REDIRECT_URI, OIDC_SCOPES, OIDC_AUTHORIZATION_ENDPOINT } = configValidation();
  const { code_verifier: codeVerifier, code_challenge: codeChallenge } = pkceChallenge__default.default();
  ctx.session.codeVerifier = codeVerifier;
  if (!state) {
    state = node_crypto.getRandomValues(buffer.Buffer.alloc(32)).toString("base64url");
  }
  ctx.session.oidcState = state;
  const params = new URLSearchParams();
  params.append("response_type", "code");
  params.append("client_id", OIDC_CLIENT_ID);
  params.append("redirect_uri", OIDC_REDIRECT_URI);
  params.append("scope", OIDC_SCOPES);
  params.append("code_challenge", codeChallenge);
  params.append("code_challenge_method", "S256");
  params.append("state", state);
  const authorizationUrl = `${OIDC_AUTHORIZATION_ENDPOINT}?${params.toString()}`;
  ctx.set("Location", authorizationUrl);
  return ctx.send({}, 302);
};
const oidcSignInCallback = async (ctx) => {
  const config2 = configValidation();
  const httpClient = axios__default.default.create();
  const userService = strapi.service("admin::user");
  const oauthService = strapi.plugin("strapi-plugin-sso").service("oauth");
  const roleService = strapi.plugin("strapi-plugin-sso").service("role");
  const whitelistService = strapi.plugin("strapi-plugin-sso").service("whitelist");
  if (!ctx.query.code) {
    return ctx.send(oauthService.renderSignUpError(`code Not Found`));
  }
  if (!ctx.query.state || ctx.query.state !== ctx.session.oidcState) {
    return ctx.send(oauthService.renderSignUpError(`Invalid state`));
  }
  const params = new URLSearchParams();
  params.append("code", ctx.query.code);
  params.append("client_id", config2["OIDC_CLIENT_ID"]);
  params.append("client_secret", config2["OIDC_CLIENT_SECRET"]);
  params.append("redirect_uri", config2["OIDC_REDIRECT_URI"]);
  params.append("grant_type", config2["OIDC_GRANT_TYPE"]);
  params.append("code_verifier", ctx.session.codeVerifier);
  try {
    const response = await httpClient.post(config2["OIDC_TOKEN_ENDPOINT"], params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    let userInfoEndpointHeaders = {};
    let userInfoEndpointParameters = `?access_token=${response.data.access_token}`;
    if (config2["OIDC_USER_INFO_ENDPOINT_WITH_AUTH_HEADER"]) {
      userInfoEndpointHeaders = {
        headers: { Authorization: `Bearer ${response.data.access_token}` }
      };
      userInfoEndpointParameters = "";
    }
    const userInfoEndpoint = `${config2["OIDC_USER_INFO_ENDPOINT"]}${userInfoEndpointParameters}`;
    const userResponse = await httpClient.get(
      userInfoEndpoint,
      userInfoEndpointHeaders
    );
    const email = userResponse.data.email;
    await whitelistService.checkWhitelistForEmail(email);
    const dbUser = await userService.findOneByEmail(email);
    let activateUser;
    let jwtToken;
    if (dbUser) {
      activateUser = dbUser;
      jwtToken = await oauthService.generateToken(dbUser, ctx);
    } else {
      const oidcRoles = await roleService.oidcRoles();
      const roles2 = oidcRoles && oidcRoles["roles"] ? oidcRoles["roles"].map((role2) => ({
        id: role2
      })) : [];
      const defaultLocale = oauthService.localeFindByHeader(ctx.request.headers);
      activateUser = await oauthService.createUser(
        email,
        userResponse.data[config2["OIDC_FAMILY_NAME_FIELD"]],
        userResponse.data[config2["OIDC_GIVEN_NAME_FIELD"]],
        defaultLocale,
        roles2
      );
      jwtToken = await oauthService.generateToken(activateUser, ctx);
      await oauthService.triggerWebHook(activateUser);
    }
    oauthService.triggerSignInSuccess(activateUser);
    const nonce = node_crypto.randomUUID();
    const html = oauthService.renderSignUpSuccess(jwtToken, activateUser, nonce);
    ctx.set("Content-Security-Policy", `script-src 'nonce-${nonce}'`);
    ctx.send(html);
  } catch (e) {
    console.error(e);
    ctx.send(oauthService.renderSignUpError(e.message));
  }
};
const oidc = {
  oidcSignIn,
  oidcSignInCallback
};
async function find(ctx) {
  const roleService = strapi.plugin("strapi-plugin-sso").service("role");
  const roles2 = await roleService.find();
  const ssoConstants = roleService.ssoRoles();
  for (const sso of ssoConstants) {
    for (const role2 of roles2) {
      if (role2["oauth_type"] === sso["oauth_type"]) {
        sso["role"] = role2["roles"];
      }
    }
  }
  ctx.send(ssoConstants);
}
async function update(ctx) {
  try {
    const { roles: roles2 } = ctx.request.body;
    const roleService = strapi.plugin("strapi-plugin-sso").service("role");
    await roleService.update(roles2);
    ctx.send({}, 204);
  } catch (e) {
    console.log(e);
    ctx.send({}, 400);
  }
}
const role$1 = {
  find,
  update
};
async function info(ctx) {
  const config2 = strapi.config.get("plugin::strapi-plugin-sso");
  const useWhitelist = config2["USE_WHITELIST"] === true;
  let whitelistUsers = [];
  const whitelistService = strapi.plugin("strapi-plugin-sso").service("whitelist");
  whitelistUsers = await whitelistService.getUsers();
  ctx.body = {
    useWhitelist,
    whitelistUsers
  };
}
async function register(ctx) {
  const { email } = ctx.request.body;
  if (!email) {
    ctx.body = {
      message: "Please enter a valid email address"
    };
  }
  const whitelistService = strapi.plugin("strapi-plugin-sso").service("whitelist");
  await whitelistService.registerUser(email);
  ctx.body = {};
}
async function removeEmail(ctx) {
  const { id } = ctx.params;
  const whitelistService = strapi.plugin("strapi-plugin-sso").service("whitelist");
  await whitelistService.removeUser(id);
  ctx.body = {};
}
const whitelist$1 = {
  info,
  register,
  removeEmail
};
const controllers = {
  google,
  cognito,
  azuread,
  oidc,
  role: role$1,
  whitelist: whitelist$1
};
const routes = [
  {
    method: "GET",
    path: "/google",
    handler: "google.googleSignIn",
    config: {
      auth: false
    }
  },
  {
    method: "GET",
    path: "/google/callback",
    handler: "google.googleSignInCallback",
    config: {
      auth: false
    }
  },
  {
    method: "GET",
    path: "/cognito",
    handler: "cognito.cognitoSignIn",
    config: {
      auth: false
    }
  },
  {
    method: "GET",
    path: "/cognito/callback",
    handler: "cognito.cognitoSignInCallback",
    config: {
      auth: false
    }
  },
  {
    method: "GET",
    path: "/azuread",
    handler: "azuread.azureAdSignIn",
    config: {
      auth: false
    }
  },
  {
    method: "GET",
    path: "/azuread/callback",
    handler: "azuread.azureAdSignInCallback",
    config: {
      auth: false
    }
  },
  {
    method: "GET",
    path: "/sso-roles",
    handler: "role.find"
  },
  {
    method: "PUT",
    path: "/sso-roles",
    handler: "role.update"
  },
  {
    method: "GET",
    path: "/oidc",
    handler: "oidc.oidcSignIn",
    config: {
      auth: false
    }
  },
  {
    method: "GET",
    path: "/oidc/callback",
    handler: "oidc.oidcSignInCallback",
    config: {
      auth: false
    }
  },
  {
    method: "GET",
    path: "/whitelist",
    handler: "whitelist.info"
  },
  {
    method: "POST",
    path: "/whitelist",
    handler: "whitelist.register"
  },
  {
    method: "DELETE",
    path: "/whitelist/:id",
    handler: "whitelist.removeEmail"
  }
];
const policies = {};
const oauth = ({ strapi: strapi2 }) => ({
  async createUser(email, lastname, firstname, locale, roles2 = []) {
    const userService = strapi2.service("admin::user");
    if (/[A-Z]/.test(email)) {
      const dbUser = await userService.findOneByEmail(email.toLocaleLowerCase());
      if (dbUser) {
        return dbUser;
      }
    }
    const createdUser = await userService.create({
      firstname: firstname ? firstname : "unset",
      lastname: lastname ? lastname : "",
      email: email.toLocaleLowerCase(),
      roles: roles2,
      preferedLanguage: locale
    });
    return await userService.register({
      registrationToken: createdUser.registrationToken,
      userInfo: {
        firstname: firstname ? firstname : "unset",
        lastname: lastname ? lastname : "user",
        password: generator__default.default.generate({
          length: 43,
          // 256 bits (https://en.wikipedia.org/wiki/Password_strength#Random_passwords)
          numbers: true,
          lowercase: true,
          uppercase: true,
          exclude: '()+_-=}{[]|:;"/?.><,`~',
          strict: true
        })
      }
    });
  },
  addGmailAlias(baseEmail, baseAlias) {
    if (!baseAlias) {
      return baseEmail;
    }
    const alias = baseAlias.replace("/+/g", "");
    const beforePosition = baseEmail.indexOf("@");
    const origin = baseEmail.substring(0, beforePosition);
    const domain = baseEmail.substring(beforePosition);
    return `${origin}+${alias}${domain}`;
  },
  localeFindByHeader(headers) {
    if (headers["accept-language"] && headers["accept-language"].includes("ja")) {
      return "ja";
    } else {
      return "en";
    }
  },
  async triggerWebHook(user) {
    let ENTRY_CREATE;
    const webhookStore = strapi2.serviceMap.get("webhookStore");
    const eventHub = strapi2.serviceMap.get("eventHub");
    if (webhookStore) {
      ENTRY_CREATE = webhookStore.allowedEvents.get("ENTRY_CREATE");
    }
    const modelDef = strapi2.getModel("admin::user");
    const sanitizedEntity = await strapiUtils__default.default.sanitize.sanitizers.defaultSanitizeOutput({
      schema: modelDef,
      getModel: (uid2) => strapi2.getModel(uid2)
    }, user);
    eventHub.emit(ENTRY_CREATE, {
      model: modelDef.modelName,
      entry: sanitizedEntity
    });
  },
  triggerSignInSuccess(user) {
    delete user["password"];
    const eventHub = strapi2.serviceMap.get("eventHub");
    eventHub.emit("admin.auth.success", {
      user,
      provider: "strapi-plugin-sso"
    });
  },
  // Sign In Success
  renderSignUpSuccess(jwtToken, user, nonce) {
    const config2 = strapi2.config.get("plugin::strapi-plugin-sso");
    const REMEMBER_ME = config2["REMEMBER_ME"];
    const isRememberMe = !!REMEMBER_ME;
    return `
<!doctype html>
<html>
<head>
<noscript>
<h3>JavaScript must be enabled for authentication</h3>
</noscript>
<script nonce="${nonce}">
 window.addEventListener('load', function() {
  if(${isRememberMe}){
    localStorage.setItem('jwtToken', '"${jwtToken}"');
  }else{
    document.cookie = 'jwtToken=${encodeURIComponent(jwtToken)}; Path=/';
  }
  localStorage.setItem('isLoggedIn', 'true');
  location.href = '${strapi2.config.admin.url}'
 })
<\/script>
</head>
<body>
</body>
</html>`;
  },
  // Sign In Error
  renderSignUpError(message) {
    return `
<!doctype html>
<html>
<head></head>
<body>
<h3>Authentication failed</h3>
<p>${message}</p>
</body>
</html>`;
  },
  async generateToken(user, ctx) {
    const sessionManager = strapi2.sessionManager;
    if (!sessionManager) {
      throw new Error("sessionManager is not supported. Please upgrade to Strapi v5.24.1 or later.");
    }
    const userId = String(user.id);
    const deviceId = node_crypto.randomUUID();
    const config2 = strapi2.config.get("plugin::strapi-plugin-sso");
    const REMEMBER_ME = config2["REMEMBER_ME"];
    const rememberMe = !!REMEMBER_ME;
    const { token: refreshToken } = await sessionManager(
      "admin"
    ).generateRefreshToken(userId, deviceId, {
      type: rememberMe ? "refresh" : "session"
    });
    const cookieOptions = {};
    ctx.cookies.set("strapi_admin_refresh", refreshToken, cookieOptions);
    const accessResult = await sessionManager("admin").generateAccessToken(refreshToken);
    if ("error" in accessResult) {
      throw new Error(accessResult.error);
    }
    const { token: accessToken } = accessResult;
    return accessToken;
  }
});
const role = ({ strapi: strapi2 }) => ({
  SSO_TYPE_GOOGLE: "1",
  SSO_TYPE_COGNITO: "2",
  SSO_TYPE_AZUREAD: "3",
  SSO_TYPE_OIDC: "4",
  ssoRoles() {
    return [
      {
        "oauth_type": this.SSO_TYPE_GOOGLE,
        name: "Google"
      },
      {
        "oauth_type": this.SSO_TYPE_COGNITO,
        name: "Cognito"
      },
      {
        "oauth_type": this.SSO_TYPE_AZUREAD,
        name: "AzureAD"
      },
      {
        "oauth_type": this.SSO_TYPE_OIDC,
        name: "OIDC"
      }
    ];
  },
  async googleRoles() {
    return await strapi2.query("plugin::strapi-plugin-sso.roles").findOne({
      where: {
        "oauth_type": this.SSO_TYPE_GOOGLE
      }
    });
  },
  async cognitoRoles() {
    return await strapi2.query("plugin::strapi-plugin-sso.roles").findOne({
      where: {
        "oauth_type": this.SSO_TYPE_COGNITO
      }
    });
  },
  async azureAdRoles() {
    return await strapi2.query("plugin::strapi-plugin-sso.roles").findOne({
      where: {
        oauth_type: this.SSO_TYPE_AZUREAD
      }
    });
  },
  async oidcRoles() {
    return await strapi2.query("plugin::strapi-plugin-sso.roles").findOne({
      where: {
        "oauth_type": this.SSO_TYPE_OIDC
      }
    });
  },
  async find() {
    return await strapi2.query("plugin::strapi-plugin-sso.roles").findMany();
  },
  async update(roles2) {
    const query = strapi2.query("plugin::strapi-plugin-sso.roles");
    await Promise.all(
      roles2.map((role2) => {
        return query.findOne({ where: { "oauth_type": role2["oauth_type"] } }).then((ssoRole) => {
          if (ssoRole) {
            query.update({
              where: { "oauth_type": role2["oauth_type"] },
              data: { roles: role2.role }
            });
          } else {
            query.create({
              data: {
                "oauth_type": role2["oauth_type"],
                roles: role2.role
              }
            });
          }
        });
      })
    );
  }
});
const whitelist = ({ strapi: strapi2 }) => ({
  async getUsers() {
    const query = strapi2.query("plugin::strapi-plugin-sso.whitelists");
    return await query.findMany();
  },
  async registerUser(email) {
    const query = strapi2.query("plugin::strapi-plugin-sso.whitelists");
    await query.create({
      data: {
        email: email.toLowerCase()
      }
    });
  },
  async removeUser(id) {
    const query = strapi2.query("plugin::strapi-plugin-sso.whitelists");
    await query.delete({
      where: {
        id
      }
    });
  },
  async checkWhitelistForEmail(email) {
    const config2 = strapi2.config.get("plugin::strapi-plugin-sso");
    const useWhitelist = config2["USE_WHITELIST"] === true;
    if (!useWhitelist) {
      return;
    }
    const query = strapi2.query("plugin::strapi-plugin-sso.whitelists");
    const result = await query.findOne({
      where: {
        email: email.toLowerCase()
      }
    });
    if (result === null) {
      throw new Error("Not present in whitelist");
    }
  }
});
const services = {
  oauth,
  role,
  whitelist
};
const index = {
  register: register$1,
  bootstrap,
  destroy,
  config,
  controllers,
  routes,
  services,
  contentTypes,
  policies
};
module.exports = index;
