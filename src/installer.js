var fs = require('fs-extra')   // file system
, exec = require('child_process').exec
, path = require('path')
, www = require('../www')
, multer = require('multer') // uploads
, config = require('../config')
, error = require('./error')

// Checks a tmpDir and moves into the sandbox if all OK
function install(tmpDir, callback) {

  var file, pkgJson, appRoot, logo, main;

  file = path.join(tmpDir, 'package.json');

  if (!fs.existsSync(file))
    return callback.call(this, 'noPkgJson');

  pkgJson = fs.readJsonSync(file, {throws: false});

  if (!pkgJson)
    return callback.call(this, 'badJson');

  www.io.emit('stdout', 'Attempting to install...');
  appRoot = path.join(config.appsDir, pkgJson.name);

  if (fs.existsSync(appRoot))
    return callback.call(this, 'appExists');

  // Check if main is an executable file
  main = path.resolve(tmpDir, pkgJson.main);
  if (!fs.existsSync(main))
    return callback.call(this, 'noMainExe'); 
  else
    fs.chmodSync(main, '700');

  fs.move(tmpDir, appRoot, function (err) {
    if (err) {
      console.error(err);
      throw err;
    }

    //exec scripts if any
    www.io.emit('stdout', 'Running package.json scripts...');
    for (var key in pkgJson.scripts) {
      exec(pkgJson.scripts[key], {cwd: appRoot}, function(err, stdout, stderr) {
        if (err) throw err;
        console.error("[%s] stderr: %s", pkgJson.scripts[key], stderr);
        console.error("[%s] stdout: %s", pkgJson.scripts[key], stdout);
      })
    }

    callback.call(this, null);
  });
}

Installer = {};

Installer.multer = multer({
  dest: config.tmpDir,
  rename: function (fieldname, filename, req, res) {
    return '' + new Date().getTime() + '.tgz';
  },
  onFileUploadComplete: function (file, req, res) {
    var tmpDir = path.join(config.appsDir, '' + new Date().getTime());
    fs.mkdirSync(tmpDir, '0755');
    var tarball = path.join(config.tmpDir, file.name);
    www.io.emit('stdout', 'Decompressing bundle...');
    var cmd = "tar xf " + tarball + " -C " + tmpDir + " --strip-components=1";
    exec(cmd, function(err) {
      if(err) {
        error.handle(err, res);
      } else {
        install(tmpDir, function (err) {
          www.io.emit('stdout', 'Cleaned temporary files.');
          if (err) {
            error.handle(err, res);
          } else {
            res.status(204).send("ok");
          }
        });
      }
      fs.remove(tarball, function(err) {
        if (err) throw err;
      });
    });
  }
});

module.exports = Installer;