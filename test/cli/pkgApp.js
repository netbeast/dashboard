/* global describe, before, after, it*/

var should = require('chai').should()
// var expect = require('chai').expect

var exec = require('child_process').exec
var fs = require('fs')

describe('Command Line Interface: package', function () {
  before(function (done) {
    exec('beast package testApp', function (err, stdout, stderr) {
      should.not.exist(err)
      done()
    })
  })
  it('should create a packaged app from testApp called app.tar.gz', function (done) {
    var pathToPkg = process.cwd()
    fs.readFile(pathToPkg + '/app.tar.gz', function (err, file) {
      should.not.exist(err)
      should.exist(file)
      done()
    })
  })
  // package app with optoion -o
  after('it should create a packaged app from testApp called testApp.tar.gz (option -o)', function (done) {
    exec('beast package testApp -o testApp.tar.gz', function (err, stdout, stderr) {
      should.not.exist(err)
      done()
    })
  })
  it('should create a packaged app from testApp called testApp.tar.gz (option -o)', function (done) {
    var pathToPkg = process.cwd()
    fs.readFile(pathToPkg + '/testApp.tar.gz', function (err, file) {
      should.not.exist(err)
      should.exist(file)
      done()
    })
  })

  after('it should create a packaged app from testApp called testApp.tar.gz (option --to)', function (done) {
    exec('beast package testApp --to testApp.tar.gz', function (err, stdout, stderr) {
      should.not.exist(err)
      done()
    })
  })
  it('should create a packaged app from testApp called testApp.tar.gz (option --to)', function (done) {
    var pathToPkg = process.cwd()
    fs.readFile(pathToPkg + '/testApp.tar.gz', function (err, file) {
      should.not.exist(err)
      should.exist(file)
      done()
    })
  })
})
