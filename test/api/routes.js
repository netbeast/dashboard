/* global describe, it*/
require('dotenv').load()

var request = require('request')
var chai = require('chai')
var should = chai.should()
var expect = chai.expect

const URL = 'http://localhost:' + process.env.PORT + '/api'

console.log(URL + '/resources')

describe('RESTful Resources API', function () {
  it('should insert a new action in db', function (done) {
    request.post({
      url: URL + '/resources',
      json: { app: 'app', location: 'location', topic: 'topic', groupname: 'group', hook: 'hook'
    }},
    function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(204)
      done()
    })
  })

  it('should return all specified actions from db', function (done) {
    var q = 'app=app&topic=topic'
    request.get(URL + '/resources?' + q, function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(200)
      body = JSON.parse(body)
      body.should.be.an('Array')
      body.forEach(function (item) {
        expect(item).to.have.all.keys('id', 'app', 'topic', 'location', 'groupname', 'hook', 'mac_or_ip')
      })
      done()
    })
  })

  it('should update the speified action from db', function (done) {
    var q = 'app=app&topic=topic'
    request.patch({url: URL + '/resources?' + q, json: {app: 'app2'}}, function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(204)
      expect(body).to.be.empty
      done()
    })
  })

  it('should delete the speified action from db', function (done) {
    var q = 'hook=hook'
    request.del(URL + '/resources?' + q, function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(204)
      expect(body).to.be.empty
      done()
    })
  })
})
