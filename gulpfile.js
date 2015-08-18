'use strict';

var gulp = require('gulp')
, sourcemaps = require('gulp-sourcemaps')
, source = require('vinyl-source-stream')
, buffer = require('vinyl-buffer')
, browserify = require('browserify')
, sass = require('gulp-sass')
, nodemon = require('gulp-nodemon')
, minify = require('gulp-minify-css')
, gutil = require('gulp-util');

gulp.task('default', ['serve'], function() {
  gulp.watch('./public/assets/css/**', ['sass']);
  gulp.watch('./public/assets/js/**', ['browserify']);
});

gulp.task('serve', function () {
  nodemon({ 
    script: './www',
    ext: 'js',
    ignore: ["sandbox/*", "*.md", "*.txt", "public/*"] 
  })
  .on('restart', function () {
    console.log('restarted!')
  });
});

gulp.task('sass', function () {
	gulp.src('./public/assets/css/style.scss')
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(minify())
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('./public/dist/css'));
});

gulp.task('browserify', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
  	entries: './public/assets/js/index.js',
  	debug: true
  });
  return b.bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init())
  .on('error', gutil.log)
  .pipe(sourcemaps.write({
    includeContent: false, 
    sourceRoot: './public/dist/js/'
  })).pipe(gulp.dest('./public/dist/js/'));
});