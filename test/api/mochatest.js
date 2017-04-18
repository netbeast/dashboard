require('dotenv').load() // carga variables de entorno
const DASHBOARD_URL = 'localhost:' + process.env.PORT
process.env.NETBEAST = 'localhost:40123'
var netbeast = require('netbeast')

var should = require('chai').should()
var expect = require('chai').expect
var mqtt = require('mqtt')
var http = require('http')
var request = require('request')
var net = require('net')

console.log('ws://' + DASHBOARD_URL)

describe('MQTT methods', function () {

  var body = 'body'
  var title = 'title'

  it('send error notification to dashboard', function (done) {
    var client = mqtt.connect('ws://' + DASHBOARD_URL)
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
    var client = mqtt.connect('ws://' + DASHBOARD_URL)
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
    var client = mqtt.connect('ws://' + DASHBOARD_URL)
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
    var client = mqtt.connect('ws://' + DASHBOARD_URL)
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

describe('Request methods', function () {

  it('create method', function (done) {
    var resource = {
      app: 'app',
      hook: 'hook'
    }
    netbeast('topic').create(resource)
    .then(function (resp) {
      var received = JSON.parse(resp.body)
      //
      expect(resource).to.eql(received)
        done()
      }).catch(function (err) {
        console.log('Error: ' + err)
      })
  })

  it('delete method', function (done) {
    netbeast('topic').delete()
    .then(function (data) {
      var received = data.body.url.split('topic=')
      expect(data.body.method).to.eql('DELETE')
      expect(received[1]).to.eql('topic')
      done()
    })
  })

  it('Create Custom Scene method', function (done) {
    var newscene = [ {
      id: 1,
      status: {
        power: true,
        brightness: 99,
        hue: 200,
        saturation: 80
      }
    },
      {
        id: 8,
        status: {
          volume: 90,
          track: 'url-track'
        }
      }]
    netbeast('topic').createCustomScene(newscene)
    .then(function (data) {
      for (var i = 0; i < data.length; i++) {
        var received = JSON.parse(data[i].body.body)
        expect(newscene[i]).to.eql(received)
      }
      done()
    })
  })

  it('delete Device Scene method', function (done) {
    netbeast('topic').deleteDeviceScene('id')
    .then(function (data) {
      var received = data.body.url.split('id=')
      var receivedaux = received[1].split('&')
      expect(data.body.method).to.eql('DELETE')
      expect(receivedaux[0]).to.eql('topic')
      expect(received[2]).to.eql('id')
      done()
    })
  })

  it('delete By Id method', function (done) {
    netbeast().deleteById('id')
    .then(function (data) {
      var received = data.body.url.split('id=')
      expect(data.body.method).to.eql('DELETE')
      expect(received[1]).to.eql('id')
      done()
    })
  })

  it('delete Scene method', function (done) {
    netbeast('topic').deleteScene()
    .then(function (data) {
      var received = data.body.url.split('sceneid=')
      expect(data.body.method).to.eql('DELETE')
      expect(received[1]).to.eql('topic')
      done()
    })
  })
})
