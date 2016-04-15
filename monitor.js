'use strict'

const http = require('follow-redirects').http
const TICK = 5000

module.exports = Monitor

function upFinder (code) {
  return !!(code >= 200 && code <= 203)
}

function Monitor (domain) {
  this.domain = domain
  this.clients = []
  this.handler = {}
  this.started = false
}

Monitor.prototype.addClient = (client, callback) => {
  var exists = this.clients.some((c) => { c.id === client })
  if (!exists) {
    this.clients.push({ id: client, callback: callback })
    if (!this.started) this.start()
  }
}

Monitor.prototype.removeClient = (client) => {
  this.clients = this.clients.filter((c) => { c.id === client })
  if (!this.clients.length) this.stop()
}

Monitor.prototype.start = () => {
  this.checkDomain()
  this.started = true
}

Monitor.prototype.stop = () => {
  clearTimeout(this.handler)
  this.started = false
}

Monitor.prototype.log = () => {}

Monitor.prototype.checkDomain = () => {
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
      clients.forEach((client) => { client.callback(up) })
    }).on('error', function () {
      clients.forEach((client) => { client.callback(false) })
    }).end()
  } catch (err) {

  }
  this.handler = setTimeout(() => {
    this.checkDomain()
  }, TICK)
  this.log()
}
