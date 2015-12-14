var express	 = require('express')
var spawn		 = require('child_process').spawn
var AsciiTable = require('ascii-table')

var apps 	 	 = require('./apps')
var users 	 = require('./users')
var activities = require('./activities')
var config 	 = require('../../config')
var broker		 = require('../helpers/broker')

var router = express.Router()

router.get('/config', function (req, res) {
  res.json(config)
})

router.put('/update', function (req, res) {
  broker.warning('Updating dashboard to last version')
  var child = spawn('git', ['pull', 'origin', 'master'])
  // child management
  child.stdout.on('data', function (data) {
    broker.info('data')
  })

  child.stderr.on('data', function (data) {
    broker.error(data)
  })

  child.on('close', function (code) {
    if (code === 0) {
      broker.success('Done! You will have to reset if there are any changes')
    } else {
      broker.error('Could not update the dashboard')
    }
    console.log('child process exited with code %s', code)
  })

  child.on('error', function (code) {
    broker.error(code)
  })

  res.status('304').end()
})

router.get('/routes', function (req, res) {
  var stack = [].concat(activities.stack, apps.stack, users.stack, router.stack)

  if (req.query.format !== 'plain') {
    res.json(stack)
  } else {
    var table = new AsciiTable('Netbeast dashboard API')
    table.setHeading('Path', 'Method')
    stack.forEach(function (s) {
      if (s.route !== undefined) {
        table.addRow(s.route.path, Object.keys(s.route.methods)[0])
      }
    })
    res.header('Content-Type', 'text/plain')
    res.end(table.toString() + '\n')
  }
})

module.exports = router
