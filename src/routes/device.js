// require sistema

// modules
var express = require('express')
var Promise = require('bluebird')
var netbeast = require('netbeast')

// librerias propias
var Resource = require('../models/resource')
var ApiError = require('../util/api-error')
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

router.route('/i/create')
.post(function (req, res, next) {
  if (!req.body.hook || !req.body.topic || !req.body.app) return res.json(new ApiError(404))
  else {
    Resource.find({app: req.body.app, topic: req.body.topic}, function (err, resources) {
      if (err) return next(err)

      var objects = []
      if (resources.length > 0) {
        resources.forEach(function (device) {
          if (objects.indexOf(device.hook) < 0) objects.push(device.hook)
        })
      }

      req.body.hook.forEach(function (id) {
        var indx = objects.indexOf(id)
        if (indx >= 0) objects.splice(indx, 1)
        else netbeast(req.body.topic).create({app: req.body.app, hook: id})
      })

      if (objects.length > 0) {
        objects.forEach(function (hooks) {
          netbeast().delete({ hook: hooks })
        })
      }
    })
  }
})
