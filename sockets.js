var socket = require('socket.io')

module.exports = (server) => {
  var io = socket.listen(server)
}