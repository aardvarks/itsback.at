var assert = require('assert')
  , Monitor = require('../monitor')

describe('Monitor class', function () {
  var monitor

  beforeEach(function () {
    monitor = new Monitor('tuna.com')
  })

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

  describe('addClient', function () {
    it('should add a client', function (done) {
      monitor.addClient('clientId', function () { return 'tuna' })
      monitor.addClient('clientId', function () { return 'tuna' })
      assert.equal(monitor.clients[0].id, 'clientId', 'clientId not set correctly')
      assert.equal(monitor.clients[0].callback(), 'tuna', 'callback not set correctly')
      assert.equal(monitor.clients.length, 1, 'duplicate client allowed')
      assert.equal(monitor.started, true, 'monitor not started')
      done()
    })
  })

  describe('removeClient', function () {
    it('should remove a client', function (done) {
      monitor.addClient('clientId', function () { return 'tuna' })
      monitor.removeClient('clientId')
      assert.equal(monitor.clients.length, 0, 'client not removed')
      assert.equal(monitor.started, false, 'monitor not stopped')
      done()
    })
  })

  describe('checkDomain', function () {
    var expected

    function makeCallback (done) {
      return function (up) {
        assert.equal(up, expected, 'incorrect result')
        done()
      }
    }

    it('should check a live domain', function (done) {
      expected = true
      monitor.addClient('clientId', makeCallback(done))
    })

    it('should check a dead domain', function (done) {
      monitor.domain = 'madeupsitethatdoesnotexist.com'
      expected = false
      monitor.addClient('clientId', makeCallback(done))
    })
  })

})
