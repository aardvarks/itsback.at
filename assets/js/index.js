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
  , application = new Application(window, socket, notification)
  , serverDomain

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

$('.js-report-domain').on('click', () => {
  socket.reportDomain(serverDomain)
})

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
  if (data.watching === 1) {
    data.watching = 'You are the only one watching! Aren\'t you special :P'
  } else {
    $('.js-watching').text(data.watching + 'people watching! You aren\'t alone! :D')
  }

  console.log(data.reported)
  if (data.reported > 10) {
    $('.js-reported').text('Lots of people have said this domain won\'t work with itsback.at, so you might want to go back to F5F5F5F5F5F5 :(')
    $('.js-report-domain').hide()
  } else if (data.reported > 1) {
    $('.js-reported').text('A couple of people don\'t think itsback.at works with this domain :S')
  } else {
    $('.js-reported').text('')
  }

  application.processResult(data.state)
  notification.notifyStatusChange(data, application.result)
  updateResult(data.state ? states.success : states.fail)
})

$body.on('itsback:checking', updateResult.bind(null, states.checking))

$body.on('itsback:reported', () => {
  $('.js-report-domain').hide()
})

$('.js-report-domain').hide()

$body.on('itsback:serverDomain', (event, domain) => {
  $('.js-report-domain').show()
  serverDomain = domain
  notification.setDomain(domain)
})
