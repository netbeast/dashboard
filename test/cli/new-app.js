/* global describe, before, it*/

var should = require('chai').should()
var expect = require('chai').expect
var async = require('async')

var exec = require('child_process').exec
var fs = require('fs-extra')

describe('Command Line Interface', function () {
  before('Create app to test', function (done) {
    exec('beast new testApp', function (err, stdout, stderr) {
      should.not.exist(err)
      done()
    })
  })

  it('should create an app called testApp', function (done) {
    var pathToApp = process.cwd() + '/testApp'

    async.series([
      function (callback) {
        fs.readdir(pathToApp, function (err, file) {
          callback(err, file)
        })
      },
      function (callback) {
        fs.readdir(pathToApp + '/public', function (err, file) {
          callback(err, file)
        })
      },
      function (callback) {
        fs.readFile(pathToApp + '/server.js', function (err, data) {
          var shebang = data.slice(0, data.indexOf('\n')).toString()
          shebang.should.equal('#!/usr/bin/env node')
          callback(err, data)
        })
      },
      function (callback) {
        fs.readFile(pathToApp + '/package.json', function (err, data) {
          expect(data.indexOf('"main": "server.js",')).to.not.equal(-1)
          callback(err, data)
        })
      }
    ],
    function (err, results) {
      should.not.exist(err)
      should.exist(results)
      done()
    })
  })
})

/*      },
      function (callback) {
        fs.readFile('/doesnt/exist', 'utf8', function (err, data) {
          var shebang =
          callback(err, data)
          console.log(data)
        })*/
