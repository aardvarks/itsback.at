var template = require('jade').compileFile(__dirname + '/source/templates/index.jade')

module.exports = (app) => {
  app.get('/', (req, res, next) => {
    try {
      var html = template({ title: 'Home' })
      res.send(html)
    } catch (e) {
      next(e)
    }
  })

  return app
}
