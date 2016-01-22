var express = require('express')
var	router = express.Router()
var	Scene = require('../models/scene.js')

//  GET
router.get('/scenes', function (req, res) {
  Scene.find(req.query, function (err, devices) {
    if (err) return res.status(500).send(err)
    res.json(devices)
  })
})

//  POST
router.post('/scenes', function (req, res) {
  Scene.findOne(req.body, function (err, device) {
    if (err) return res.status(500).send(err)
    else if (device === undefined || err === 'No Row Found!') {
      Scene.create(req.body, function (err, item) {
        if (err) return res.status(500).send(err)
        return res.status(204).end()
      })
    } else return res.status(500).send('This device exists!')
  })
})

//  UPDATE
router.patch('/scenes', function (req, res) {
  Scene.findOne(req.query, function (err, device) {
    if (err) return res.status(500).send(err)

    Scene.update(req.query, req.body, function (err) {
      if (err) res.status(500).send(err)
      return res.status(204).end()
    })
  })
})

//  DELETE
router.delete('/scenes', function (req, res) {
  Scene.find(req.query, function (err, devices) {
    if (err) return res.status(500).send(err)

    devices.forEach(function (item) {
      item.destroy(function (err) {
        if (err) return res.status(500).send(err)
        return res.status(204).end()
      })
    })
  })
})

module.exports = router
