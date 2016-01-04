'use strict'

var gulp = require('gulp')
var plugins = require('gulp-load-plugins')()
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var browserify = require('browserify')
var watchify = require('watchify')

gulp.task('default', ['serve', 'watchify'], function () {
  plugins.livereload.listen()
  gulp.watch('./public/css/**', ['sass'])
  gulp.watch('./public/views/**/*.html', plugins.livereload.changed)
})

gulp.task('serve', function () {
  plugins.nodemon({
    script: './index.js',
    watch: ['./index.js', 'src'],
    env: { 'ENV': 'development' }
  })
})

gulp.task('build', ['sass', 'browserify'])

gulp.task('sass', function () {
  gulp.src('./public/css/style.scss')
  .pipe(plugins.sass().on('error', plugins.sass.logError))
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.sass())
  .pipe(plugins.minifyCss())
  .pipe(plugins.sourcemaps.write('./'))
  .pipe(gulp.dest('./public/dist/css'))
  .pipe(plugins.livereload())
})

gulp.task('watchify', function () {
  // set up the browserify instance on a task basis
  var bundler = watchify(
    browserify({
      entries: './public/js/index.js',
      debug: true
    })
  ).transform('babelify', { presets: ['es2015', 'react'] })

  bundler.on('update', () => { compile(bundler) })
  return compile(bundler)
})

function compile (bundler) {
  return bundler.bundle()
  .on('error', handle)
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(plugins.sourcemaps.init({ loadMaps: true }))
  .pipe(plugins.sourcemaps.write('./'))
  .pipe(gulp.dest('./public/dist/js/'))
  .pipe(plugins.livereload())
}

function handle (err) {
  console.log(err.message)
  this.emit('end')
}
