var should = require('chai').should()
var expect = require('chai').expect
var netbeast = require('netbeast')
var mqtt = require('mqtt')
var http = require('http')
var request = require('request')

describe('MQTT methods', function () {

  var body = 'body'
  var title = 'title'

it('send error notification to dashboard', function (done) {

  var client = mqtt.connect('ws://' + process.env.NETBEAST)

  client.subscribe('netbeast/push')
  client.on('message', function (message) {
    if (message.emphasis === 'error' && message.body === body && message.title === title) {
      done()
    }
    netbeast().error(body, title)
  })
}),

it('send info notification to dashboard', function (done) {
  var client = mqtt.connect('ws://' + process.env.NETBEAST)
  client.subscribe('netbeast/push')
  client.on('message', function (message) {
    if (message.emphasis === 'error' && message.body === body && message.title === title) {
      done()
    }
    netbeast().error(body, title)
  })
}),

it('send success notification to dashboard', function (done) {
  var client = mqtt.connect('ws://' + process.env.NETBEAST)
  client.subscribe('netbeast/push')
  client.on('message', function (message) {
    if (message.emphasis === 'error' && message.body === body && message.title === title) {
      done()
    }
    netbeast().error(body, title)
  })
}),

it('send warning notification to dashboard', function (done) {
  var client = mqtt.connect('ws://' + process.env.NETBEAST)
  client.subscribe('netbeast/push')
  client.on('message', function (message) {
    if (message.emphasis === 'error' && message.body === body && message.title === title) {
      done()
    }
    netbeast().error(body, title)
  })
})
})

describe('Find Method', function () {
  it('return the IP address and the port', function (done) {
    expect(netbeast().find()).to.have.all.keys(
      'adress', 'port'
    )
    done()
  })
})

describe('Request methods', function () {
  http.createServe(function (request, response) {
    request.on('data', function (message) {
      response.write(message)
    })
  }).listen(8080)
  it('delete method', function (message, done) {
    const queryString = queryCustom(normalizeArguments(message))
    var res = request.del('http://localhost:8080').query(message).promise()
    if (res.body === netbeast().delete(message)) {
      done()
    }
  })
})
