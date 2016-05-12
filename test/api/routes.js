/* global describe, it*/
require('dotenv').load()

var request = require('superagent')
var chai = require('chai')
var should = chai.should()
var expect = chai.expect

const URL = 'https://localhost:' + process.env.SECURE_PORT + '/api'

describe('RESTful Resources API', function () {
  it('should insert a new action in db', function (done) {
    request.post(URL + '/resources')
    .send({ app: 'app', location: 'location', topic: 'topic', groupname: 'group', hook: 'hook' })
    .end(function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(200)
      done()
    })
  })

  it('should return all specified actions from db', function (done) {
    request.get(URL + '/resources')
    .query({ app: 'app', topic: 'topic' })
    .end(function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(200)
      body = resp.body
      body.should.be.an('Array')
      body.forEach(function (item) {
        expect(item).to.have.keys('id', 'alias', 'app', 'topic', 'location', 'groupname', 'hook')
      })
      done()
    })
  })

  it('should update the specified action from db', function (done) {
    request.patch(URL + '/resources')
    .query({ app: 'app', topic: 'topic' })
    .send({app: 'app2'})
    .end(function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(204)
      expect(body).to.be.empty
      done()
    })
  })

  it('should delete the specified action from db', function (done) {
    request.del(URL + '/resources')
    .query({ hook: 'hook' })
    .end(function (err, resp, body) {
      should.not.exist(err)
      resp.statusCode.should.equal(204)
      expect(body).to.be.empty
      done()
    })
  })
})
