'use strict'

const Database = require('./database')
const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/itsback'

let socket = require('socket.io')
  , Monitor = require('./monitor.js')
  , findUrlKey = require('./lib/find-url-key')

module.exports = (server) => {
  let io = socket.listen(server)
    , domainClients = {}
    , db = new Database(dbUrl)
    , database = db.connect()
    , reportedSockets = []

  function removeClient (socket) {
    Object.keys(domainClients).forEach((client) => {
      domainClients[client].removeClient(socket.id)
    })

    let index = reportedSockets.indexOf(socket.id)
    reportedSockets.splice(index, 1)
  }

  io.sockets.on('connection', (socket) => {
    socket.emit('id', {'id': socket.id})

    socket.on('domainValidate', (data) => {
      let { domain, port } = findUrlKey(data)
      socket.emit('serverDomain', { domain, port })
    })

    socket.on('domainReport', (data) => {
      let { domain, port } = findUrlKey(data)
      if (domain == null) return
      if (reportedSockets.indexOf(socket.id) > -1) return

      database.then(() => {
        db.addReport(domain)
      })

      domainClients[domain].clients.forEach((client) => {
        io.to(client.id).emit('reported', domain)
      })

      reportedSockets.push(socket.id)
    })

    socket.on('domainSubmit', (data) => {
      let { domain, port } = findUrlKey(data)

      if (domain == null) return
      removeClient(socket)

      if (!domainClients.hasOwnProperty(domain)) {
        domainClients[domain] = new Monitor(domain, port)
        domainClients[domain].start()
      }

      domainClients[domain].addClient(socket.id, (state) => {
        let watching = domainClients[domain].clients.length

        database.then(() => {
          db.findReport(domain).then((reported) => {
            socket.emit('result',
              { state
              , domain
              , watching
              , reported
              }
            )
          })
        })
      })
    })

    socket.on('error', console.log)

    socket.on('disconnect', () => {
       removeClient(socket)
    })
  })

  return domainClients
}
