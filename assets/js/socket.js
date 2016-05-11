'use strict'

class Socket {
  constructor (io) {
    this.socket = io.connect('/')
    this.clientId

    this.socket.on('id', function (data) {
      this.clientId = data.id
    })

    this.socket.on('reported', function (data) {
      alert(data)
    })

    this.socket.on('result', function (data) {
      $('body').trigger('itsback:change', data)
        $('body').trigger('itsback:' + (data.state ? 'up' : 'down'), data)
    })
  }

  reportDomain (domain) {
    this.socket.emit('domainReport', { domain: domain })
  }

  testDomain (domain) {
    this.socket.emit('domainValidate', { 'domain': domain, 'id': this.clientId })

    this.socket.on('serverDomain', function (data) {
      console.log(222, data)
      $('body').trigger('itsback:serverDomain', data.domain)
    })

    $('body').trigger('itsback:checking')
    this.socket.emit('domainSubmit', { 'domain': domain, 'id': this.clientId })
  }
}

module.exports = Socket


