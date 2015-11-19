#!/usr/bin/env node
/* global describe, it*/

var request = require('request')
var chai = require('chai')
var should = chai.should()
var expect = chai.expect

var config = require('config')

const URL = 'http://localhost:' + config.port

console.log(URL + '/resources')

describe.skip('RESTful Resources API', function () {
  it('#POST should insert a new action in db', function (done) {
    request.post({url: URL + '/resources',
    json: {
      app: 'app',
      location: 'location',
      topic: 'topic',
      groupname: 'group',
      hook: 'hook'
    }},
    function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(204)
      done()
    })
  })

  it('#GET should return all specified actions from db', function (done) {
    var q = 'app=app&topic=topic'
    request.get(URL + '/resources?' + q, function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(200)
      body = JSON.parse(body)
      body.data.should.be.an('Array')
      body.data.forEach(function (item) {
        expect(item).to.have.all.keys('id', 'app', 'topic', 'location', 'groupname', 'hook')
      })
      done()
    })
  })

  it('#UPDATE should update the speified action from db', function (done) {
    var q = 'app=app&topic=topic'
    request.patch({url: URL + '/resources?' + q, json: {app: 'app2'}}, function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(204)
      expect(body).to.be.empty
      done()
    })
  })

  it('#DELETE should delete the speified action from db', function (done) {
    var q = 'hook=hook'
    request.del(URL + '/resources?' + q, function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(204)
      expect(body).to.be.empty
      done()
    })
  })
})
