'use strict'

class Application {
  constructor (window, socket, notification) {
    this.window = window
    this.document = window.document
    this.socket = socket
    this.notification = notification
    this.result = null
  }

  initialLoad (cb) {
    if (this.window.location.pathname.substr(1).length) {
      let path = this.window.location.pathname.substr(1).split('/')
      this.socket.testDomain(path[0])
      cb(path[0])
    } else {
      cb(null)
    }
  }

  performFirstTest (e) {
    e.preventDefault()
    this.socket.testDomain($('.js-url-input').val())
    this.notification.refreshState()
    this.notification.requestPermission()
  }

  updateIcon (state) {
    let link = this.document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = '/assets/imgs/' + (state ? 'up' : 'down') + '.ico'
    this.document.getElementsByTagName('head')[0].appendChild(link)
  }

  processResult (state) {
    this.document.title = 'It\'s ' + (state ? 'back!' : 'down :(')
    this.updateIcon(state)
    if (this.result === state) return
    this.result = state
  }
}

module.exports = Application
