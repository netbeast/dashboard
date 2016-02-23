var should = require('chai').should()
var expect = require('chai').expect
var netbeast = require('netbeast')
var mqtt = require('mqtt')

describe('error', function (body, title) {
  it('notification of error to dashboard', function () {
    expect(netbeast().error(body, title)).to.satisfy(function () {
      var client = mqtt.connect('ws://NETBEAST_IP:PORT')
      client.subscribe('netbeast/push')
      client.on('message', function (message) {
        if (message.emphasis === 'error') {
          if (message.body === body) {
            if (message.title === title) {
              console.log('hola')
            }
          }
        }
      })
    })
  })
})

describe('warning', function (body, title) {
  it('notification of warning to dashboard', function () {
    expect(netbeast().error(body, title)).to.satisfy(function () {
      var client = mqtt.connect('ws://NETBEAST_IP:PORT')
      client.subscribe('netbeast/push')
      client.on('message', function (message) {
        if (message.emphasis === 'warning') {
          if (message.body === body) {
            if (message.title === title) {
              console.log('hola')
            }
          }
        }
      })
    })
  })
})


describe('info', function (body, title) {
  it('notification of info to dashboard', function () {
    expect(netbeast().error(body, title)).to.satisfy(function () {
      var client = mqtt.connect('ws://NETBEAST_IP:PORT')
      client.subscribe('netbeast/push')
      client.on('message', function (message) {
        if (message.emphasis === 'info') {
          if (message.body === body) {
            if (message.title === title) {
              console.log('hola')
            }
          }
        }
      })
    })
  })
})
