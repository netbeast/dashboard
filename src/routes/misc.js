var express = require('express')
var spawn = require('child_process').spawn

var apps = require('./apps')
var activities = require('./activities')
var broker = require('../helpers/broker')

var router = express.Router()

router.get('/config', function (req, res) {
  res.json(process.env)
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
      broker.success('Done! You will have to reset your Netbeast')
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
  const stack = [].concat(activities.stack, apps.stack, users.stack, router.stack)
  res.json(stack)
})

module.exports = router
