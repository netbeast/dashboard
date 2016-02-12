// require sistema

// modules
var express = require('express')

// librerias propias
var	Resource = require('../models/resource.js')
var ApiError = require('../util/api-error')

var	router = express.Router()

router.route('/resources')

.get(function (req, res, next) {
  Resource.find(req.query, function (err, resources) {
    if (err && err.statusCode !== 404) return next(err)

    if (resources) {
      resources.forEach(function (item) {
        item.mac_or_ip = item.hook.split('/')[item.hook.split('/').length - 1]
      })
    }

    res.json(resources)
  })
})

.post(function (req, res, next) {
  Resource.findOne(req.body, function (err, resource) {
    if (err && err.statusCode !== 404) return next(err)

    if (resource) return next(new ApiError(405, 'This resource exists!'))

    Resource.create(req.body, function (err, item) {
      if (err) return next(err)
      return res.status(204).end()
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
  Resource.find(req.query, function (err, resources) {
    if (err) return next(err)

    if (!Object.keys(resources).length) return next(new ApiError(404, 'These resources doesn´t exists!'))
    resources.forEach(function (item) {
      item.destroy(function (err) {
        if (err) return next(err)
        return res.status(204).end()
      })
    })
  })
})

module.exports = router
