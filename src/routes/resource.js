// require sistema

// modules
var express = require('express')

// librerias propias
var	Resource = require('../models/resource.js')

var	router = express.Router()

router.route('/resources')

.get(function (req, res, next) {
  Resource.find(req.query, function (err, resources) {
    if (err) return res.status(500).send(err)

    res.json(resources)
  })
})

.post(function (req, res, next) {
  Resource.findOne(req.body, function (err, resource) {
    if (err && err !== 'No Row Found!') return res.status(500).send(err)

    if (!resource || err === 'No Row Found!') {
      Resource.create(req.body, function (err, item) {
        if (err) return res.status(500).send(err)
        return res.status(204).end()
      })
    } else return res.status(500).send('This action exists!')
  })
})

.patch(function (req, res, next) {
  Resource.findOne(req.query, function (err, resource) {
    if (err) return res.status(500).send(err)

    Resource.update(req.query, req.body, function (err) {
      if (err) return res.status(500).send(err)
      return res.status(204).end()
    })
  })
})

.delete(function (req, res, next) {
  Resource.find(req.query, function (err, resources) {
    if (err) return res.status(500).send(err)

    resources.forEach(function (item) {
      item.destroy(function (err) {
        if (err) return res.status(500).send(err)
        return res.status(204).end()
      })
    })
  })
})

module.exports = router
