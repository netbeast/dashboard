#!/usr/bin/env node

var netbeast = require('netbeast')
var express = require('express')
var cmd = require('commander')

cmd
.version('0.1.42')
.option('-p, --port <n>', 'Port to start the HTTP server', parseInt)
.parse(process.argv)

var app = express()

/*
* Create here your API routes
* app.get(...), app.post(...), app.put(...), app.delete(...)
*/

/*
* Discover your resources / scan the network 
* And declare your routes into the API
*/

var server = app.listen(cmd.port || 4000, function () {
  console.log('Netbeast plugin started on %s:%s',
  server.address().address,
  server.address().port)
})
