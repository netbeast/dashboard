/* global describe, before, it*/

var Resource = require('../src/models/resource')
var should = require('Chai').should()
var expect = require('Chai').expect
var helper = require('../src/lib/resource')

describe('Resources', function () {
  before(function (done) {
    helper.createTable(function (err, data) {
      should.not.exist(err)
      done()
    })
  })

  it('should .create() an entry on sqlite', function (done) {
    var resource = {
      app: 'app',
      topic: 'topic',
      location: 'loc',
      groupname: 'group',
      method: 'meth',
      hook: 'hook'
    }

    Resource.create(resource, function (err, item) {
      should.not.exist(err)
      expect(item).to.be.an('Object')
      done()
    })
  })

  it('should .find() an entry on sqlite', function (done) {
    Resource.find({app: 'app'}, function (err, resources) {
      should.not.exist(err)
      resources.forEach(function (item) {
        expect(item).to.have.all.keys(
          'id', 'app', 'topic', 'location', 'groupname', 'method', 'hook')
      })
      done()
    })
  })

  it('should .update() an entry on sqlite', function (done) {
    Resource.findOne({app: 'app'}, function (err, item) {
      should.not.exist(err)
      expect(item).to.be.an('Object')
      //  .then...
      Resource.update({id: item.id}, {topic: 'new_topic'}, function (err) {
        should.not.exist(err)
        done()
      })
    })
  })

  it('should .destroy() an entry on sqlite', function (done) {
    Resource.findOne({app: 'app'}, function (err, item) {
      should.not.exist(err)
      expect(item).to.be.an('Object')
      //  .then...
      item.destroy(function (err) {
        should.not.exist(err)
        //  .then...
        Resource.find({id: item.id}, function (err, item) {
          expect(item).to.be.empty
          expect(err).to.equal('No Row Finded!')
          done()
        })
      })
    })
  })
})
