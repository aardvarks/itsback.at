class Socket {
  constructor (io) {
    this.socket = io.connect('/')
    this.clientId

    this.socket.on('id', function (data) {
      this.clientId = data.id
    })

    this.socket.on('result', function (data) {
      $('body').trigger('itsback:change', data)
        $('body').trigger('itsback:' + (data.state ? 'up' : 'down'), data)
    })
  }

  testDomain (domain) {
    this.socket.emit('domainValidate', { 'domain': domain, 'id': this.clientId })

    this.socket.on('serverDomain', function (data) {
      $('body').trigger('itsback:serverDomain', data.domain)
    })

    $('body').trigger('itsback:checking')
    this.socket.emit('domainSubmit', { 'domain': domain, 'id': this.clientId })
  }
}

module.exports = Socket


