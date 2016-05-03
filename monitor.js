'use strict'

const http = require('follow-redirects').http

class Monitor {
  constructor (domain) {
    this.domain = domain
    this.clients = []
    this.handler = {}
    this.started = false
    this.tick = 5000
  }

  upFinder (code) {
    return !!(code >= 200 && code <= 203)
  }

  addClient (client, callback) {
    var exists = this.clients.some((c) => { c.id === client })
    if (!exists) {
      this.clients.push({ id: client, callback: callback })
      if (!this.started) this.start()
    }
  }

  removeClient (client) {
    this.clients = this.clients.filter((c) => { c.id === client })
    if (!this.clients.length) this.stop()
  }

  start () {
    this.checkDomain()
    this.started = true
  }

  stop () {
    clearTimeout(this.handler)
    this.started = false
  }

  log () {}

  checkDomain () {
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
      http.get(target, (res) => {
        res.on('data', () => {}) //  Do nothing with the data to free the socket.
        var up = this.upFinder(res.statusCode)
        clients.forEach((client) => { client.callback(up) })
      }).on('error', function () {
        clients.forEach((client) => { client.callback(false) })
      }).end()
    } catch (err) {

    }
    this.handler = setTimeout(() => {
      this.checkDomain()
    }, this.tick)
    this.log()
  }
}

module.exports = Monitor
