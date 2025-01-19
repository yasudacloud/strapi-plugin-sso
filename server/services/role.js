export default ({strapi}) => ({
  SSO_TYPE_GOOGLE: '1',
  SSO_TYPE_COGNITO: '2',
  SSO_TYPE_AZUREAD: "3",
  SSO_TYPE_OIDC: '4',
    ssoRoles() {
    return [
      {
        'oauth_type': this.SSO_TYPE_GOOGLE,
        name: 'Google'
      }, {
        'oauth_type': this.SSO_TYPE_COGNITO,
        name: 'Cognito'
      },
      {
       'oauth_type': this.SSO_TYPE_AZUREAD,
        name: "AzureAD",
      },
      {
        'oauth_type': this.SSO_TYPE_OIDC,
        name: 'OIDC'
      },
    ];
  },
  async googleRoles() {
    return await strapi
      .query('plugin::strapi-plugin-sso.roles')
      .findOne({
        where: {
          'oauth_type': this.SSO_TYPE_GOOGLE
        }
      })
  },
  async cognitoRoles() {
    return await strapi
      .query('plugin::strapi-plugin-sso.roles')
      .findOne({
        where: {
          'oauth_type': this.SSO_TYPE_COGNITO
        }
      })
  },
  async azureAdRoles() {
    return await strapi.query('plugin::strapi-plugin-sso.roles').findOne({
      where: {
        oauth_type: this.SSO_TYPE_AZUREAD
      },
    });
  },
    async oidcRoles() {
    return await strapi
      .query('plugin::strapi-plugin-sso.roles')
      .findOne({
        where: {
          'oauth_type': this.SSO_TYPE_OIDC
        }
      })
  },
    async find() {
    return await strapi
      .query('plugin::strapi-plugin-sso.roles')
      .findMany()
  },
   async update(roles) {
    const query = strapi.query('plugin::strapi-plugin-sso.roles')
    await Promise.all(
      roles.map((role) => {
        return query.findOne({where: {'oauth_type': role['oauth_type']}}).then(ssoRole => {
          if (ssoRole) {
            query.update({
              where: {'oauth_type': role['oauth_type']},
              data: {roles: role.role},
            });
          } else {
            query.create({
              data: {
                'oauth_type': role['oauth_type'],
                roles: role.role,
              }
            })
          }
        })
      })
    );
  }
})
