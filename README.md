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
'use strict';

module.exports = (config, { strapi }) => {
  const getLoginUrl = () => '/webunal-login/login';

  return async (ctx, next) => {
    // Rutas que siempre deben redirigir al login del plugin
    const redirectPaths = ['/', '/admin'];
    
    // Rutas públicas
    const publicPaths = [
      '/webunal-login/login',
      '/webunal-login/google',
      '/webunal-login/google/callback',
      '/api/auth/*',
      '/api/connect/*',
      '/uploads/*'
    ];

    // Redirección automática
    if (redirectPaths.includes(ctx.path) || 
        (ctx.path === '/admin' && ctx.path.startsWith('/admin/'))) {
      return ctx.redirect(getLoginUrl());
    }

    // Verificar rutas públicas
    const isPublicPath = (path) => {
      return publicPaths.some(publicPath => {
        if (publicPath.endsWith('*')) {
          return path.startsWith(publicPath.slice(0, -1));
        }
        return path === publicPath;
      });
    };

    if (isPublicPath(ctx.path)) {
      return await next();
    }

    // Verificación de token
    const token = 
      ctx.cookies.get('jwtToken') || 
      ctx.request.header.authorization?.replace('Bearer ', '') ||
      ctx.query.token;

    if (!token) {
      return ctx.path.startsWith('/api/')
        ? ctx.unauthorized('Authentication required')
        : ctx.redirect(getLoginUrl());
    }

    try {
      ctx.state.user = await strapi.admin.services.token.validate(token);
      await next();
    } catch (err) {
      return ctx.path.startsWith('/api/')
        ? ctx.unauthorized('Invalid or expired token')
        : ctx.redirect(getLoginUrl());
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

3. (Opcional) Añade configuración específica en `config/middlewares/auth-check.js`:

```javascript
module.exports = {
  settings: {
    redirectPaths: ['/', '/admin'],
    loginUrl: '/webunal-login/login',
    publicPaths: [
      '/webunal-login/login',
      '/webunal-login/google',
      '/webunal-login/google/callback',
      '/api/auth/*',
      '/api/connect/*',
      '/uploads/*'
    ]
  }
};
```

### Funcionalidades del Middleware

- Redirección automática de la raíz (`/`) y panel de administración (`/admin`) al login
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
