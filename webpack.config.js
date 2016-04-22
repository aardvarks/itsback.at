'use strict'

const path = require('path')

module.exports = {
  entry: [
    './source/js/index'
  ]
, output: {
    path: path.join(__dirname, 'static', 'js')
  , filename: 'bundle.js'
  , publicPath: '/static/js/'
  }
, module: {
    loaders: [
      { test: /\.js$/
      , loader: 'babel-loader'
      , query: {
          presets: [ 'es2015' ]
        }
      , include: path.join(__dirname, 'source/js')
      }
    ]
  }
}
