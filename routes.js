var template = require('jade').compileFile(__dirname + '/assets/templates/index.jade')

module.exports = (app) => {
  app.get('*', (req, res, next) => {
    try {
      var html = template({ title: 'Home', inputUrl: req.params[0].slice(1) })
      res.send(html)
    } catch (e) {
      next(e)
    }
  })

  return app
}
