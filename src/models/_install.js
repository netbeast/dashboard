var path = require('path')
var Url = require('url')
var exec = require('child_process').exec

var Decompress = require('decompress')
var request = require('superagent')
var git = require('gift')
var fs = require('fs-extra')

var ApiError = require('../util/api-error')
var broker = require('../helpers/broker')

function _installDeps (app, done) {
  const root = path.join(process.env.APPS_DIR, app.name)
  const modules = path.join(root, 'node_modules')

  if (fs.existsSync(modules)) {
    return done(null, app)
  }

  broker.info('Downloading ' + app.name + ' dependencies...')

  exec('npm i', {cwd: root}, function (err, data) {
    return done(err, app) // data is not app
  })
}

function _installFromDir (dir, done) {
  const file = path.join(dir, 'package.json')

  if (!fs.existsSync(file)) {
    return done(new Error('App does not have a package.json'))
  }

  const appJson = fs.readJsonSync(file, {throws: false})
  if (!appJson) {
    return done(new Error("App's package.json is malformed"))
  }

  const appRoot = path.join(process.env.APPS_DIR, appJson.name)
  if (fs.existsSync(appRoot)) {
    return done(new ApiError('App already exists', 422))
  }

  // Check if main is an executable file
  const main = path.resolve(dir, appJson.main)
  if (!fs.existsSync(main)) {
    return done(new Error('App does not have a main executable'))
  } else {
    fs.chmodSync(main, '700')
  }

  broker.info('Setting everything up for you...')

  fs.move(dir, appRoot, function (err) {
    if (err) return done(err)

    _installDeps(appJson, function (err, appJson) {
      if (!err) return done(null, appJson)

      // Swapping if (err) we get rid of a nesting level
      fs.remove(appRoot, function (removalError) {
        if (removalError) broker.error(removalError.message)
        done(err)
      })
    })
  })
}

function _installFromTar (tarball, done) {
  const tmpDir = path.join(process.env.TMP_DIR, '' + new Date().getTime())

  broker.info('Unbundling app ...')
  new Decompress().src(tarball).dest(tmpDir)
  .use(Decompress.targz({ strip: 1 })).run(function (err) {
    if (err) return done(err)

    _installFromDir(tmpDir, function (err, appJson) {
      fs.remove(tmpDir, function (err) {
        if (err) return done(err)
      })

      fs.remove(tarball, function (err) {
        if (err) return done(err)
      })

      if (err) return done(err)
      else return done(null, appJson)
    })
  })
}

function _installFromGit (url, done) {
  var tmpDir = path.join(process.env.TMP_DIR, '' + new Date().getTime())
  git.clone(url, tmpDir, function (err, repo) {
    if (err) return done(err)

    _installFromDir(repo.path, done)
  })
}

function _installFromNetbeast (url, done) {
  console.log('[install] downloading from %s...', url)
  const DOWNLOAD_PATH = '/tmp/app-' + new Date().getTime() + '.tar.gz'
  request({uri: url})
  .pipe(fs.createWriteStream(DOWNLOAD_PATH))
  .on('finish', function () {
    broker.info('Download finished...')
    _installFromTar(DOWNLOAD_PATH, done)
  })
  .on('error', done)
}

function _installFromUrl (url, done) {
  const host = Url.parse(url).host

  if (host === 'netbeast.co') {
    broker.info('Installing from Netbeast repos...')
    _installFromNetbeast(url, done)
  } else {
    broker.info('Installing from git...')
    _installFromGit(url, done)
  }
}

module.exports = {
  from: {
    dir: _installFromDir,
    git: _installFromGit,
    url: _installFromUrl,
    tar: _installFromTar
  }
}
