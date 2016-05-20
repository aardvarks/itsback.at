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
      $('body').trigger('itsback:update', data)
    })
  }

  reportDomain (clientUrlKey) {
    this.socket.emit('domainReport', clientUrlKey)
  }

  testDomain (url) {
    this.socket.emit('domainValidate', url)

    this.socket.on('serverUrlKey', function (urlKey) {
      $('body').trigger('itsback:clientUrlKey', urlKey)
    })

    $('body').trigger('itsback:checking')
    this.socket.emit('domainSubmit', url)
  }
}

module.exports = Socket


