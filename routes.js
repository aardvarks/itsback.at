var template = require('jade').compileFile(__dirname + '/source/templates/homepage.jade')

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