var fs = require('fs-extra');   // file system
var glob = require('glob');     // find files
var path = require('path');
var targz = require('tar.gz');  // extractor
var multer = require('multer'); // uploads
var config = require('./config');

// Define error handling:
var error = {}

// Forbidden error list
error.list = {
  errorMime : "Invalid file type. Must be a zip or tar.gz",
  noPkgJson : "App does not have package.json file",
  appExists : "App already exists",
  noMainExe : "No valid 'main' field in package.json."
}

error.handle = function (code, response) {
  console.log(error.list[code]);
  response.status(403).json(error.list[code]);
}

// Checks a tmpDir and moves into the sandbox if all OK
function install(tmpDir, req, res) {

  var result, pkgJson, appRoot, appTmpRoot, logo, main;
  
  // '?' char forces to return the first ocurrence in search
  const search = tmpDir + '/?**/package.json';
  result = glob.sync(search)[0] || path.join(tmpDir, 'package.json');

  if (!fs.existsSync(result)) {
    error.handle('noPkgJson', res);
    return;
  }

  pkgJson = fs.readJsonSync(result, {throws: false});
  appRoot = path.join(config.appsDir, pkgJson.name);
  appTmpRoot = result.substring(0, result.lastIndexOf("/"));

  if (fs.existsSync(appRoot)) {
    error.handle('appExists', res);
    return;
  }

  // Check if main is an executable file
  main = path.resolve(appTmpRoot, pkgJson.main);
  if (!fs.existsSync(main)) {
    error.handle('noMainExe', res);
    return;
  }
  fs.chmodSync(main, '755');

  fs.move(appTmpRoot, appRoot, function (err) {
    if (err) {
      console.error(err);
      throw err;
    }
    console.log("Moved %s to %s", appTmpRoot, appRoot);
    if (pkgJson.logo) {
      logo = path.resolve(appRoot, pkgJson.logo);
      if (fs.existsSync(logo)) {
        var imgDir = path.join(config.publicDir, 'img/apps');
        var dest =  path.join(imgDir, pkgJson.name + '-' + logo.split('/').pop());
        fs.copy(logo, dest, function (err) {
          if (err) 
            return console.error(err)
          else 
            console.log("- Logo copied to %s.", dest);
        });
      } else {
        console.log('- No logo found at %s', logo);
      }
    res.status(204).json("File uploaded");
    //Now remove tmp files
    fs.remove(tmpDir, function(removeError) {
      if (removeError) {
        console.log(removeError);
      } else {
        console.log("Dir \"%s\" was removed", tmpDir);
      }
    });
  });
}

Installer = {};

Installer.multer = multer({
  dest: config.tmpDir,
  rename: function (fieldname, filename, req, res) {
    return filename;
  },
  onFileUploadStart: function (file, req, res) {
    console.log('Upload mimetype: ' + file.mimetype);
    var fname = file.name;
    var ext = [fname.split('.')[1], fname.split('.')[2]].join('.');
    if(ext === 'tar.gz' || ext === 'tgz.' || ext === 'zip.') {
      console.log('Uploading file with extension ' + ext);
    } else {
      error.handle('errorMime', res)
      return false;
    }
  },
  onFileUploadComplete: function (file, req, res) {
    var tmpDir = path.join(config.tmpDir, '' + new Date().getTime());
    var tarball = path.join(config.tmpDir, file.name);
    var extract = new targz().extract(tarball, tmpDir,
      function(extractError){
        if(extractError) {
          console.log(extractError);
          res.status(500).json("Could not install the app");
        } else {
          install(tmpDir, req, res);
          //rm the tarball
          fs.remove(tarball, function(removeError) {
            if (removeError) {
              console.log(removeError);
            } else {
              console.log("Dir \"%s\" was removed", tarball);
            }
          });
        }
      });
  }
});

Installer.git = function (req, res) {
  var tmpDir = path.join(config.tmpDir, '' + new Date().getTime());
  console.log("Cloning from git...");
  console.log(req.body);
  var git = require("nodegit");
  var opts = {
    remoteCallbacks: {
      certificateCheck: function() {
        // github will fail cert check on some OSX machines
        // this overrides that check
        return 1;
      }
    }
  };

  git.Clone(req.body.gitURL, tmpDir, opts)
  .then(function(repository) {
    install(tmpDir, req, res);
  }, function(error) {
    res.status(403).json(error);
    console.log(error);
  });
};

module.exports = Installer;