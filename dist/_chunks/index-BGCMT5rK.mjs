import { useRef, useEffect } from "react";
import { jsx } from "react/jsx-runtime";
import { Lock } from "@strapi/icons";
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
  const ref = useRef();
  ref.current = setPlugin;
  useEffect(() => {
    ref.current(pluginId);
  }, []);
  return null;
};
const PluginIcon = () => /* @__PURE__ */ jsx(Lock, {});
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
        return await import("./index-C09Oa13a.mjs");
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
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => import("./en-AsM8uCFB.mjs"), "./translations/fr.json": () => import("./fr-hkSxFuzl.mjs"), "./translations/ja.json": () => import("./ja-COdupAQd.mjs") }), `./translations/${locale}.json`, 3).then(({ default: data }) => {
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
export {
  index as i,
  pluginId as p
};
