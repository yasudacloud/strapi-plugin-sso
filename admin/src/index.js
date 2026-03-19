import { getTranslation } from './utils/getTranslation';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';

const name = pluginPkg.strapi.displayName;

export default {
  register(app) {
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      name,
    });
  },

  bootstrap({ addSettingsLink }) {
    addSettingsLink(
      {
        id: pluginId,
        intlLabel: {
          id: `${pluginId}.plugin.name`,
          defaultMessage: 'Single Sign On',
        },
        links: [
          {
            intlLabel: {
              id: `${pluginId}.settings.configuration`,
              defaultMessage: 'Configuration',
            },
            id: `${pluginId}-configuration`,
            to: `/settings/${pluginId}`,
            Component: () => import('./pages/HomePage'),
            permissions: [{ action: 'plugin::strapi-plugin-sso.read', subject: null }],
          },
        ],
      }
    );
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(`./translations/${locale}.json`)
          .then(({default: data}) => {
            const newData = Object.fromEntries(
              Object.entries(data).map(([key, value]) => [getTranslation(key), value])
            );
            return {
              data: newData,
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );
    return Promise.resolve(importedTrads);
  },
};
