module.exports = function () {
  var domainInput = $('.js-url-input')
    , Notifications = require('./notifications')
    , notifications = new Notifications(window)

  domainInput.focus()
  notifications.getPermissions()

  function updateIcon (up) {
    var link = document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = '/assets/imgs/' + (up ? 'up' : 'down') + '.ico'
    document.getElementsByTagName('head')[0].appendChild(link)
  }

  var socket = window.io.connect('/')
    , sessionID
    , usePath
    , result = null

  socket.on('id', function (data) {
    sessionID = data.id
  })

  function testDomain (domain) {
    socket.emit('domainValidate', { 'domain': domain, 'path': usePath, 'id': sessionID })
    socket.on('clientDomain', function (data) {
      notifications.setDomain(data.domain)
    })
    result = null
    $('body').trigger('itsback:checking')
    socket.emit('domainSubmit', { 'domain': domain, 'id': sessionID })
  }

  function processResult (success) {
    document.title = 'It\'s ' + (success ? 'back!' : 'down :(')
    updateIcon(success)
    if (result === success) return
    result = success
  }

  socket.on('result', function (data) {
    $('body').trigger('itsback:change', data)
    $('body').trigger('itsback:' + (data.up ? 'up' : 'down'), data)
    notifications.notifyStatusChange(data, result)
    processResult(data.up)
  })

  function performFirstTest (e) {
    e.preventDefault()
    testDomain($('.js-url-input').val())
    notifications.refreshState()
    notifications.requestPermission()
  }

  $('.js-url-submit').on('click', performFirstTest)

  $('.js-url-input').on('keydown', function (e) {
    var code = e.keyCode || e.which
    if (code === 13) performFirstTest(e)
  })

  $('#usePath').on('change', function () { usePath = this.checked })

  if (window.location.pathname.substr(1).length) {
    var path = window.location.pathname.substr(1).split('/')
    $('#domain').val(path[0])
    testDomain(path[0])
  }
}
