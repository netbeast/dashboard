
require('dotenv').load() // carga variables de entorno
process.env.NETBEAST = 'localhost:' + process.env.PORT

var should = require('chai').should()
var expect = require('chai').expect
var netbeast = require('netbeast')
var mqtt = require('mqtt')
var http = require('http')
var request = require('request')

console.log('ws://' + process.env.NETBEAST)

describe('MQTT methods', function () {

  var body = 'body'
  var title = 'title'

  it('send error notification to dashboard', function (done) {
    var client = mqtt.connect('ws://' + process.env.NETBEAST)
    client.on('connect', function () {
      client.subscribe('netbeast/push')
      netbeast().error(body, title)
    })

    client.on('message', function (topic, message) {
      message = JSON.parse(message.toString())

      if (message.emphasis === 'error' && message.body === body && message.title === title) {
        done()
      }
    })
  })

  it('send info notification to dashboard', function (done) {
    var client = mqtt.connect('ws://' + process.env.NETBEAST)
    client.on('connect', function () {
      client.subscribe('netbeast/push')
      netbeast().info(body, title)
    })

    client.on('message', function (topic, message) {
      message = JSON.parse(message.toString())

      if (message.emphasis === 'info' && message.body === body && message.title === title) {
        done()
      }
    })
  }),

  it('send success notification to dashboard', function (done) {
    var client = mqtt.connect('ws://' + process.env.NETBEAST)
    client.on('connect', function () {
      client.subscribe('netbeast/push')
      netbeast().success(body, title)
    })

    client.on('message', function (topic, message) {
      message = JSON.parse(message.toString())

      if (message.emphasis === 'success' && message.body === body && message.title === title) {
        done()
      }
    })
  }),

  it('send warning notification to dashboard', function (done) {
    var client = mqtt.connect('ws://' + process.env.NETBEAST)
    client.on('connect', function () {
      client.subscribe('netbeast/push')
      netbeast().warning(body, title)
    })

    client.on('message', function (topic, message) {
      message = JSON.parse(message.toString())

      if (message.emphasis === 'warning' && message.body === body && message.title === title) {
        done()
      }
    })
  })
})

describe('Find Method', function () {
  var a = netbeast().find()
  it('return the IP address and the port', function (done) {
    a.then(function (ip, port) {
      if (ip) {
        done()
      }
    })
  })
})

/*
describe('Request methods', function () {
  http.createServer(function (request, response) {
    request.on('data', function (message) {
      response.write(message)
    })
  }).listen(8080)

  it('create method', function (done) {
    var resource = {
      app: 'app',
      topic: 'topic',
      location: 'loc',
      groupname: 'group',
      hook: 'hook'
    }
    netbeast().create(resource)
    done()
  })

  it('delete method', function (message, done) {
    const queryString = normalizeArguments(message)
    console.log(queryString)
    var res = request.del('http://localhost:8080').query(queryString).promise()
    if (res.body === netbeast().delete(message)) {
      done()
    }
  })
})
*/
