module.exports = function () {
  var domainInput = $('.js-url-input')
    , checking = $('<div class="alert alert-info"><i class="fa fa-repeat fa-spin"></i> Checking...</div>')
    , resultSuccess = $('<div class="alert alert-success"><strong>Hooray!</strong> It\'s up!</div>')
    , resultFail = $('<div class="alert alert-danger"><strong>Arsebiscuits!</strong> It\'s down!</div>')
    , notifications = false

  domainInput.focus()
  getNotifyPerms()

  function updateIcon (up) {
    var link = document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = '/assets/imgs/' + (up ? 'up' : 'down') + '.ico'
    document.getElementsByTagName('head')[0].appendChild(link)
  }

  function getNotifyPerms () {
    if (window.Notification) {
      if (window.Notification.permission === 'granted') {
        notifications = true
      } else {
        window.Notification.requestPermission()
      }
    } else {
      window.alert('Notifications are supported in modern versions of Chrome, Firefox, Opera and Firefox.')
    }
  }

  var socket = window.io.connect('/')
    , sessionID
    , usePath
    , result = null
    , domainSubmitted
    , first = true

  socket.on('id', function (data) {
    sessionID = data.id
  })

  function testDomain (domain) {
    socket.emit('domainVal', { 'domain': domain, 'path': usePath, 'id': sessionID })
    socket.on('theDomain', function (data) {
      domainSubmitted = data.domain
      console.log('Sent: ' + JSON.stringify(data))
    })
    result = null
    $('#result').fadeOut('fast', function () {
      $('#result').html(checking).fadeIn('fast')
      socket.emit('domainSubmit', { 'domain': domain, 'id': sessionID })
    })
  }

  function processResult (success) {
    document.title = 'It\'s ' + (success ? 'back!' : 'down :(')
    updateIcon(success)
    if (result === success) return
    result = success
    $('#result').fadeOut('fast', function () {
      $('#result').html((success ? resultSuccess : resultFail)).fadeIn('fast')
    })
  }

  socket.on('result', function (data) {
    console.log('Received: ' + JSON.stringify(data))
    if (domainSubmitted === data.domain && result !== data.up && first === false) {
      if (notifications) {
        /* eslint-disable */
        var notification = new Notification(domainSubmitted + (data.up ? ' is back up!' : ' has gone down!'))
        /* eslint-enable */
      }
    }
    processResult(data.up)
    first = false
  })

  $('.js-url-submit').on('click', function (e) {
    e.preventDefault()
    testDomain($('.js-url-input').val())
    first = true
    if (window.webkitNotifications) window.webkitNotifications.requestPermission()
  })

  $('.js-url-input').on('keydown', function (e) {
    var code = e.keyCode || e.which
    if (code === 13) {
      e.preventDefault()
      testDomain($('.js-url-input').val())
      first = true
      if (window.webkitNotifications) window.webkitNotifications.requestPermission()
    }
  })

  $('#usePath').on('change', function () { usePath = this.checked })

  if (window.location.pathname.substr(1).length) {
    var path = window.location.pathname.substr(1).split('/')
    $('#domain').val(path[0])
    testDomain(path[0])
  }
}
