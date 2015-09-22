'use strict'

var gulp = require('gulp')
, sourcemaps = require('gulp-sourcemaps')
, source = require('vinyl-source-stream')
, buffer = require('vinyl-buffer')
, browserify = require('browserify')
, nodemon = require('gulp-nodemon')
, sass = require('gulp-sass')
, spawn = require('child_process').spawn
, minify = require('gulp-minify-css')
, gutil = require('gulp-util')

gulp.task('default', ['serve'], function() {
  gulp.watch('./public/assets/css/**', ['sass'])
  gulp.watch('./public/assets/js/**', ['browserify'])
})

gulp.task('serve', function () {
  nodemon({ script: './www', ignore: [
    ".sandbox/*", "tmp/*", "*.md", "*.txt", "public/*"] })
})

gulp.task('sass', function () {
  gulp.src('./public/assets/css/style.scss')
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(minify())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./public/dist/css'))
})

gulp.task('browserify', function () {
  // set up the browserify instance on a task basis
  var bundler = browserify({
    entries: './public/assets/js/index.js',
    debug: true
  })

  return bundler.bundle()
  .on('error', function(err) {
    // print the error (can replace with gulp-util)
    console.log(err.message)
    // end this stream
    this.emit('end')
  })
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./public/dist/js/'))
})