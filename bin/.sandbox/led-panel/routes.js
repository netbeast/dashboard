

var express = require('express')
var router = express.Router()
var beecolor = require('beecolor')
// Require the discovery function
var loadResources = require('./resources')

loadResources(function (err) {
  if (err) throw err

  router.post('/led', function (req, res, next) {

    console.log(req.param.id)


    //req.body = {power:on/off, data:[]}
    var powerValue = req.body.power

    if (!powerValue) return res.status(400).send('Incorrect format {power:on/off, data}')

    else if (powerValue === 'off') {
      beecolor.clear(function(err) {
        if(err) return res.status(422).send('A problem setting one value occurred')
          return res.send('Matrix Cleared')
      })
    }
    else if (powerValue == 'on') {
      var matrix = req.body.data

      beecolor.matrix(matrix, function(err) {
        if(err) return res.status(422).send('A problem setting one value occurred')
          return res.send('Matrix Colored')
      })

    }
    else return res.status(400).send('Incorrect format {power:on/off, data}')

  })
})

// Used to serve the routes
module.exports = router
