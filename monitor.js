'use strict'

const http = require('follow-redirects').http

class Monitor {
  constructor (urlKey) {
    this.domain = urlKey.split(':')[0]
    this.port = urlKey.split(':')[1]
    this.clients = []
    this.handler = {}
    this.started = false
    this.tick = 5000
  }

  checkHealth (code) {
    return !!(code >= 200 && code <= 203)
  }

  addClient (client, callback) {
    let exists = this.clients.some((c) => { return c.id === client })
    if (!exists) {
      this.clients.push({ id: client, callback: callback })
      if (!this.started) this.start()
    }
  }

  removeClient (client) {
    this.clients = this.clients.filter((c) => { return c.id !== client })
    if (!this.clients.length) this.stop()
  }

  start () {
    this.started = true
    this.checkDomain()
  }

  stop () {
    clearTimeout(this.handler)
    this.started = false
    if (this.connection) this.connection.abort()
  }

  triggerClientCallbacks (state) {
    this.clients.forEach((client) => { client.callback(state) })
  }

  checkDomain () {
    let target =
        { host: this.domain
        , port: this.port
        , path: '/'
        , method: 'GET'
        , agent: false
        , headers:
          { 'User-Agent': 'Mozilla/5.0'
          , 'Connection': 'close'
          }
        }

    this.connection = http.get(target)
      .on('response', (res) => {
        let state = this.checkHealth(res.statusCode)
        this.triggerClientCallbacks(state)
      })
      .on('error', this.triggerClientCallbacks.bind(this, false))
      .setTimeout(this.tick, () => {
        this.connection.abort()
        this.triggerClientCallbacks(false)
      })
      .end()

    this.handler = setTimeout(() => {
      this.checkDomain()
    }, this.tick)
  }
}

module.exports = Monitor
