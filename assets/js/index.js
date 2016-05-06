var $urlInput = $('.js-url-input')
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
  , Application = require('./application')
  , application = new Application(document, socket, notification)

function updateResult (message) {
  $('#result').fadeOut('fast', () => {
    $('#result').html(message).fadeIn('fast')
  })
}

function enterPressed (e) {
  var code = e.keyCode || e.which
  return code === 13
}

$urlInput.bind('input propertychange', () => {
  var $urlInputValue = $urlInput.val()
    , applyState = ($urlInputValue === '') ? 'removeClass' : 'addClass'
  $urlInput[applyState]('not-empty')
})

$('.js-url-submit').on('click', application.performFirstTest)

application.initialLoad((path) => {
  if (path) $('#domain').val(path)
})

$urlSubmit.on('click', () => {
  $body.addClass('is-submitted')
})

$urlInput.on('keydown', (e) => {
  if (enterPressed(e)) {
    $body.addClass('is-submitted')
    application.performFirstTest(e)
  }
})

$body.on('itsback:change', (event, data) => {
  application.processResult(data.state)
  notification.notifyStatusChange(data, application.result)
  updateResult(data.state ? states.success : states.fail)
})

$body.on('itsback:checking', updateResult.bind(null, states.checking))

$body.on('itsback:serverDomain', notification.setDomain)
