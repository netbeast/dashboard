var path = require('path')
var Url = require('url')
var npm = require('npm')

var Decompress = require('decompress')
var git = require('gift')
var fs = require('fs-extra')
var request = require('superagent')

var broker = require('../helpers/broker')

function _launchPlugin (app) {
  var type = app.netbeast ? app.netbeast.type : 'app'
  if (type === 'service' || type === 'plugin' || app.bootOnLoad) {
    request.post(process.env.LOCAL_URL + '/activities/' + app.name)
    .end(function (err, port) {
      if (err) return broker.error(err)

      console.info('[booting] %s launched on port %s ', app.name, port.port)
      broker.info(app.name + ' plugin launched on port ' + port.port)
    })
  }
}

function _installDeps (app, done) {
  const root = path.join(process.env.APPS_DIR, app.name)
  const modules = path.join(root, 'node_modules')
  const dependencies = Object.keys(app)

  if (fs.existsSync(modules)) {
    _launchPlugin(app)
    return done(null, app)
  }

  broker.info('Downloading ' + app.name + ' dependencies...')
  npm.load({ prefix: root }, function (err) {
    if (err) return done(err)
    npm.commands.install(dependencies, function (err, data) {
      _launchPlugin(app)
      done(null, app)
    })
  })
}

function _installFromDir (dir, done) {
  const file = path.join(dir, 'package.json')

  broker.info('Setting everything up for you...')

  if (!fs.existsSync(file)) {
    return done(new Error('App does not have a package.json'))
  }

  const appJson = fs.readJsonSync(file, {throws: false})
  if (!appJson) {
    return done(new Error("App's package.json is malformed"))
  }

  const appRoot = path.join(process.env.APPS_DIR, appJson.name)
  if (fs.existsSync(appRoot)) {
    return done(new Error('App already exists'))
  }

  // Check if main is an executable file
  const main = path.resolve(dir, appJson.main)
  if (!fs.existsSync(main)) {
    return done(new Error('App does not have a main executable'))
  } else {
    fs.chmodSync(main, '700')
  }

  fs.move(dir, appRoot, function (err) {
    if (err) return done(err)

    _installDeps(appJson, done)
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
