'use strict'

let express = require('express')
  , logger = require('morgan')
  , app = express()
  , addRoutes = require('./routes')
  , attachSocket = require('./sockets')
  , port = process.env.PORT || 8082
  , path = require('path')

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'assets', 'build')))
addRoutes(app)

let server = app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
  attachSocket(app, server)
})
