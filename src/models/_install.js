var path = require('path')
var config = require('../../config')
var Decompress = require('decompress')
var git = require('gift')
var fs = require('fs-extra')

function _installFromDir (dir, done) {
  var file, pkgJson, appRoot, main
  file = path.join(dir, 'package.json')
  if (!fs.existsSync(file)) {
    return done(new Error('App does not have a package.json'))
  }

  pkgJson = fs.readJsonSync(file, {throws: false})
  if (!pkgJson) {
    return done(new Error("App's package.json is malformed"))
  }

  appRoot = path.join(config.appsDir, pkgJson.name)
  if (fs.existsSync(appRoot)) {
    return done(new Error('App already exists'))
  }

  // Check if main is an executable file
  main = path.resolve(dir, pkgJson.main)
  if (!fs.existsSync(main)) {
    return done(new Error('App does not have a main executable'))
  } else {
    fs.chmodSync(main, '700')
  }

  fs.move(dir, appRoot, function (err) {
    if (err) return done(err)
    done(null, pkgJson)
  })
}

function _installFromTar (tarball, done) {
  var tmpDir = path.join(config.tmpDir, '' + new Date().getTime())

  new Decompress({mode: '755'}).src(tarball)
  .dest(tmpDir).use(Decompress.targz({strip: 1}))
  .run(function (err) {
    if (err) return done(err)

    _installFromDir(tmpDir, function (err, appJson) {
      fs.remove(tmpDir, function (err) {
        if (err) return done(err)
      })

      fs.remove(tarball, function (err) {
        if (err) return done(err)
      })

      if (err) return done(err)
      else return done()
    })
  })
}

function _installFromGit (url, done) {
  var tmpDir = path.join(config.tmpDir, '' + new Date().getTime())
  git.clone(url, tmpDir, function (err, repo) {
    if (err) return done(err)

    console.log("CLONING")
    _installFromDir(repo.path, function (err, appJson) {
      if (err) return done(err)

      return done()
    })
  })
}

module.exports = {
  from: {
    dir: _installFromDir,
    git: _installFromGit,
    tar: _installFromTar
  }
}
