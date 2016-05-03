var $urlInput = $('.js-url-input')
  , $urlInputValue = $urlInput.val()
  , $urlSubmit = $('.js-url-submit')
  , $body = $('body')
  , socketInit = require('./socket')

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
  if (code === 13) {
    $body.addClass('is-submitted')
  }
})
