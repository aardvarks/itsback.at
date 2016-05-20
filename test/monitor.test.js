const nock = require('nock')
    , assert = require('assert')
    , Monitor = require('../monitor')
    , noop = () => {}

describe('Monitor class', () => {
  let monitor

  beforeEach(() => {
    monitor = new Monitor('google.com')
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('constructor', () => {
    it('should take domain as an argument', function (done) {
      assert.equal(monitor.domain, 'google.com', 'domain not set correctly')
      done()
    })
  })

  describe('checkHealth', () => {
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

  describe('addClient', () => {
    it('should add a client', function (done) {
      monitor.addClient('clientId', noop)
      monitor.addClient('clientId', noop)
      assert.equal(monitor.clients[0].id, 'clientId', 'clientId not set correctly')
      assert.equal(monitor.clients.length, 1, 'duplicate client allowed')
      assert.equal(monitor.started, true, 'monitor not started')

      monitor.addClient('clientId2', noop)
      assert.equal(monitor.clients.length, 2, 'multiple clients not added')
      done()
    })
  })

  describe('removeClient', () => {
    it('should remove a client', function (done) {
      monitor.addClient('clientId', noop)
      monitor.removeClient('clientId')
      assert.equal(monitor.clients.length, 0, 'client not removed')
      assert.equal(monitor.started, false, 'monitor not stopped')
      done()
    })
  })

  describe('checkDomain', () => {
    beforeEach(() => {
      monitor.tick = 500
    })

    function makeCallback (expected, done) {
      return function (up) {
        assert.equal(up, expected, 'incorrect result')
        monitor.removeClient('clientId')
        done()
      }
    }

    it('should check a live domain', function (done) {
      nock('http://google.com:80')
        .filteringPath(() => { return '/' })
        .get('/')
        .reply(200)

      monitor.addClient('clientId', makeCallback(true, done))
    })

    it('should check a dead domain', function (done) {
      nock('http://madeupsitethatdoesnotexist.com:80')
        .filteringPath(() => { return '/' })
        .get('/')
        .reply(400)

      monitor.domain = 'madeupsitethatdoesnotexist.com'
      monitor.addClient('clientId', makeCallback(false, done))
    })

    it('should timeout if a domain does not respond after 1 tick', function (done) {
      nock('http://test.com:80')
        .filteringPath(() => { return '/' })
        .get('/')
        .delay(10000)
        .reply(200)

      monitor.domain = 'test.com'
      monitor.addClient('clientId', makeCallback(false, done))
    })
  })
})
