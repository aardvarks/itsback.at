'use strict'

const url = require('url')

function getUrl (dataUrl) {
  if (dataUrl.split('://').length === 1 || dataUrl.startsWith('://')) {
    dataUrl = `http://${dataUrl.replace('://', '')}`
  }
  return dataUrl
}

let findUrlKey = (rawUrl) => {
  rawUrl = getUrl(rawUrl)

  let inputUrl = url.parse(rawUrl)
    , domain = inputUrl.hostname || inputUrl.pathname.split('/')[0]
    , protocol = inputUrl.protocol || 'http'
    , port = inputUrl.port || (protocol.indexOf('https') > -1 ? '443' : '80')

  return domain + ':' + port
}

module.exports = findUrlKey
