class Notifications {
  constructor (window) {
    this.window = window
    this.notifications = false
    this.first = true
    this.domain = ''
  }

  refreshState () {
    this.first = true
  }

  setDomain (domain) {
    this.domain = domain
  }

  getPermissions () {
    if (this.window.Notification) {
      if (this.window.Notification.permission === 'granted') {
        this.notifications = true
      } else {
        this.window.Notification.requestPermission()
      }
    } else {
      window.alert('Notifications are supported in modern versions of Chrome, Firefox, Opera and Firefox.')
    }
  }

  requestPermission () {
    if (this.window.webkitNotifications) this.window.webkitNotifications.requestPermission()
  }

  notifyStatusChange (data, result) {
    if (this.domain === data.domain && result !== data.up && this.first === false) {
      if (this.notifications) {
        let notificationMessage = this.domain + (data.up ? ' is back up!' : ' has gone down!')
        this.notification = new this.window.Notification(notificationMessage)
      }
    }
    if (this.first) this.first = false
  }
}

module.exports = Notifications
