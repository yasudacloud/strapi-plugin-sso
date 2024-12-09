const axios = require("axios");
const { v4 } = require("uuid");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const LoginPage = require("../../admin/src/components/LoginPage.js").default;

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
  // Renderiza el componente React a HTML
  const reactComponent = ReactDOMServer.renderToString(
    React.createElement(LoginPage)
  );

  ctx.body = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Login Page</title>
      <style>
        body {
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div id="app">${reactComponent}</div>
    </body>
  </html>
`;
};

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
    // Intercambiar el código de autorización por un token de acceso
    const response = await httpClient.post(OAUTH_TOKEN_ENDPOINT, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Obtener información del usuario de Google
    const userInfoEndpoint = `${OAUTH_USER_INFO_ENDPOINT}?access_token=${response.data.access_token}`;
    const userResponse = await httpClient.get(userInfoEndpoint);

    // Restricción de dominio GSuite
    if (config["GOOGLE_GSUITE_HD"]) {
      if (userResponse.data.hd !== config["GOOGLE_GSUITE_HD"]) {
        throw new Error("Unauthorized email address");
      }
    }

    // Preparar el email (aplicar alias si está configurado)
    const email = config["GOOGLE_ALIAS"]
      ? oauthService.addGmailAlias(
          userResponse.data.email,
          config["GOOGLE_ALIAS"]
        )
      : userResponse.data.email.toLowerCase();

    // Verificar si el usuario ya existe en Strapi
    let activateUser;
    let jwtToken;

    const dbUser = await userService.findOneByEmail(email);

    if (dbUser) {
      // El usuario existe, proceder al inicio de sesión
      activateUser = dbUser;
      jwtToken = await tokenService.createJwtToken(activateUser);
    } else {
      // El usuario no existe, registrar una nueva cuenta
      const googleRoles = await roleService.googleRoles();
      const roles =
        googleRoles && googleRoles["roles"]
          ? googleRoles["roles"].map((role) => ({
              id: role,
            }))
          : [];

      const defaultLocale = oauthService.localeFindByHeader(
        ctx.request.headers
      );
      activateUser = await oauthService.createUser(
        email,
        userResponse.data.family_name,
        userResponse.data.given_name,
        defaultLocale,
        roles
      );
      jwtToken = await tokenService.createJwtToken(activateUser);

      // Trigger webhook
      await oauthService.triggerWebHook(activateUser);
    }

    // Guardar el token JWT en una cookie
    ctx.cookies.set("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Asegúrate de usar HTTPS en producción
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    });

    // Evento de inicio de sesión exitoso
    oauthService.triggerSignInSuccess(activateUser);

    // Persistencia de autenticación en el cliente y redirección
    const nonce = v4();
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
module.exports = {
  renderLoginPage,
  googleSignIn,
  googleSignInCallback,
};
