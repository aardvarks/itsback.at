var socket = require('socket.io')
  , url = require('url')
  , Monitor = require('./monitor.js')
  , path = false

module.exports = (server) => {
  var io = socket.listen(server)
    , domains = {}

  function valURL (inputUrl) {
    var testUrl = url.parse(inputUrl.domain)
    if (testUrl.protocol == null) testUrl = url.parse('http://' + inputUrl.domain)
    return testUrl.hostname + (path ? testUrl.path : '')
  }

  io.sockets.on('connection', (socket) => {
    socket.emit('id', {'id': socket.id})

    socket.on('disconnect', () => {
      for (var i in domains) {
        domains[i].removeClient(socket.id)
      }
    })

    socket.on('domainVal', (data) => {
      socket.emit('theDomain', { 'domain': valURL(data) })
      if (data.path === true) path = true
    })

    socket.on('domainSubmit', (data) => {
      var domain = valURL(data)
      if (domain == null) return
      for (var i in domains) {
        domains[i].removeClient(socket.id)
      }

      if (!domains.hasOwnProperty(domain)) {
        domains[domain] = new Monitor(domain)
        domains[domain].start()
      }

      domains[domain].addClient(socket.id, (up) => {
        socket.emit('result', { 'up': up, 'domain': domain })
      })
    })
  })
}
