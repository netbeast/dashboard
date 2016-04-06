// require sistema

// modules
var express = require('express')

// librerias propias
var Resource = require('../models/resource')
var ApiError = require('../util/api-error')
var broker = require('../helpers/broker')

var	router = module.exports = express.Router()

router.route('/resources')

.get(function (req, res, next) {
  Resource.find(req.query, function (err, resources) {
    if (err && err.statusCode !== 404) return next(err)
    res.json(resources)
  })
})

.post(function (req, res, next) {
  Resource.findOne(req.body, function (err, resource) {
    if (err && err.statusCode !== 404) return next(err)

    if (resource) return next(new ApiError(405, 'This resource exists!'))

    Resource.create(req.body, function (err, item) {
      if (err) return next(err)
      return res.json(item)
    })
  })
})

.patch(function (req, res, next) {
  Resource.findOne(req.query, function (err, resource) {
    if (err) return next(err)

    Resource.update(req.query, req.body, function (err) {
      if (err) return next(err)
      return res.status(204).end()
    })
  })
})

.delete(function (req, res, next) {
  Resource.destroy(req.query, function (err, resources) {
    if (err) return next(err)
    return res.status(204).end()
  })
})

broker.client.on('#api/resources/post', function (query) {
  console.log('#api/resources/post')
  console.log(query)

  Resource.findOne(query, function (err, resource) {
    if (err && err.statusCode !== 404) return console.trace(err)

    if (resource) return // resource already exist

    Resource.create(query, function (err, item) {
      if (err) return console.trace(err)
    })
  })
})

broker.client.on('#api/resources/delete', function (query) {
  console.log('#api/resources/delete')
  console.log(query)

  Resource.destroy(query, function (err, resources) {
    if (err && err.statusCode !== 404) return console.trace(err)
  })
})