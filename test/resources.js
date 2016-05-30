/* global describe, before, it*/
require('dotenv').load()

var should = require('chai').should()
var expect = require('chai').expect

var Resource = require('../src/models/resource')
var helper = require('../src/helpers/resource')

describe('Resources', function () {
  before(function (done) {
    helper.createTable(function (err, data) {
      if (err) throw err
      done()
    })
  })

  it('should .create() an entry on sqlite', function (done) {
    var resource = {
      app: 'app',
      alias: 'alias',
      topic: 'topic',
      location: 'loc',
      groupname: 'group',
      hook: 'hook'
    }

    Resource.create(resource, function (err, item) {
      if (err) throw err
      expect(item).to.be.an('Object')
      done()
    })
  })

  it('should .find() an entry on sqlite', function (done) {
    Resource.find({app: 'app'}, function (err, resources) {
      if (err) throw err
      resources.forEach(function (item) {
        expect(item).to.have.keys(
          'id', 'alias', 'app', 'topic', 'location', 'groupname', 'hook')
      })
      done()
    })
  })

  it('should .update() an entry on sqlite', function (done) {
    Resource.findOne({app: 'app'}, function (err, item) {
      if (err) throw err
      expect(item).to.be.an('Object')
      Resource.update({id: item.id}, {topic: 'new_topic'}, function (err) {
        if (err) throw err
        done()
      })
    })
  })

  it('should .destroy() an entry on sqlite', function (done) {
    Resource.findOne({app: 'app'}, function (err, item) {
      if (err) throw err
      expect(item).to.be.an('Object')
      item.destroy(function (err) {
        if (err) throw err
        Resource.find({ id: item.id }, function (err, item) {
          if (err && err.statusCode !== 404) throw err
          expect(item).to.be.empty
          done()
        })
      })
    })
  })
})
