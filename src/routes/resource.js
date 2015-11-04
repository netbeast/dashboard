var express = require('express')
var	router = express.Router()
var	Resource = require('../models/resource.js')

//  GET
router.get('/resources', function (req, res) {
  Resource.find(req.query, function (err, resources) {
    if (err) res.status(500).send({ error: err, data: {} })
		else {
      res.json({ error: {}, data: resources })
    }
  })
})

//  POST
router.post('/resources', function (req, res) {
  Resource.findOne(req.body, function (err, resource) {
    if (resource === undefined || err === 'No Row Finded!') {
      Resource.create(req.body, function (err, item) {
        if (err) res.status(500).send({ error: err, data: {} })
        else res.status(204).end()
      })
    } else if (err && err !== 'No Row Finded!') res.status(500).send({ error: err, data: {} })
    else res.status(500).send({ error: 'This action exists!', data: {} })
  })
})

//  UPDATE
router.patch('/resources', function (req, res) {
  Resource.findOne(req.query, function (err, resource) {
    if (err) res.status(500).send({ error: err, data: {} })
    else {
      Resource.update(req.query, req.body, function (err) {
        if (err) res.status(500).send({ error: err, data: {} })
        else res.status(204).end()
      })
    }
  })
})

//  DELETE
router.delete('/resources', function (req, res) {
  Resource.find(req.query, function (err, resources) {
    if (err) res.status(500).send({ error: err, data: {} })
    else {
      resources.forEach(function (item) {
        item.destroy(function (err) {
          if (err) res.status(500).send({ error: err, data: {} })
          else res.status(204).end()
        })
      })
    }
  })
})

module.exports = router
