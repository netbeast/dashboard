/* global describe, it*/
require('dotenv').load()

var request = require('superagent')
var chai = require('chai')
var should = chai.should()
var expect = chai.expect

const URL = 'http://localhost:' + process.env.PORT + '/api'

console.log(URL + '/resources')

describe('RESTful Resources API', function () {
  it('should insert a new action in db', function (done) {
    var req = request.post(URL + '/resources')
    req.send({ app: 'app', location: 'location', topic: 'topic', groupname: 'group', hook: 'hook' })
      .end(function (err, resp, body) {
        should.not.exist(err)
        resp.statusCode.should.equal(200)
        done()
      })
  })

  it('should return all specified actions from db', function (done) {
    var q = 'app=app&topic=topic'
    request.get(URL + '/resources?' + q).end(function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(200)
      body = resp.body
      body.should.be.an('Array')
      body.forEach(function (item) {
        expect(item).to.have.all.keys('id', 'app', 'topic', 'location', 'groupname', 'hook', 'mac_or_ip')
      })
      done()
    })
  })

  it('should update the specified action from db', function (done) {
    var q = 'app=app&topic=topic'
    var req = request.patch(URL + '/resources?' + q)
    req.send({app: 'app2'})
      .end(function (err, resp, body) {
        should.not.exist(err)
        resp.statusCode.should.equal(204)
        expect(body).to.be.empty
        done()
      })
  })

  it('should delete the specified action from db', function (done) {
    var q = 'hook=hook'
    request.del(URL + '/resources?' + q).end(function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(204)
      expect(body).to.be.empty
      done()
    })
  })
})
