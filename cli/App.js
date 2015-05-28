// xway App model
// by jesusdario
// CTO @ NetBeast

/* Requirements */
var fs = require('fs-extra'); // filesystem
var colors = require('colors'); // colourful prompt
var path = require('path');
var exec = require('child_process').exec, child;
var targz = require('tar.gz');

var self;
/* Application constructor */
function App(name) {
  self = this;
  self.name = name;
}

var sampleTgz = path.join(__dirname, 'sample-app.tgz');
var currentDir = process.cwd();

/* Non-static methods and properties */
App.prototype = {
  constructor: App,
  new: function () {
    quitIfExists(self.name);
    var destination = path.join(currentDir, self.name);
    var destJson = path.join(destination, 'package.json');
    console.log("# Creating app \"%s\"...", self.name);
    var extract = new targz().
    extract(sampleTgz, currentDir, function(err){
      if(err) {
        console.trace(err);
      }
      fs.renameSync('./sample-app', destination);
      var pkgJson = fs.readJsonSync(destJson);
      pkgJson.name = self.name;
      fs.writeJsonSync(destJson, pkgJson);
      console.log('The extraction has ended!');
    });
  },
  rm: function () {
    quitIfNotExists(self.name);
    fs.remove(path.join('./', self.name), function(error) {
      if (error) {
        console.log(error);
      } else {
        console.log("Dir \"%s\" was removed", self.name);
      }
    });
  },
  pkg: function (options) {
    var from = self.name || './';
    var to = options.to || path.join('./', 'application.tar.gz');
    quitIfNotExists(from);
    quitIfExists(to);
    console.log('Packaging app from %s to %s', from, to);
    var compress = new targz()
    .compress(from, to, function(err){
      if(err)
        console.log(err);

      console.log('The compression has ended!');
    });
  },
  unpkg: function (options) {
    var from = self.name || './';
    var to = options.to || path.join('./');
    quitIfNotExists(from);
    console.log('Unpackaging app from %s to %s', from, to);
    var extract = new targz().
    extract(from, to, function(err){
      if(err)
        console.log(err);
      console.log('The extraction has ended!');
    });
  }
}

function quitIfExists(file) {
  if(fs.existsSync(file)) {
    console.log("Directory \"%s\" already exists".red, file);
    process.exit(0);
  }
}

function quitIfNotExists(file) {
  if(!fs.existsSync(file)) {
    console.log("Directory \"%s\" does not exists".red, file);
    process.exit(0);
  }
}

module.exports = App;
