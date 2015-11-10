var fs = require('fs');
var demand = require('must');
var http = require('http');
var Mitm = require('mitm');

var Wemo = require('../index');
var deviceInfo = require('./fixtures/deviceinfo.json');

describe('Wemo', function() {

  it('must expose a public constructor', function() {
    Wemo.must.be.a.function();
  });

  it('must listen on a port', function(done) {
    var wemo = new Wemo();
    var address = wemo.getCallbackURL();
    http.get(address, function(res) {
      res.statusCode.must.equal(404);
      done();
    });
  });

});

describe('WemoClient', function() {

  var client;
  var mitm;

  beforeEach(function() {
    mitm = Mitm();
    client = (new Wemo()).client(deviceInfo);
  });

  afterEach(function() {
    mitm.disable();
  });

  describe('#soapAction(serviceType, action, body, cb)', function() {
    it('must use the correct endpoint', function(done) {
      mitm.on('request', function(req, res) {
        req.url.must.be('/upnp/control/deviceinfo1');
        req.method.must.be('POST');
        res.statusCode = 200;
        res.end();
      });
      client.soapAction('urn:Belkin:service:deviceinfo:1', 'TheAction', 'TheBody', done);
    });

    it('must send a soap header', function(done) {
      mitm.on('request', function(req, res) {
        req.headers.soapaction.must.be('"urn:Belkin:service:deviceinfo:1#TheAction"');
        res.statusCode = 200;
        res.end();
      });
      client.soapAction('urn:Belkin:service:deviceinfo:1', 'TheAction', 'TheBody', done);
    });

    it('must send a valid body', function(done) {
      mitm.on('request', function(req, res) {
        var data = '';
        req.on('data', function(chunk) { data += chunk; });
        req.on('end', function() {
          data.must.contain('<u:TheAction xmlns:u="urn:Belkin:service:deviceinfo:1">');
          data.must.contain('TheBody');
        });
        res.statusCode = 200;
        res.end();
      });
      client.soapAction('urn:Belkin:service:deviceinfo:1', 'TheAction', 'TheBody', done);
    });
  });

  describe('#setBinaryState(val)', function() {
    it('must send a BinaryState request', function(done) {
      mitm.on('request', function(req, res) {
        var data = '';
        req.on('data', function(chunk) { data += chunk; });
        req.on('end', function() {
          data.must.contain('<u:SetBinaryState xmlns:u="urn:Belkin:service:basicevent:1">');
          data.must.contain('<BinaryState>1</BinaryState>');
        });
        req.url.must.equal('/upnp/control/basicevent1');
        res.statusCode = 200;
        res.end();
      });
      client.setBinaryState(1, done);
    });
  });

  describe('#getEndDevices(err, cb)', function() {
    it('must handle grouped bulbs', function(done) {
      mitm.on('request', function(req, res) {
        var fixture = fs.readFileSync(__dirname + '/fixtures/getEndDevices_group.xml');
        res.write(fixture);
        res.end();
      });
      client.getEndDevices(function(err, endDevices) {
        demand(err).to.be.falsy();
        demand(endDevices).to.be.an.array();
        demand(endDevices).to.have.length(2);
        endDevices[0].friendlyName.must.be('First');
        endDevices[1].friendlyName.must.be('Second');
        done();
      });
    });

    it('must handle single bulbs', function(done) {
      mitm.on('request', function(req, res) {
        var fixture = fs.readFileSync(__dirname + '/fixtures/getEndDevices_single.xml');
        res.write(fixture);
        res.end();
      });
      client.getEndDevices(function(err, endDevices) {
        demand(err).to.be.falsy();
        demand(endDevices).to.be.an.array();
        demand(endDevices).to.have.length(2);
        endDevices[0].friendlyName.must.be('First');
        endDevices[1].friendlyName.must.be('Second');
        done();
      });
    });
  });

});
