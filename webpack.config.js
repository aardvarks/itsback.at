'use strict'

const path = require('path')

module.exports = {
  entry: [
    './browser/index'
  ]
, output: {
    path: path.join(__dirname, 'public', 'js')
  , filename: 'bundle.js'
  , publicPath: '/public/js/'
  }
, module: {
    loaders: [
      { test: /\.js$/
      , loader: 'babel-loader'
      , query: {
          presets: [ 'es2015' ]
        }
      , include: path.join(__dirname, 'browser')
      }
    ]
  }
}
