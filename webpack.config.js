'use strict'

const path = require('path')

module.exports = {
  entry: [
    './assets/js/index'
  ]
, output: {
    path: path.join(__dirname, 'assets', 'build', 'js')
  , filename: 'bundle.js'
  , publicPath: '/assets/build/js/'
  }
, module: {
    loaders: [
      { test: /\.js$/
      , loader: 'babel-loader'
      , query: {
          presets: [ 'es2015' ]
        }
      , include: path.join(__dirname, 'assets/js')
      }
    ]
  }
}
