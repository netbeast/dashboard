var loadAction = require('./actions')
var	express = require('express')
var router = express.Router()

loadAction(function (err, api) {
  if (err) throw err
  else {
    router.get('/hueLights/:id', function (req, res, next) {
      api.lightStatus(req.params.id)
      .then(function (data) {
        if (!req.query.key) res.json({error: {}, data: data.state})
        else if (data.state[req.query.key])
          res.json({error: {}, data: data.state[req.query.key]})
        else
          res.status(400).send({ error: 'Value not available', data: {} })
      })
    })

    router.get('/hueLights/:id/info', function (req, res, next) {
      api.lightStatus(req.params.id)
      .then(function (data) {
        delete data['state']
        delete data['pointsymbol']
        res.json({error: {}, data: data})
      })
    })

    router.get('/discover', function (req, res, next) {
      loadAction(function (err, api) {
        if (err) res.status(500).send({ error: err, data: {} })
        api.lights(function (err, lights) {
          if (err) res.status(500).send({ error: err, data: {} })
          res.json({error: {}, data: lights.lights})
        })
      })
    })

    router.post('/hueLights/:id', function (req, res, next) {
      api.lightStatus(req.params.id)
      .then(function (data) {
        Object.keys(req.body).forEach(function (key) {
          if (data.state[key] === undefined || key === 'xy' || key === 'ct') {
            delete req.body[key]
          }
        })
        api.setLightState(req.params.id, req.body)
        .then(function (result) {
          res.send({error: {}, data: true})
        })
        .fail(function (err) {
          res.status(400).send({ error: 'Value not available', data: {} })
        })
        .done()
      })
    })
  }
})

module.exports = router
