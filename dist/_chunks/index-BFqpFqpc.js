"use strict";
const react = require("react");
const jsxRuntime = require("react/jsx-runtime");
const icons = require("@strapi/icons");
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const name$1 = "strapi-plugin-sso";
const strapi = {
  displayName: "Single Sign On"
};
const pluginPkg = {
  name: name$1,
  strapi
};
const pluginId = pluginPkg.name.replace(/^@strapi\/plugin-/i, "");
const getTranslation = (id) => `${pluginId}.${id}`;
const Initializer = ({ setPlugin }) => {
  const ref = react.useRef();
  ref.current = setPlugin;
  react.useEffect(() => {
    ref.current(pluginId);
  }, []);
  return null;
};
const PluginIcon = () => /* @__PURE__ */ jsxRuntime.jsx(icons.Lock, {});
const name = pluginPkg.strapi.displayName;
const index = {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name
      },
      Component: async () => {
        return await Promise.resolve().then(() => require("./index-6i2aMsbo.js"));
      },
      permissions: [{ action: "plugin::strapi-plugin-sso.read", subject: null }]
    });
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      name
    });
  },
  bootstrap(app) {
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => Promise.resolve().then(() => require("./en-BbQ9XzfO.js")), "./translations/fr.json": () => Promise.resolve().then(() => require("./fr-C8Qw4iPZ.js")), "./translations/ja.json": () => Promise.resolve().then(() => require("./ja-B2WcMFA2.js")) }), `./translations/${locale}.json`, 3).then(({ default: data }) => {
          const newData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [getTranslation(key), value])
          );
          return {
            data: newData,
            locale
          };
        }).catch(() => {
          return {
            data: {},
            locale
          };
        });
      })
    );
    return Promise.resolve(importedTrads);
  }
};
exports.index = index;
exports.pluginId = pluginId;
