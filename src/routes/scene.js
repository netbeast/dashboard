var express = require('express')
var	router = express.Router()
var	Scene = require('../models/scene.js')
var ApiError = require('../util/api-error')

//  GET
router.get('/scenes', function (req, res, next) {
  Scene.find(req.query, function (err, devices) {
    if (err) return next(err)
    res.json(devices)
  })
})

//  POST
router.post('/scenes', function (req, res, next) {
  Scene.findOne(req.body, function (err, device) {
    if (err) return next(err)
    else if (device === undefined || err === 'No Row Found!') {
      Scene.create(req.body, function (err, item) {
        if (err) return next(err)
        return res.status(204).end()
      })
    } else return new ApiError(500, 'This device exists!')
  })
})

//  UPDATE
router.patch('/scenes', function (req, res, next) {
  Scene.findOne(req.query, function (err, device) {
    if (err) return next(err)

    Scene.update(req.query, req.body, function (err) {
      if (err) next(err)
      return res.status(204).end()
    })
  })
})

//  DELETE
router.delete('/scenes', function (req, res, next) {
  Scene.find(req.query, function (err, devices) {
    if (err) return next(err)

    devices.forEach(function (item) {
      item.destroy(function (err) {
        if (err) return next(err)
        return res.status(204).end()
      })
    })
  })
})

module.exports = router
