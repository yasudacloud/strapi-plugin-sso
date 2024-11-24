<div align="center">
 <img src="https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/strapi-plugin-sso.png?raw=true" width="180"/>
</div>

# Strapi Plugin: webunal-login

Este plugin es un fork del plugin original desarrollado por [yasudacloud](https://github.com/yasudacloud/strapi-plugin-sso). Está adaptado para la Universidad Nacional y desarrollado por el Lab101. Este plugin permite el inicio de sesión único (SSO) a través de Google y solo permite el acceso a usuarios con la extensión de correo `@unal.edu.co`.

## Instalación

Para instalar el plugin, debes clonar este repositorio en la carpeta de plugins de tu proyecto Strapi y renombrarlo a `webunal-login`:

```shell
git clone git@github.com:NivekTakedown/strapi-plugin-sso.git ./src/plugins/webunal-login
```

## Configuración

### 1. Configuración del Plugin

En el archivo `config/plugins.js` de tu proyecto Strapi, agrega la siguiente configuración:

```js
module.exports = ({ env }) => ({
  "webunal-login": {
    enabled: true,
    resolve: "./src/plugins/webunal-login",
    config: {
      REMEMBER_ME: false,
      GOOGLE_OAUTH_CLIENT_ID: "your-google-oauth-client-id",
      GOOGLE_OAUTH_CLIENT_SECRET: "your-google-oauth-client-secret",
      GOOGLE_OAUTH_REDIRECT_URI: "http://localhost:1337/webunal-login/google/callback",
      GOOGLE_ALIAS: "", // Opcional: Alias de Gmail
      GOOGLE_GSUITE_HD: "unal.edu.co", // Dominio principal de G Suite
      DOMAIN_NAME: "http://localhost:1337",
    },
  },
  // Otros plugins...
});
```

### 2. Configuración del Middleware de Autenticación

Para implementar la redirección automática al login y proteger las rutas, sigue estos pasos:

1. Crea el archivo de middleware en `src/middlewares/auth-check.js`:

```javascript
"use strict";

module.exports = (config, { strapi }) => {
  // Rutas que necesitan ser redirigidas a nuestro login personalizado
  const authRoutes = ["/admin/auth/login"];

  // Rutas que deben ser excluidas de la redirección
  const excludedRoutes = [
    "/webunal-login/login",
    "/webunal-login/google",
    "/webunal-login/google/callback",
    "/api",
    "/api/auth",
    "/api/connect",
  ];

  return async (ctx, next) => {
    // Guardar el método original de redirección
    const originalRedirect = ctx.redirect;

    // Sobrescribir el método de redirección
    ctx.redirect = function (url) {
      // Si Strapi intenta redirigir a /admin/auth/login, redirigimos a nuestro login
      if (url === "/admin/auth/login") {
        return originalRedirect.call(this, "/webunal-login/login");
      }
      // Para otras redirecciones, usar el comportamiento normal
      return originalRedirect.apply(this, arguments);
    };

    // Verificar si la ruta actual está en las rutas excluidas
    const isExcludedRoute = excludedRoutes.some((route) =>
      ctx.path.startsWith(route)
    );

    if (isExcludedRoute) {
      return next();
    }

    // Verificar si la ruta actual necesita redirección
    const needsRedirect =
      authRoutes.includes(ctx.path) || ctx.path.startsWith("/admin/auth/");

    if (needsRedirect) {
      try {
        // Obtener el token de las diferentes fuentes posibles
        const token =
          ctx.cookies.get("jwtToken")?.replace(/^"|"$/g, "") ||
          ctx.request.header.authorization?.replace("Bearer ", "") ||
          ctx.query.token;

        if (!token) {
          return ctx.redirect("/webunal-login/login");
        }

        try {
          // Validar el token
          const isValid = await strapi.admin.services.token.validate(token);
          if (isValid) {
            // Si el token es válido y estamos en una ruta de login,
            // redirigir al panel de administración
            if (ctx.path === "/admin/auth/login" || ctx.path === "/login") {
              return ctx.redirect("/admin");
            }
            // Para otras rutas con token válido, continuar normalmente
            return next();
          }
        } catch (err) {
          // Si el token no es válido
          return ctx.redirect("/webunal-login/login");
        }
      } catch (err) {
        console.error("Auth middleware error:", err);
        return ctx.redirect("/webunal-login/login");
      }
    }

    await next();

    // Verificar si la respuesta es una redirección a /admin/auth/login
    if (
      ctx.status === 302 &&
      ctx.response.header.location === "/admin/auth/login"
    ) {
      ctx.redirect("/webunal-login/login");
    }
  };
};


```

2. Configura el middleware en `config/middlewares.js`:

```javascript
module.exports = [
  {
    name: 'global::auth-check',
    config: {
      enabled: true,
    },
  },
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### Funcionalidades del Middleware

- Redirección automática del panel de inicio de sesion (`/admin/auth/login`) al login
- Protección de rutas no públicas
- Verificación de tokens JWT
- Manejo diferenciado de solicitudes API y web
- Configuración flexible de rutas públicas y protegidas

## Uso

El plugin funcionará automáticamente después de la configuración. Las redirecciones principales son:

- `http://localhost:1337` → `http://localhost:1337/webunal-login/login`
- `http://localhost:1337/admin` → `http://localhost:1337/webunal-login/login`

Para iniciar sesión manualmente, visita:
```
http://localhost:1337/webunal-login/google
```

## Requisitos

- NodeJS >=16.0.0 <21.0.0
- Strapi 4.1.7 o superior

## Documentación

### Documentación en Inglés

- [Google Single Sign On Setup](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/en/google/setup.md)
- [Google Single Sign On Specifications](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/en/google/admin.md)

### Documentación en Japonés

- [Descripción](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/README.md)
- [Google Single Sign On Setup](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/ja/google/setup.md)
- [Google Single Sign-On Specifications](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/ja/google/admin.md)

## Demo

![CognitoDemo](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/demo.gif?raw=true "DemoMovie")
