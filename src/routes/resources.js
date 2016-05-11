// require sistema

// modules
var express = require('express')
var Promise = require('bluebird')
var netbeast = require('netbeast')

// librerias propias
var Resource = require('../models/resource')
var broker = require('../helpers/broker')
var ApiError = require('../util/api-error')
var request = require('superagent-bluebird-promise')

var	router = module.exports = express.Router()

const APP_PROXY = 'http://' + process.env.IPs + ':' + process.env.PORT + '/i/'

router.route('/resources')

.get(function (req, res, next) {
  Resource.find(req.query, function (err, resources) {
    if (err && err.statusCode !== 404) return next(err)
    res.json(resources || {})
  })
})

.post(function (req, res, next) {
  Resource.findOne(req.body, function (err, resource) {
    if (err && err.statusCode !== 404) return next(err)

    if (resource) return res.json(resource)

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

router.route('/resources/:key/:value')
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

router.route('/resources/update')
.post(function (req, res, next) {
  if (!req.body.hook || !req.body.topic || !req.body.app) return res.json(new ApiError(404))
  else {
    if (typeof req.body.hook === 'string') req.body.hook = [req.body.hook]

    Resource.find({app: req.body.app, topic: req.body.topic}, function (err, resources) {
      if (err && err.statusCode !== 404) return next(err)
      var objects = []
      if (resources && resources.length > 0) {
        resources.forEach(function (device) {
          if (objects.indexOf(device.hook) < 0) objects.push(device.hook)
          console.log(objects)
        })
      }

      req.body.hook.forEach(function (id) {

        var indx = objects.indexOf(id)
        if (indx >= 0) objects.splice(indx, 1)
        else {
          var device = {
            app: req.body.app,
            topic: req.body.topic,
            hook: id
          }
          Resource.findOne(device, function (err, resource) {
            if (err && err.statusCode !== 404) return next(err)

            Resource.create(device, function (err, item) {
              if (err) return next(err)
            })
          })
        }
      })

      if (objects.length > 0) {
        objects.forEach(function (hook) {
          Resource.destroy({ hook: hook }, function (err, resources) {
            if (err) return next(err)
          })
        })
      } return res.status(204).end()
    })
  }
})
