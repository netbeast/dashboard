
var gulp = require('gulp')
var plugins = require('gulp-load-plugins')()
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var browserify = require('browserify')
var watchify = require('watchify')
var lrload = require('livereactload')

gulp.task('default', ['serve', 'watchify'], function () {
  plugins.livereload.listen()
  gulp.watch('./public/styles/*.scss', ['sass'])
})

gulp.task('serve', function () {
  plugins.nodemon({
    script: './index.js',
    watch: ['./index.js', 'src']
  })
})

gulp.task('build', ['sass', 'browserify'])

gulp.task('sass', function () {
  gulp.src('./public/styles/style.scss')
  .pipe(plugins.plumber())
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.sass())
  .pipe(plugins.autoprefixer())
  .pipe(plugins.minifyCss())
  .pipe(plugins.sourcemaps.write('./'))
  .pipe(gulp.dest('./public/dist/css'))
  .pipe(plugins.livereload())
})

gulp.task('watchify', function () {
  // set up the browserify instance on a task basis
  var bundler = watchify(
    browserify({
      entries: './public/components/index.jsx',
      plugin: [ lrload ],
      debug: true
    })
    ).transform('babelify', { presets: ['es2015', 'react'] })

  bundler.on('update', () => { compile(bundler) })
  return compile(bundler)
})

gulp.task('browserify', function () {
  // set up the browserify instance on a task basis
  var bundler = browserify({
    entries: './public/components/index.jsx',
    debug: true
  }).transform('babelify', { presets: ['es2015', 'react'] })

  return compile(bundler)
})

function compile (bundler) {
  return bundler.bundle()
  .on('error', function (err) {
    console.error(err.message)
    this.emit('end')
  })
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(plugins.sourcemaps.init({ loadMaps: true }))
  .pipe(plugins.sourcemaps.write('./'))
  .pipe(gulp.dest('./public/dist/js/'))
}
