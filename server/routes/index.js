module.exports = [
  {
    method: "GET",
    path: "/login",
    handler: "google.renderLoginPage", // Nuevo controlador para la interfaz
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/google",
    handler: "google.googleSignIn", // Mantiene la lógica de redirección a Google
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/google/callback",
    handler: "google.googleSignInCallback",
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/sso-roles",
    handler: "role.find",
  },
  {
    method: "PUT",
    path: "/sso-roles",
    handler: "role.update",
  },
];
