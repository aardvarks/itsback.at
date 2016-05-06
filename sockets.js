var socket = require('socket.io')
  , url = require('url')
  , Monitor = require('./monitor.js')

module.exports = (server) => {
  var io = socket.listen(server)
    , domainClients = {}

  function findDomain (inputUrl) {
    var testUrl = url.parse(inputUrl.domain)

    if (testUrl.protocol == null) {
      testUrl = url.parse('http://' + inputUrl.domain)
    }

    // If we are going with just domains, not paths, the this is fine, but we need to sort port numbers too
    return testUrl.hostname
  }

  function removeClient (socket) {
		Object.keys(domainClients).forEach((client) => {
			domainClients[client].removeClient(socket.id)
		})
	}

  io.sockets.on('connection', (socket) => {
    socket.emit('id', {'id': socket.id})

    socket.on('domainValidate', (data) => {
      socket.emit('serverDomain', { 'domain': findDomain(data) })
    })

    socket.on('domainSubmit', (data) => {
      var domain = findDomain(data)

      if (domain == null) return

      removeClient(socket)

      if (!domainClients.hasOwnProperty(domain)) {
        domainClients[domain] = new Monitor(domain)
        domainClients[domain].start()
      }

      domainClients[domain].addClient(socket.id, (state) => {
        socket.emit('result', { 'state': state, 'domain': domain })
      })
    })

    socket.on('disconnect', () => {
       removeClient(socket)
    })
  })

  return domainClients
}
