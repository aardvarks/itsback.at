const assert = require('assert')
    , findUrlKey = require('../lib/find-url-key')
    , fixtures =
      [ { url: 'http://google.com', result: 'google.com:80' }
      , { url: 'https://google.com', result: 'google.com:443' }
      , { url: 'https://google.com:3000', result: 'google.com:3000' }
      , { url: 'http://google.com:3000', result: 'google.com:3000' }
      , { url: 'http://google.com:3000/path', result: 'google.com:3000' }
      , { url: 'http://google.com:3000', result: 'google.com:3000' }
      , { url: 'google.com', result: 'google.com:80' }
      , { url: 'google.com/path', result: 'google.com:80' }
      , { url: 'google.com:3000/path', result: 'google.com:3000' }
      , { url: 'google.com:3000', result: 'google.com:3000' }
      , { url: '://google.com:3000', result: 'google.com:3000' }
      , { url: '://google.com', result: 'google.com:80' }
      , { url: 'ftp://google.com:3000', result: 'google.com:3000' }
      , { url: 'ftp://google.com', result: 'google.com:80' }
      , { url: 'ftp://google.com:3000/a/bunch?=of werid+stuff#to-see\/ifi:tb.reaks', result: 'google.com:3000' }
      , { url: 'google.com/a/bunch?=of werid+stuff#to-see\/ifi:tb.reaks', result: 'google.com:80' }
      ]

describe('Test URL parsing logic', () => {
  fixtures.forEach((fixture) => {
    it('URL ' + fixture.url + ' should return key: ' + fixture.result, (done) => {
      assert.deepEqual(findUrlKey(fixture.url), fixture.result, 'wrong domain or port found')
      done()
    })
  })
})
