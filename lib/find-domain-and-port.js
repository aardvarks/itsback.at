'use strict'

const url = require('url')

let findDomainAndPort = (data) => {
  let inputUrl = url.parse(data.url)
    , domain = inputUrl.hostname || inputUrl.pathname.split('/')[0]
    , protocol = inputUrl.protocol || 'http'
    , port = inputUrl.port || (protocol.indexOf('https') > -1 ? '443' : '80')

  if (inputUrl.protocol) {
    if (inputUrl.href.indexOf(inputUrl.protocol.split(':')[0]) === 0 && inputUrl.hostname === inputUrl.href.split(':')[1].split('/')[0]) {
      domain = inputUrl.protocol.split(':')[0]
      port = inputUrl.hostname
    }
  }

  return { domain, port }
}

module.exports = findDomainAndPort
