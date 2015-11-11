var express = require('express')
var router = express.Router()
var loadAction = require('./actions')
var Wemo = require('wemo-client')
var wemo = new Wemo()

//  Acepted Values for Each Device
var switchvalues = {on: 'binaryState'}
var bulbvalues = {on: '10006', bri: '10008'}
var bridgevalues = {on: 'binaryState'}

loadAction(function (err, devices) {
  if (err) throw err
  // ### GET ###
  router.get('/wemoBridge/:id', function (req, res, next) {
    var device = devices.filter(function (elem) {
      if (elem.macAddress === req.params.id && elem.deviceType === Wemo.DEVICE_TYPE.Bridge) return true
    })
    if (device.length > 0) {
      if (!req.query.key) res.json({ error: {}, data: device })
      else if (bridgevalues[req.query.key]) res.json({ error: {}, data: device[0][bridgevalues[req.query.key]] })
      else res.status(400).send({ error: 'Value ' + req.query.key + ' not available', data: {} })
    } else {
      res.status(404).send({ error: 'Not found', data: {} })
    }
  })

  router.get('/wemoBridge/:id/info', function (req, res, next) {
    var device = devices.filter(function (elem) {
      if (elem.macAddress === req.params.id && elem.deviceType === Wemo.DEVICE_TYPE.Bridge) return true
    })
    if (device.length > 0) {
      var newDevice = {
        host: device[0]['host'],
        port: device[0]['port'],
        deviceType: device[0]['deviceType'],
        friendlyName: device[0]['friendlyName'],
        modelName: device[0]['modelName'],
        modelNumber: device[0]['modelNumber']
      }
      res.json({ error: {}, data: newDevice })
    } else {
      res.status(404).send({ error: 'Not found', data: {} })
    }
  })

  router.get('/wemoLights/:id', function (req, res, next) {
    var device = devices.filter(function (elem) {
      if (elem.deviceId === req.params.id && elem.currentState &&
        elem.capabilities) return true
    })
    if (device.length > 0) {
      if (!req.query.key) res.json({ error: {}, data: device[0] })
      else if (bulbvalues[req.query.key]) res.json({ error: {}, data: device[0][bulbvalues[req.query.key]] })
      else res.status(400).send({ error: 'Value ' + req.query.key + ' not available', data: {} })
    } else {
      res.status(404).send({ error: 'Not found', data: {} })
    }
  })

  router.get('/wemoLights/:id/info', function (req, res, next) {
    var device = devices.filter(function (elem) {
      if (elem.deviceId === req.params.id && elem.currentState &&
        elem.capabilities) return true
    })
    if (device.length > 0) {
      res.json({ error: {}, data: device })
    } else {
      res.status(404).send({ error: 'Not found', data: {} })
    }
  })

  router.get('/wemoSwitch/:id', function (req, res, next) {
    var device = devices.filter(function (elem) {
      if (elem.macAddress === req.params.id && (elem.deviceType === Wemo.DEVICE_TYPE.Switch ||
        elem.deviceType === Wemo.DEVICE_TYPE.Insight)) return true
    })
    if (device.length > 0) {
      if (!req.query.key) res.json({ error: {}, data: device })
      else if (switchvalues[req.query.key]) res.json({ error: {}, data: device[0][switchvalues[req.query.key]] })
      else res.status(400).send({ error: 'Value ' + req.query.key + ' not available', data: {} })
    } else {
      res.status(404).send({ error: 'Not found', data: {} })
    }
  })

  router.get('/wemoSwitch/:id/info', function (req, res, next) {
    var device = devices.filter(function (elem) {
      if (elem.macAddress === req.params.id && (elem.deviceType === Wemo.DEVICE_TYPE.Switch ||
        elem.deviceType === Wemo.DEVICE_TYPE.Insight)) return true
    })
    if (device.length > 0) {
      var newDevice = {
        host: device[0]['host'],
        port: device[0]['port'],
        deviceType: device[0]['deviceType'],
        friendlyName: device[0]['friendlyName'],
        modelName: device[0]['modelName'],
        modelNumber: device[0]['modelNumber']
      }
      res.json({ error: {}, data: newDevice })
    } else {
      res.status(404).send({ error: 'Not found', data: {} })
    }
  })

  router.get('/discover', function (req, res, next) {
    loadAction(function (err, devices) {
      if (err) res.status(500).send({ error: err, data: {} })
      else res.json({error: {}, data: devices})
    })
  })

  // ### POST ###
  router.post('/wemoBridge/:id', function (req, res, next) {
    var device = devices.filter(function (elem) {
      if (elem.macAddress === req.params.id && elem.deviceType === Wemo.DEVICE_TYPE.Bridge) return true
    })
    if (device.length > 0) {
      var error = false
      var client = wemo.client(device[0])
      Object.keys(req.body).forEach(function (key) {
        if (bridgevalues[key]) {
          client.setBinaryState(req.body[key], function (err, data) {
            if (err) error = true
          })
        }
      })
      if (error === false) res.send({ error: {}, data: true })
      else res.status(400).send({ error: 'A problem setting one value occurred', data: {} })
    } else res.status(404).send({ error: 'Not found', data: {} })
  })

  router.post('/wemoLights/:id', function (req, res, next) {
    var device = devices.filter(function (elem) {
      if (elem.deviceId === req.params.id && elem.currentState &&
        elem.capabilities) return true
    })
    var bridge = devices.filter(function (elem) {
      if (elem.deviceType === Wemo.DEVICE_TYPE.Bridge) return true
    })
    if (device.length > 0 && bridge.length > 0) {
      var client = wemo.client(bridge[0])
      Object.keys(req.body).forEach(function (key) {
        // Comprobar si este valor se le puede asignar a esta bombilla
        if (bulbvalues[key]) {
          if (req.body[key] === true) req.body[key] = 1
          else if (req.body[key] === false) req.body[key] = 0
          client.setDeviceStatus(req.params.id, bulbvalues[key], req.body[key])
        }
      })
      res.send({ error: {}, data: true })
    } else res.status(404).send({ error: 'Not found', data: {} })
  })

  router.post('/wemoSwitch/:id', function (req, res, next) {
    var device = devices.filter(function (elem) {
      if (elem.macAddress === req.params.id && (elem.deviceType === Wemo.DEVICE_TYPE.Switch ||
        elem.deviceType === Wemo.DEVICE_TYPE.Insight)) return true
    })
    if (device.length > 0) {
      var error = false
      var client = wemo.client(device[0])
      Object.keys(req.body).forEach(function (key) {
        if (switchvalues[key]) {
          client.setBinaryState(req.body[key], function (err, data) {
            if (err) error = true
          })
        }
      })
      if (error === false) res.send({ error: {}, data: true })
      else res.status(404).send({ error: 'A problem setting one value occurred', data: {} })
    } else res.status(404).send({ error: 'Not found', data: {} })
  })
})

module.exports = router
