var fs = require('fs');         // file system
var glob = require('glob');     // find files
var path = require('path');
var rimraf = require('rimraf'); // nodejs rm -rf
var targz = require('tar.gz');  // extractor
var multer = require('multer'); // uploads

function cp(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", done);

  var wr = fs.createWriteStream(target);
  wr.on("error", done);
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      if(err) console.log(err);
      if(cb)  cb(err);
      cbCalled = true;
    }
  }
}

var config = require('./helper');

var DIR = config.DIR;
var TMP = config.TMP;
var PUBLIC = path.join(config.PUBLIC, 'apps');

module.exports = multer({
  dest: TMP,
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
      res.status(403).json('Invalid file type. Must be a zip or tar.gz');
      return false;
    }
  },
  onFileUploadComplete: function (file, req, res) {
    var tmpDir = path.join(TMP, '' + new Date().getTime());
    var tarball = path.join(TMP, file.name);
    var extract = new targz().extract(tarball, tmpDir,
      function(extractError){
        if(extractError) {
          console.log(extractError);
          res.status(500).json("Could not install the app");
        } else {
          console.log('The extraction has ended!');

          // Now check if the app exists
          var result, packageJSON, appRoot, logo
          SEARCH = tmpDir + '/?**/package.json';
          // find all package.json
          // the '?' char means ONLY first ocurrence in search
          result = glob.sync(SEARCH)[0];

          if (result) {
            packageJSON = JSON.parse(fs.readFileSync(result, 'utf8'));
            //Move the folder from tmp to the sandbox
            appRoot = path.join(DIR, packageJSON.name);
            appTmpRoot = result.substring(0, result.lastIndexOf("/"));
            if(!fs.existsSync(appRoot)) {
              fs.renameSync(appTmpRoot, appRoot);
              //upload logo if exist
              if (packageJSON.logo) {
                logo = path.join(appRoot, packageJSON.logo);
                if (fs.existsSync(logo)) {
                  cp(logo, path.join(PUBLIC,
                    packageJSON.name + '-' + logo.split('/').pop()));
                } else {
                  console.log('No logo found at ' + logo);
                }
              } else {
                console.log('No logo present in package.json');
              }
              console.log("File uploaded");
              res.status(204).json("File uploaded");
            } else {
              console.log("App already exists");
              res.status(403).json("App already exists");
            }
          } else {
            console.log("App does NOT have package.json file");
            res.status(403).json("App does NOT have package.json file");
          }

          //Now remove tmp files
          rimraf(tmpDir, function(rimrafError) {
            if (rimrafError) {
              console.log(rimrafError);
            } else {
              console.log("Dir \"" + tmpDir + "\" was removed");
            }
          });
          rimraf(tarball, function(rimrafError) {
            if (rimrafError) {
              console.log(rimrafError);
            } else {
              console.log("Dir \"" + tmpDir + "\" was removed");
            }
          });
        }
      });
    }
  });
