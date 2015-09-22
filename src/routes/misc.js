var express	 = require('express')
, broker		 = require('../helpers/broker')
, apps 	 	 = require('./apps')
, users 	 = require('./users')
, spawn		 = require('child_process').spawn
, config 	 = require('../../config')
, activities = require('./activities')
, asciiTable = require('ascii-table')

var router = express.Router()

router.get('/config', function (req, res) {
	res.json(config)
})

router.put('/update', function (req, res) {
	broker.emit('warning', 'Updating dashboard to last version.')
	child = spawn('git', ['pull'])
  //child management
  child.stdout.on('data', function (data) {
    broker.emit('stdout', '%s', data)
  })

  child.stderr.on('data', function (data) {
    broker.emit('stderr', '%s', data)
  })

  child.on('close', function (code) {
    if(code === 0)
     broker.emit('success', 'Done! You will have to reset if there are any changes')
   else
     broker.emit('stderr', 'Could not update the dashboard')

   console.log('child process exited with code %s', code)
 })

  child.on('error', function (code) {
    broker.emit('stderr', '%s', code)
  })

  res.status("304")
})

router.get('/routes', function (req, res) {
  var stack = [].concat(
    activities.stack, apps.stack, users.stack, router.stack)

  if (req.query.format !== 'plain') {
    res.json(stack)

  } else {
    var table = new asciiTable('xway API')
    table.setHeading('Path', 'Method')
    stack.forEach(function(s) {
      if (s.route !== undefined)
        table.addRow(s.route.path, 
          Object.keys(s.route.methods)[0])
    })

    res.header("Content-Type", "text/plain")
    res.end(table.toString() + '\n')
  }
})


module.exports = router