require('../helper')
var moduleVersion = require('../../package.json').version

var expect = require('chai').expect

var Client = require('../../').Client

describe('Client', function () {
  context('when receiving a reply to M-SEARCH', function () {
    it('emit a parsed object', function (done) {
      var client = new Client(null, this.getFakeSocket())

      var response = [
        'HTTP/1.1 200 OK',
        'ST: uuid:f40c2981-7329-40b7-8b04-27f187aecfb5',
        'USN: uuid:f40c2981-7329-40b7-8b04-27f187aecfb5',
        'LOCATION: http://0.0.0.0:10000/upnp/desc.html',
        'CACHE-CONTROL: max-age=1800',
        'DATE: Fri, 30 May 2014 15:07:26 GMT',
        'SERVER: node.js/0.10.28 UPnP/1.1 node-ssdp/' + moduleVersion,
        'EXT: ' // note the space
      ]

      client.on('response', function (headers, code, rinfo) {
        expect(code).to.equal(200)

        var expected = {
          'ST': 'uuid:f40c2981-7329-40b7-8b04-27f187aecfb5',
          'USN': 'uuid:f40c2981-7329-40b7-8b04-27f187aecfb5',
          'LOCATION': 'http://0.0.0.0:10000/upnp/desc.html',
          'CACHE-CONTROL': 'max-age=1800',
          //'DATE': 'Fri, 30 May 2014 15:07:26 GMT',
          'SERVER': 'node.js/0.10.28 UPnP/1.1 node-ssdp/' + moduleVersion,
          'EXT': ''
        }

        var date = headers.DATE

        delete headers.DATE

        expect(expected).to.deep.equal(headers)
        expect(date).to.match(/\w+, \d+ \w+ \d+ [\d:]+ GMT/)

        done()
      })

      client.start()

      client.sock.emit('message', Buffer(response.join('\r\n')))
    })
  })
})
