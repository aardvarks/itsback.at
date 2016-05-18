const assert = require('assert')
    , findDomainAndPort = require('../lib/find-domain-and-port')
    , fixtures =
      [ { url: { url: 'http://google.com' }, result: { domain: 'google.com', port: '80' } }
      , { url: { url: 'https://google.com' }, result: { domain: 'google.com', port: '443' } }
      , { url: { url: 'https://google.com:3000' }, result: { domain: 'google.com', port: '3000' } }
      , { url: { url: 'http://google.com:3000' }, result: { domain: 'google.com', port: '3000' } }
      , { url: { url: 'http://google.com:3000/path' }, result: { domain: 'google.com', port: '3000' } }
      , { url: { url: 'http://google.com:3000' }, result: { domain: 'google.com', port: '3000' } }
      , { url: { url: 'google.com' }, result: { domain: 'google.com', port: '80' } }
      , { url: { url: 'google.com/path' }, result: { domain: 'google.com', port: '80' } }
      , { url: { url: 'google.com:3000/path' }, result: { domain: 'google.com', port: '3000' } }
      , { url: { url: 'google.com:3000' }, result: { domain: 'google.com', port: '3000' } }
      , { url: { url: '://google.com:3000' }, result: { domain: 'google.com', port: '3000' } }
      , { url: { url: '://google.com' }, result: { domain: 'google.com', port: '80' } }
      , { url: { url: 'ftp://google.com:3000' }, result: { domain: 'google.com', port: '3000' } }
      , { url: { url: 'ftp://google.com' }, result: { domain: 'google.com', port: '80' } }
      , { url: { url: 'ftp://google.com:3000/a/bunch?=of werid+stuff#to-see\/ifi:tb.reaks' }, result: { domain: 'google.com', port: '3000' } }
      , { url: { url: 'google.com/a/bunch?=of werid+stuff#to-see\/ifi:tb.reaks' }, result: { domain: 'google.com', port: '80' } }
      ]

describe('Test URL parsing logic', () => {
  fixtures.forEach((fixture) => {
    it('should return: ' + JSON.stringify(fixture.result), (done) => {
      assert.deepEqual(findDomainAndPort(fixture.url), fixture.result, 'wrong domain or port found')
      done()
    })
  })
})
