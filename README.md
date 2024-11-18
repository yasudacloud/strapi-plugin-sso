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

Después de agregar la configuración, instala las dependencias necesarias:

```shell
npm install
```

## Uso

Para iniciar sesión con Google, debes ir a la siguiente URL:

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
