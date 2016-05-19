const assert = require('assert')
    , findUrlKey = require('../lib/find-url-key')
    , fixtures =
      [ { url: { url: 'http://google.com' }, result: 'google.com:80' }
      , { url: { url: 'https://google.com' }, result: 'google.com:443' }
      , { url: { url: 'https://google.com:3000' }, result: 'google.com:3000' }
      , { url: { url: 'http://google.com:3000' }, result: 'google.com:3000' }
      , { url: { url: 'http://google.com:3000/path' }, result: 'google.com:3000' }
      , { url: { url: 'http://google.com:3000' }, result: 'google.com:3000' }
      , { url: { url: 'google.com' }, result: 'google.com:80' }
      , { url: { url: 'google.com/path' }, result: 'google.com:80' }
      , { url: { url: 'google.com:3000/path' }, result: 'google.com:3000' }
      , { url: { url: 'google.com:3000' }, result: 'google.com:3000' }
      , { url: { url: '://google.com:3000' }, result: 'google.com:3000' }
      , { url: { url: '://google.com' }, result: 'google.com:80' }
      , { url: { url: 'ftp://google.com:3000' }, result: 'google.com:3000' }
      , { url: { url: 'ftp://google.com' }, result: 'google.com:80' }
      , { url: { url: 'ftp://google.com:3000/a/bunch?=of werid+stuff#to-see\/ifi:tb.reaks' }, result: 'google.com:3000' }
      , { url: { url: 'google.com/a/bunch?=of werid+stuff#to-see\/ifi:tb.reaks' }, result: 'google.com:80' }
      ]

describe.only('Test URL parsing logic', () => {
  fixtures.forEach((fixture) => {
    it('should return: ' + JSON.stringify(fixture.result), (done) => {
      assert.deepEqual(findUrlKey(fixture.url), fixture.result, 'wrong domain or port found')
      done()
    })
  })
})
