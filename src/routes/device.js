// require sistema

// modules
var express = require('express')
var Promise = require('bluebird')

// librerias propias
var Resource = require('../models/resource')
var request = require('superagent-bluebird-promise')

var	router = module.exports = express.Router()

const APP_PROXY = 'http://' + process.env.IPs + ':' + process.env.PORT + '/i/'

router.route('/i/:key/:value')
.get(function (req, res, next) {
  req.query[req.params.key] = req.params.value

  for (var key in req.query) {
    if (req.query[key] === '') delete req.query[key]
  }

  Resource.find(req.query, function (err, resources) {
    if (err) return next(err)

    Promise.map(resources, function (item, done) {
      return request.get(APP_PROXY + item.app + item.hook)
      .then(function (res) {
        item.result = (Object.keys(res.body).length) ? res.body : res.text
        return item
      })
    }).then(function (data) {
      res.json(data)
    }).catch(next)
  })
})

.post(function (req, res, next) {
  req.query[req.params.key] = req.params.value

  Resource.find(req.query, function (err, resources) {
    if (err) return next(err)

    Promise.map(resources, function (item, done) {
      return request.post(APP_PROXY + item.app + item.hook).send(req.body)
      .then(function (res) {
        item.result = (Object.keys(res.body).length) ? res.body : res.text
        return item
      })
    }).then(function (data) {
      res.json(data)
    }).catch(next)
  })
})
