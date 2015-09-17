#!/usr/bin/env node

var chai = require('chai')
, should = chai.should()
, expect = chai.expect

var request = require('request')
, spawn = require('child_process').spawn
, config = require('../config')
, path = require('path')
, fs = require('fs')

var s = 1000 // seconds

// Test styling
// http://chaijs.com/guide/styles/

// tutorial
// http://code.tutsplus.com/tutorials/testing-in-nodejs--net-35018

describe("Apps", function(){

	var dashboard = undefined

	before(function(done) {
		this.timeout(8*s)
		dashboard = spawn('./www', ['-p', '3000'], {})
		setTimeout(done, 2000)
	})

	it("should return 404 when an app does not exist", function(done) {
		request('http://localhost:3000/apps/tsaebten', function (err, resp, body) {
			should.not.exist(err)
			expect(resp.statusCode).to.equal(404)
			body.should.be.a('String')
			done()
		})
	})

	it("should upload myapp to repository", function(done) {
			this.timeout(8*s) //this takes time
			var req = request.post('http://localhost:3000/apps', function (err, resp, body) {
				should.not.exist(err)
				body.should.equal('')
				expect(resp.statusCode).to.equal(204)
				fs.stat(path.join(config.appsDir, 'myapp'), function (err, stats) {
					should.not.exist(err)
					expect(stats.isDirectory()).to.equal(true)
					done()
				})
			})
			var form = req.form()
			var app = path.join(__dirname, 'app.tar.gz')
			form.append('file', fs.createReadStream(app))
		})

	it("should return application package.json", function(done) {
		request('http://localhost:3000/apps/myapp', function (err, resp, body) {
			should.not.exist(err)
			resp.statusCode.should.equal(200)
			expect(JSON.parse(body)).to.be.an('Object')
			done()
		})
	})

	it("should upload app @ github to repo", function (done) {
		this.timeout(20*s) //this also takes time
		var req = request.post('http://localhost:3000/apps', function (err, resp, body) {
			should.not.exist(err)
			body.should.equal('')
			expect(resp.statusCode).to.equal(204)
			fs.stat(path.join(config.appsDir, 'xy-get-started'), function (err, stats) {
				should.not.exist(err)
				expect(stats.isDirectory()).to.equal(true)
				done()
			})
		})
		var form = req.form()
		var app = 'https://github.com/netbeast-co/get-started'
		form.append('url', app)
	})

	it("should return all apps names", function(done) {
		request('http://localhost:3000/apps', function (err, resp, body) {
			should.not.exist(err)
			resp.statusCode.should.equal(200)
			expect(JSON.parse(body)).to.be.an('Array')
			done()
		})
	})

	it("should remove 'myapp' from repository", function(done) {
		request.del('http://localhost:3000/apps/myapp', function (err, resp, body) {
			should.not.exist(err)
			expect(resp.statusCode).to.equal(204)
			body.should.equal('')
			done()
		})
	})

	it("should remove 'xy-get-started' from repository", function(done) {
		request.del('http://localhost:3000/apps/xy-get-started', function (err, resp, body) {
			should.not.exist(err)
			expect(resp.statusCode).to.equal(204)
			body.should.equal('')
			done()
		})
	})

	it("should return 404 when an app does not exist", function(done) {
		request.del('http://localhost:3000/apps/tsaebten', function (err, resp, body) {
			should.not.exist(err)
			expect(resp.statusCode).to.equal(404)
			body.should.be.a('String')
			done()
		})
	})
	
	after(function() {
		dashboard.kill()
	})

})