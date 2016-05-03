var $urlInput = $('.js-url-input')
  , $urlInputValue = $urlInput.val()
  , $urlSubmit = $('.js-url-submit')
  , $body = $('body')
  , socketInit = require('./socket')
  , states =
    { success: $('<div class="alert alert-success"><strong>Hooray!</strong> It\'s up!</div>')
    , fail: $('<div class="alert alert-danger"><strong>Arsebiscuits!</strong> It\'s down!</div>')
    , checking: $('<div class="alert alert-info"><i class="fa fa-repeat fa-spin"></i> Checking...</div>')
    }

socketInit()
valueCheck()

$urlInput.bind('input propertychange', function () {
  $urlInputValue = $urlInput.val()
  valueCheck()
})

function valueCheck () {
  if ($urlInputValue === '') {
    $urlInput.removeClass('not-empty')
  } else {
    $urlInput.addClass('not-empty')
  }
}

$urlSubmit.on('click', function () {
  $body.addClass('is-submitted')
})

$urlInput.on('keydown', function (e) {
  var code = e.keyCode || e.which
  if (code === 13) $body.addClass('is-submitted')
})

$body.on('itsback:change', function (event, data) {
  $('#result').fadeOut('fast', function () {
    $('#result').html((data.up ? states.success : states.fail)).fadeIn('fast')
  })
})

$body.on('itsback:checking', function () {
  $('#result').fadeOut('fast', function () {
    $('#result').html(states.checking).fadeIn('fast')
  })
})
