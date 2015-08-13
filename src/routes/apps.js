var express = require('express')
, showdown  = require('showdown')
, config = require('../../config')
, Helper = require('../helpers')
, fs = require('fs-extra')
, path = require('path')
, installer = require('../installer')
, launcher = require('../launcher')
, httpProxy = require('http-proxy');

var router = express.Router();

// GET
router.get('/apps', function(req, res) {
  res.json({
    apps: Helper.getAppsJSON(),
    user: config.getUser() || false
  });
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

router.get('/apps/:name/logo', function (req, res) {
  var app = Helper.getAppPkgJSON(req.params.name);
  var appRoot = path.join(config.appsDir, app.name);
  if (app.logo) {
    var appLogo = path.join(appRoot, app.logo);
    if (fs.existsSync(appLogo))
      return res.sendFile(appLogo);
  }

  res.sendFile(path.join(config.publicDir, 'img/dflt.png'));
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

router.get('/apps/:name/readme', function (req, res) {
  var readme = path.join(config.appsDir, req.params.name, 'README.md');
  if (!fs.existsSync(readme))
    return res.send("This app does not have a README.md");

  fs.readFile(readme, 'utf8', function (err, data) {
    console.log(showdown);
    var converter = new showdown.converter(),
    html = converter.makeHtml(data);
    res.send(html);
  });
});

// CREATE
router.post('/apps', installer.multer);

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
//======
var proxy = httpProxy.createProxyServer({ws: true});
router.use('/i/:name?', function(req, res)  {
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
  } else {
    // Here app is not running
    res.status(404).json("App not running");
  }
});

module.exports = router;