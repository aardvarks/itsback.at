var express = require('express')
  , logger = require('morgan')
  , app = express()
  , addRoutes = require('./routes')
  , attachSocket = require('./sockets')
  , port = process.env.PORT || 3000

app.use(logger('dev'))
app.use(express.static(__dirname + '/static'))
addRoutes(app)

var server = app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
  attachSocket(server)
})
