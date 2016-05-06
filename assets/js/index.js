var $urlInput = $('.js-url-input')
  , $urlInputValue = $urlInput.val()
  , $urlSubmit = $('.js-url-submit')
  , $body = $('body')
  , states =
    { success: $('<div class="alert alert-success"><strong>Hooray!</strong> It\'s up!</div>')
    , fail: $('<div class="alert alert-danger"><strong>Arsebiscuits!</strong> It\'s down!</div>')
    , checking: $('<div class="alert alert-info"><i class="fa fa-repeat fa-spin"></i> Checking...</div>')
    }
  , Notification = require('./notification')
  , notification = new Notification(window)
  , Socket = require('./socket')
  , socket = new Socket(window.io)
  , result = null

/*** Event listeners***/

$urlInput.bind('input propertychange', function () {
  $urlInputValue = $urlInput.val()
  valueCheck()
})

$('.js-url-submit').on('click', performFirstTest)

if (window.location.pathname.substr(1).length) {
  var path = window.location.pathname.substr(1).split('/')
  $('#domain').val(path[0])
  socket.testDomain(path[0])
}

/*** Event handlers ***/

$urlSubmit.on('click', function () {
  $body.addClass('is-submitted')
})

$urlInput.on('keydown', function (e) {
  var code = e.keyCode || e.which
  if (code === 13) $body.addClass('is-submitted')
})

$body.on('itsback:change', function (event, data) {
  processResult(data.state)
  notification.notifyStatusChange(data, result)
  $('#result').fadeOut('fast', function () {
    $('#result').html((data.state ? states.success : states.fail)).fadeIn('fast')
  })
})

$body.on('itsback:checking', function () {
  $('#result').fadeOut('fast', function () {
    $('#result').html(states.checking).fadeIn('fast')
  })
})

$body.on('itsback:serverDomain', function (domain) {
  notification.setDomain(domain)
})

$('.js-url-input').on('keydown', function (e) {
  var code = e.keyCode || e.which
  if (code === 13) performFirstTest(e)
})

/*** Helper Functions ***/

function valueCheck () {
  if ($urlInputValue === '') {
    $urlInput.removeClass('not-empty')
  } else {
    $urlInput.addClass('not-empty')
  }
}

function performFirstTest (e) {
  e.preventDefault()
  socket.testDomain($('.js-url-input').val())
  notification.refreshState()
  notification.requestPermission()
}

function updateIcon (state) {
  var link = document.createElement('link')
  link.type = 'image/x-icon'
  link.rel = 'shortcut icon'
  link.href = '/assets/imgs/' + (state ? 'up' : 'down') + '.ico'
  document.getElementsByTagName('head')[0].appendChild(link)
}

function processResult (success) {
  document.title = 'It\'s ' + (success ? 'back!' : 'down :(')
  updateIcon(success)
  if (result === success) return
  result = success
}
