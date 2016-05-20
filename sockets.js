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
    Object.keys(domainClients).forEach((domain) => {
      domainClients[domain].removeClient(socket.id)

      if (!domainClients[domain].started) {
        delete domainClients[domain]
      }
    })

    let index = reportedSockets.indexOf(socket.id)
    reportedSockets.splice(index, 1)
  }

  io.sockets.on('connection', (socket) => {
    socket.emit('id', {'id': socket.id})

    socket.on('domainValidate', (url) => {
      socket.emit('serverUrlKey', findUrlKey(url))
    })

    socket.on('domainReport', (clientUrlKey) => {
      let urlKey = findUrlKey(clientUrlKey)
      if (urlKey === null) return
      if (reportedSockets.indexOf(socket.id) > -1) return

      database.then(() => {
        db.addReport(urlKey)
      })

      domainClients[urlKey].clients.forEach((client) => {
        io.to(client.id).emit('reported', urlKey)
      })

      reportedSockets.push(socket.id)
    })

    socket.on('domainSubmit', (url) => {
      let urlKey = findUrlKey(url)

      if (urlKey === null) return
      removeClient(socket)

      if (!domainClients.hasOwnProperty(urlKey)) {
        domainClients[urlKey] = new Monitor(urlKey)
      }

      domainClients[urlKey].addClient(socket.id, (state) => {
        let watching = domainClients[urlKey].clients.length

        database.then(() => {
          db.findReport(urlKey).then((reported) => {
            socket.emit('result',
              { state
              , urlKey
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
