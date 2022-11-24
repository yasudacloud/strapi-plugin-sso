'use strict';
const oauth = require("../oauth");

describe('oauth service', () => {
  const strapi = jest.fn()
  const service = oauth({strapi})

  describe('add Gmail Alias', () => {
    test('When using an alias', () => {
      const result = service.addGmailAlias('test@example.com', 'hoge')
      expect(result).toEqual(`test+hoge@example.com`)
    })

    test('If no alias is used', () => {
      const result = service.addGmailAlias('test@example.com',)
      expect(result).toEqual(`test@example.com`)
    })
  })

  describe('locale Find By Header', () => {
    test('Header contains Japanese characters > ja', () => {
      const result = service.localeFindByHeader({
        'accept-language': 'hellojalanguage'
      })
      expect(result).toEqual('ja')
    })

    test('Header does not contain Japanese > en', () => {
      const result = service.localeFindByHeader({
        'accept-language': 'hellolanguageenglish'
      })
      expect(result).toEqual('en')
    })

    test('Header does not contain accept-language > en', () => {
      const result = service.localeFindByHeader({
        'content-type': 'json'
      })
      expect(result).toEqual('en')
    })
  })
})
