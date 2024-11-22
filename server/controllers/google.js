const axios = require("axios");
const { v4 } = require("uuid");

const configValidation = () => {
  const config = strapi.config.get("plugin.webunal-login");
  if (
    config["GOOGLE_OAUTH_CLIENT_ID"] &&
    config["GOOGLE_OAUTH_CLIENT_SECRET"]
  ) {
    return config;
  }
  throw new Error(
    "GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET are required"
  );
};

/**
 * Common constants
 */
const OAUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/auth";
const OAUTH_TOKEN_ENDPOINT = "https://accounts.google.com/o/oauth2/token";
const OAUTH_USER_INFO_ENDPOINT =
  "https://www.googleapis.com/oauth2/v1/userinfo";
const OAUTH_GRANT_TYPE = "authorization_code";
const OAUTH_RESPONSE_TYPE = "code";
const OAUTH_SCOPE =
  "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

async function renderLoginPage(ctx) {
  //Cambiar por la página real, redirigir con el botón a  /webunal-login/google.
  ctx.body = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Login Page</title>
        </head>
        <body>
          <h1>Iniciar sesión</h1>
          <!-- Usamos un enlace para la redirección -->
          <a href="/webunal-login/google" id="login-link">Iniciar sesión con Google</a>
        </body>
      </html>
    `;
}

/**
 * Redirect to Google
 * @param ctx
 * @return {Promise<*>}
 */
async function googleSignIn(ctx) {
  const config = configValidation();
  const redirectUri = encodeURIComponent(config["GOOGLE_OAUTH_REDIRECT_URI"]);
  const url = `${OAUTH_ENDPOINT}?client_id=${config["GOOGLE_OAUTH_CLIENT_ID"]}&redirect_uri=${redirectUri}&scope=${OAUTH_SCOPE}&response_type=${OAUTH_RESPONSE_TYPE}`;
  ctx.set("Location", url);
  return ctx.send({}, 302);
}

/**
 * Verify the token and if there is no account, create one and then log in
 * @param ctx
 * @return {Promise<*>}
 */
async function googleSignInCallback(ctx) {
  const config = configValidation();
  const httpClient = axios.create();
  const userService = strapi.service("admin::user");
  const tokenService = strapi.service("admin::token");
  const oauthService = strapi.plugin("webunal-login").service("oauth");
  const roleService = strapi.plugin("webunal-login").service("role");

  if (!ctx.query.code) {
    return ctx.send(oauthService.renderSignUpError(`Code not found`));
  }

  const params = new URLSearchParams();
  params.append("code", ctx.query.code);
  params.append("client_id", config["GOOGLE_OAUTH_CLIENT_ID"]);
  params.append("client_secret", config["GOOGLE_OAUTH_CLIENT_SECRET"]);
  params.append("redirect_uri", config["GOOGLE_OAUTH_REDIRECT_URI"]);
  params.append("grant_type", OAUTH_GRANT_TYPE);

  try {
    // Exchange authorization code for access token
    const response = await httpClient.post(OAUTH_TOKEN_ENDPOINT, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Fetch user info from Google
    const userInfoEndpoint = `${OAUTH_USER_INFO_ENDPOINT}?access_token=${response.data.access_token}`;
    const userResponse = await httpClient.get(userInfoEndpoint);

    // For GSuite domain restriction
    if (config["GOOGLE_GSUITE_HD"]) {
      if (userResponse.data.hd !== config["GOOGLE_GSUITE_HD"]) {
        throw new Error("Unauthorized email address");
      }
    }

    // Prepare the email (apply alias if configured)
    const email = config["GOOGLE_ALIAS"]
      ? oauthService.addGmailAlias(
          userResponse.data.email,
          config["GOOGLE_ALIAS"]
        )
      : userResponse.data.email;

    // Check if the user already exists in Strapi
    const dbUser = await userService.findOneByEmail(email);
    let activateUser;
    let jwtToken;

    if (dbUser) {
      // User exists, proceed to login
      activateUser = dbUser;
      jwtToken = await tokenService.createJwtToken(dbUser);

      // Login Event Call
      oauthService.triggerSignInSuccess(activateUser);

      // Client-side authentication persistence and redirection
      const nonce = v4();
      const html = oauthService.renderSignUpSuccess(
        jwtToken,
        activateUser,
        nonce
      );
      ctx.set("Content-Security-Policy", `script-src 'nonce-${nonce}'`);
      ctx.send(html);
    } else {
      // User does not exist, deny access
      const errorMessage =
        "User does not exist. Please contact the administrator.";
      ctx.send(oauthService.renderSignUpError(errorMessage));
    }
  } catch (e) {
    console.error(e);
    ctx.send(oauthService.renderSignUpError(e.message));
  }
}

module.exports = {
  renderLoginPage,
  googleSignIn,
  googleSignInCallback,
};
