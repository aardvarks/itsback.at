let express = require('express')
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
  let client

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
    client.emit('domainValidate', 'google.com/asdasd')
    client.on('serverUrlKey', (data) => {
      assert.equal(data, 'google.com:80', 'domain not found correctly')
      done()
    })
  })

  it('should report domain', (done) => {
    client.emit('domainSubmit', 'google.com')
    client.on('result', () => {
      client.emit('domainReport', 'google.com:80')
      client.on('reported', (data) => {
        assert.equal(data, 'google.com:80', 'clients not received report')
        done()
      })
    })
  })

  it('should submit a domain and get a result', (done) => {
    client.emit('domainSubmit', 'google.com/asdasd')
    client.on('result', (data) => {
      assert.equal(data.urlKey, 'google.com:80', 'domain not found correctly')
      assert.equal(data.state, true, 'domain not found correctly')
      assert.equal(data.watching, 1, 'clients not counted correctly')
      done()
    })
  })

  it('should remove client from domains when disconnected', (done) => {
    client.emit('domainSubmit', 'google.com')
    client.on('result', () => {
      assert.equal(domainClients['google.com:80'].clients.length, 1, 'client not added')
      client.disconnect()
      setTimeout(() => {
        assert.equal(domainClients['google.com:80'], undefined, 'client not removed')
        done()
      }, 100)
    })
  })

  it('should add multiple clients', (done) => {
    let client2 = io.connect(socketUrl, {})
    client.emit('domainSubmit', 'google.com')
    client2.emit('domainSubmit', 'google.com')
    client.on('result', () => {
      assert.equal(domainClients['google.com:80'].clients.length, 2, 'client not added')
      done()
    })
  })
})
