var express = require('express')
  , app = express()
  , io = require('socket.io-client')
  , attachSocket = require('../sockets')
  , port = process.env.PORT || 3000
  , domainClients
  , server = app.listen(port, () => {
      domainClients = attachSocket(server)
    })
  , socketUrl = 'http://localhost:' + port
  , assert = require('assert')

describe('Sockets', () => {
  var client

  beforeEach(() => {
    client = io.connect(socketUrl, {})
  })

  afterEach(() => {
    client.disconnect()
  })

  it('should accept a connection', (done) => {
    client.on('id', (data) => {
      assert.equal(typeof data.id, 'string', 'id not given')
      done()
    })
  })

  it('should vaildate domain', (done) => {
    client.emit('domainValidate', { domain: 'google.com/asdasd' })
    client.on('serverDomain', (data) => {
      assert.equal(data.domain, 'google.com', 'domain not found correctly')
      done()
    })
  })

  it('should submit a domain and get a result', (done) => {
    client.emit('domainSubmit', { domain: 'google.com/asdasd' })
    client.on('result', (data) => {
      assert.equal(data.domain, 'google.com', 'domain not found correctly')
      assert.equal(data.state, true, 'domain not found correctly')
      done()
    })
  })

  it('should remove client from domains when disconnected', (done) => {
    client.emit('domainSubmit', { domain: 'google.com' })
    client.on('result', (data) => {
      assert.equal(domainClients['google.com'].clients.length, 1, 'client not added')
      client.disconnect()
      setTimeout(() => {
        assert.equal(domainClients['google.com'].clients.length, 0, 'client not removed')
        done()
      }, 500)
    })
  })
})
