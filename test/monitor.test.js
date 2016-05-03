var assert = require('assert')
  , Monitor = require('../monitor')

describe('Monitor class', function () {
  var monitor = new Monitor('tuna.com')

  describe('constructor', function () {
    it('should take domain as an argument', function (done) {
      assert.equal(monitor.domain, 'tuna.com', 'domain not set correctly')
      done()
    })
  })

  describe('checkHealth', function () {
    it('should return true for up false for down', function (done) {
      assert.equal(true, monitor.checkHealth(200), 'should be true')
      assert.equal(true, monitor.checkHealth(201), 'should be true')
      assert.equal(true, monitor.checkHealth(202), 'should be true')
      assert.equal(true, monitor.checkHealth(203), 'should be true')
      assert.equal(false, monitor.checkHealth(404), 'should be false')
      assert.equal(false, monitor.checkHealth(403), 'should be false')
      assert.equal(false, monitor.checkHealth(500), 'should be false')
      assert.equal(false, monitor.checkHealth(503), 'should be false')
      done()
    })
  })
})

