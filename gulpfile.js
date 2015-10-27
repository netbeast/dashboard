'use strict'

var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var browserify = require('browserify')
var nodemon = require('gulp-nodemon')
var sass = require('gulp-sass')
var minify = require('gulp-minify-css')

gulp.task('default', ['serve'], function () {
  gulp.watch('./web/assets/css/**', ['sass'])
  gulp.watch('./web/assets/js/**', ['browserify'])
})

gulp.task('serve', function () {
  nodemon({
    script: './index.js',
    ignore: ['test', '.sandbox/*', '*.md', '*.txt', 'web/*'],
    env: { 'ENV': 'development' }
  })
})

gulp.task('sass', function () {
  gulp.src('./web/assets/css/style.scss')
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(minify())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./web/dist/css'))
})

gulp.task('browserify', function () {
  // set up the browserify instance on a task basis
  var bundler = browserify({
    entries: './web/assets/js/index.js',
    debug: true
  })

  return bundler.bundle()
  .on('error', function (err) {
    // print the error (can replace with gulp-util)
    console.log(err.message)
    // end this stream
    this.emit('end')
  })
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./web/dist/js/'))
})
