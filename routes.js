'use strict'

let template = require('jade').compileFile(__dirname + '/assets/templates/index.jade')

module.exports = (app) => {

  app.get('/users', (req, res, next) => {
    try {
      app.emit('users', res)
    } catch (e) {
      next(e)
    }
  })

  app.get('*', (req, res, next) => {
    try {
      let html = template({ title: 'Home', inputUrl: req.params[0].slice(1) })
      res.send(html)
    } catch (e) {
      next(e)
    }
  })

  return app
}
