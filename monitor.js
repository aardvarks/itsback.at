var http = require('follow-redirects').http
const TICK = 5000

function upFinder (code) {
  return !!(code >= 200 && code <= 203)
}

function Monitor (domain) {
  this.domain = domain
  this.clients = []
  this.handler = {}
  this.started = false
}

Monitor.prototype.addClient = function (client, callback) {
  for (var i in this.clients) {
    if (this.clients[i].id === client) {
      return
    }
  }
  this.clients.push({id: client, callback: callback})
  if (!this.started) {
    this.start()
  }
}

Monitor.prototype.removeClient = function (client) {
  for (var i = 0; i < this.clients.length; i++) {
    if (this.clients[i].id === client) {
      this.clients.splice(i, 1)
    }
  }
  if (!this.clients.length) {
    this.stop()
  }
}

Monitor.prototype.start = function () {
  var parent = this
  parent.checkDomain()
  parent.started = true
}

Monitor.prototype.stop = function () {
  clearTimeout(this.handler)
  this.started = false
}

Monitor.prototype.log = function () {
}

Monitor.prototype.checkDomain = function () {
  var clients = this.clients
    , target =
      { host: this.domain
      , port: 80
      , path: '/'
      , method: 'GET'
      , agent: false
      , headers: { 'User-Agent': 'Mozilla/5.0' }
     }

  try {
    http.get(target, function (res) {
      res.on('data', function () {}) //  Do nothing with the data to free the socket.
      var up = upFinder(res.statusCode)
      for (var client in clients) {
        clients[client].callback(up)

      }
    }).on('error', function () {
      var up = false
      for (var client in clients) {
        clients[client].callback(up)
      }

    }).end()
  } catch (err) {

  }
  var parent = this
  this.handler = setTimeout(function () {
    parent.checkDomain()
  }, TICK)
  this.log()
}

module.exports = Monitor

