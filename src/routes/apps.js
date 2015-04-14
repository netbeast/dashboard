var express = require('express')
, router = express.Router()
, Helper = require('../helper')
, launcher = require('../launcher')
, httpProxy = require('http-proxy')
, proxy = httpProxy.createProxyServer({ws: true});

// GET
router.get('/apps', function(req, res) {
  res.json(Helper.getAppsJSON());
});

router.get('/apps/:name', function(req, res) {
  var packageJSON = undefined; // err by default
  packageJSON = Helper.getAppPkgJSON(req.params.name);
  if (packageJSON !== undefined) {
    res.json(packageJSON);
  } else {
    res.status(404).json('Not Found');
  }
});

router.get('/apps/:name/port?', function(req, res) {
  var app = launcher.getApp(req.params.name);
  if (app) {
    console.dir(app.port);
    res.json(app.port);
  } else {
    res.status(403).send("App not running");
  }
});

// CREATE
router.post('/apps', function(req, res){
  if(req.body.gitURL) {
    require('../installer').git(req, res);
  } else {
    console.log("Installer.multer() processing data...");
    console.log(req.body);
    console.log(req.files);
  }
});

// DELETE
router.delete('/apps/:name', function(req, res) {
  launcher.stop(req.params.name, function (err) {
    if (err) {
      res.status(403).json('' + err);
    } else {
      Helper.deleteApp(req.params.name, function(err) {
        if (err) {
          res.status(403).json('' + err);
        } else {
          res.status(204).json('The app was deleted');
        }
      });
    }
  });
});

// Proxy
router.use('/i/:name?', function(req, res) {

  var app, reqPath, referer, proxyUrl;

  // Capture the referer to proxy the request
  // in case the path is not clear enaugh
  if (req.get('referer') !== undefined) {
    var aux = req.get('referer').split('/');
    referer = aux[aux.indexOf('i') + 1]
  }

  // This block returns an app object
  // with the port where it is running
  app = launcher.getApp(req.params.name)
  || launcher.getApp(referer);

  if (app) {
    // Here app is running

    // In case the path is /i/:name
    // instead of /i/:name/ you need this block
    req.url = (req.url === '/') ? '' : req.url;
    reqPath = (referer !== undefined)
     ? '/' + req.params.name + req.url
     : req.url;
    req.url = reqPath.replace('/i/', '/');
    req.url = req.url.replace('/' + app.name, '');

    // This block of code actually pipes the request
    // to the running app and pass it to the client
    proxyUrl = req.protocol + '://localhost:' + app.port;
    proxy.web(req, res, { 
      target: proxyUrl
    });

    // Some logging
    console.log('req url: %s', req.url);
    console.log('proxy url: %s', proxyUrl);
    console.log('referer: %s', referer);

  } else {
    // Here app is not running
    res.status(404).json("App not running");
  }
});

// Util
//============
router.get('/routes', function(req, res) {
  res.json(router.stack);
});

module.exports = router;