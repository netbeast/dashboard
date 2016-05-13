#!/usr/bin/env node

var netbeast = require('netbeast')
var express = require('express')
var cmd = require('commander') // reads --port from command line

cmd
.version('0.1.42')
.option('-p, --port <n>', 'Port to start the HTTP server', parseInt)
.parse(process.argv)

var app = express()

/*
* Discover your resources / scan the network 
* And declare your routes into the API
*/

app.get('/discover', function () {
	/* TODO, implement discovery */

	/* for each device */
	netbeast('topic').create({ app: 'my-first-plugin', hook: 'DEVICE_ID' })
	/* end of for */
	
	/* or */
	/* Register all device together and delete the resources no longer available */
	netbeast('topic').udateDB({ app: 'my-first-plugin', hook: ['DEVICE1_ID', 'DEVICE2_ID', 'DEVICE3_ID', 'DEVICE4_ID'] })
})

/*
* Create here your API routes
* app.get(...), app.post(...), app.put(...), app.delete(...)
*/

app.get('/:device_id', function (req, res) {
	// id of the device the dashboard wants
	// << req.params.device_id >>
	// dashboard will do GET on this route when
	// netbeast('topic').get({})

	/* TODO: Return device values from req.query */

	// res.json({ YOUR_PLUGIN_DATA })
})

app.post('/:device_id', function (req, res) {
	// id of the device the dashboard wants
	// << req.params.device_id >>
	// dashboard will do POST on this route when
	// netbeast('topic').set({})

	/* TODO: Change device values from req.body */

	// res.json({ YOUR_PLUGIN_DATA })
})


var server = app.listen(cmd.port || 4000, function () {
  console.log('Netbeast plugin started on %s:%s',
  server.address().address,
  server.address().port)
})
