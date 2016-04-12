
// load environment variables
require('dotenv').load()

var path = require('path')

var fs = require('fs-extra')
var logger = require('morgan')
var favicon = require('serve-favicon')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var express = require('express')
var chalk = require('chalk')

var app = module.exports = express()

app.use(logger('dev', {
  // skip: function (req, res) { return res.statusCode < 400 }
}))

app.use(require('./middleware/cors'))
app.use(require('./middleware/proxy'))

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(favicon(path.join(process.env.PUBLIC_DIR, 'img/favicon.png')))

app.use('/api', require('./routes'))

app.use(express.static(process.env.PUBLIC_DIR))
app.get('*', function (req, res) {
  res.sendFile(path.resolve(process.env.PUBLIC_DIR, 'index.html'))
})

// Handle errors
app.use(function (err, req, res, next) {
  console.log('\n' + chalk.red('Exception in routes stack:'))
  console.error(err.stack)
  if (!err.statusCode || err.statusCode === 500) {
    if (process.env.ERR_REPORT) fs.appendFile('./.errorlog', err.stack)
  }
  res.status(err.statusCode || 500).send(err.message)
})
