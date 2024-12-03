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
  return async (ctx, next) => {
    console.log("Middleware auth-check ejecutándose para la ruta:", ctx.path);

    // === Manejo de /admin/logout ===
    if (ctx.path === "/admin/logout") {
      console.log(
        "Ruta /admin/logout detectada, eliminando la cookie del token..."
      );

      // Eliminar la cookie 'token' estableciendo su valor a null y expirando inmediatamente
      ctx.cookies.set("token", null, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Asegúrate de usar HTTPS en producción
        sameSite: "lax",
        maxAge: 0, // Expira la cookie inmediatamente
      });

      console.log(
        "Cookie del token eliminada, redirigiendo a /webunal-login/login"
      );

      // Redirigir al usuario a la página de login después del logout
      return ctx.redirect("/webunal-login/login");
    }
    // === Fin del Manejo de /admin/logout ===

    // === Manejo de /admin/auth/login ===
    if (ctx.path === "/admin/auth/login") {
      console.log(
        "Ruta /admin/auth/login detectada, redirigiendo a /webunal-login/login"
      );

      // Redirigir al usuario a la página de login personalizado
      return ctx.redirect("/webunal-login/login");
    }
    // === Fin del Manejo de /admin/auth/login ===

    // === Verificación de Rutas que Comienzan con /admin ===
    if (ctx.path.startsWith("/admin")) {
      console.log("Ruta /admin detectada, verificando autenticación...");

      // Obtener el token JWT desde la cookie
      const jwt = ctx.cookies.get("token");
      console.log("Token JWT obtenido de la cookie:", jwt);

      if (!jwt) {
        console.log(
          "No se encontró token JWT en la cookie, redirigiendo a /webunal-login/login"
        );
        return ctx.redirect("/webunal-login/login");
      }

      try {
        // Obtener el servicio de tokens de Strapi Admin
        const tokenService = strapi.admin.services.token;

        // Decodificar el token JWT
        const decodedToken = await tokenService.decodeJwtToken(jwt);

        console.log("Token JWT decodificado:", decodedToken);

        // Verificar validez del token y existencia del ID
        if (
          !decodedToken ||
          !decodedToken.payload ||
          typeof decodedToken.payload.id !== "number"
        ) {
          console.log(
            "Token JWT inválido o no contiene un ID de usuario válido, redirigiendo a /webunal-login/login"
          );
          return ctx.redirect("/webunal-login/login");
        }

        const userId = decodedToken.payload.id;

        // Obtener el usuario asociado al token
        const adminUser = await strapi.db.query("admin::user").findOne({
          where: { id: userId },
        });

        if (!adminUser) {
          console.log(
            "Usuario no encontrado, redirigiendo a /webunal-login/login"
          );
          return ctx.redirect("/webunal-login/login");
        }

        // Verificar si el usuario está activo
        if (!adminUser.isActive) {
          console.log("Usuario inactivo, redirigiendo a /webunal-login/login");
          return ctx.redirect("/webunal-login/login");
        }

        // Establecer el usuario en el contexto de la solicitud
        ctx.state.user = adminUser;
        console.log("Autenticación exitosa, continuando con la solicitud...");
      } catch (error) {
        console.error("Error al verificar el token:", error);
        return ctx.redirect("/webunal-login/login");
      }
    } else {
      console.log("Ruta no es /admin, continuando con la solicitud...");
    }
    await next();
  };
};
```

2. Configura el middleware en `config/middlewares.js`:

```javascript
module.exports = [
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
  //, otros middlewares...
  {
    name: "global::auth-check",

    config: {
      enabled: true,
    },
  },
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
