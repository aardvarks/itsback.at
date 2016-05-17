'use strict'

class Socket {
  constructor (io) {
    this.socket = io.connect('/')
    this.clientId

    this.socket.on('id', function (data) {
      this.clientId = data.id
    })

    this.socket.on('reported', function (data) {
      $('body').trigger('itsback:reported')
    })

    this.socket.on('result', function (data) {
      $('body').trigger('itsback:change', data)
        $('body').trigger('itsback:' + (data.state ? 'up' : 'down'), data)
    })
  }

  reportDomain (url) {
    this.socket.emit('domainReport', { url })
  }

  testDomain (url) {
    this.socket.emit('domainValidate', { url, 'id': this.clientId })

    this.socket.on('serverDomain', function (data) {
      $('body').trigger('itsback:serverDomain', data.domain)
    })

    $('body').trigger('itsback:checking')
    this.socket.emit('domainSubmit', { url, 'id': this.clientId })
  }
}

module.exports = Socket


