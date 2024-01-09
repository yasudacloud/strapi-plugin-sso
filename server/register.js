'use strict';

module.exports = ({ strapi }) => {
  // registeration phase
  strapi.customFields.register({
    name: 'SSO',
    plugin: 'SSO',
    type: 'Auth',
  });
};
