var express = require('express')
var	router = express.Router()
var	Scene = require('../models/scene.js')

//  GET
router.get('/scenes', function (req, res) {
  Scene.find(req.query, function (err, devices) {
    if (err) res.status(500).send({ error: err, data: {} })
    else {
      res.json({ error: {}, data: devices })
    }
  })
})

//  POST
router.post('/scenes', function (req, res) {
  Scene.findOne(req.body, function (err, device) {
    if (err && err !== 'No Row Found!') res.status(500).send({ error: err, data: {} })
    else if (device === undefined || err === 'No Row Found!') {
      Scene.create(req.body, function (err, item) {
        if (err) res.status(500).send({ error: err, data: {} })
        else res.status(204).end()
      })
    } else res.status(500).send({ error: 'This device exists!', data: {} })
  })
})

//  UPDATE
router.patch('/scenes', function (req, res) {
  Scene.findOne(req.query, function (err, device) {
    if (err) res.status(500).send({ error: err, data: {} })
    else {
      Scene.update(req.query, req.body, function (err) {
        if (err) res.status(500).send({ error: err, data: {} })
        else res.status(204).end()
      })
    }
  })
})

//  DELETE
router.delete('/scenes', function (req, res) {
  Scene.find(req.query, function (err, devices) {
    if (err) res.status(500).send({ error: err, data: {} })
    else {
      devices.forEach(function (item) {
        item.destroy(function (err) {
          if (err) res.status(500).send({ error: err, data: {} })
          else res.status(204).end()
        })
      })
    }
  })
})

module.exports = router
