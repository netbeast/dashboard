
var gulp = require('gulp')
var plugins = require('gulp-load-plugins')()
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var browserify = require('browserify')
var watchify = require('watchify')
var mocha = require('gulp-mocha')
var wait = require('gulp-wait')
var bg = require("gulp-bg");

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

gulp.task("start-bg", bgtask = bg("node", "./index.js"));

gulp.task('test',["start"], function(){
    // run test
    return gulp.src(
        ['./test/**/*.js'],
        {read: false})
      .pipe(wait(3000))
		  .pipe(mocha({reporter: 'spec', bail: true}))
      .pipe(gulp.dest(""))
      .once('end', function () {
        bgtask.setCallback(function(){process.exit(0);});
        bgtask.stop(0);
      })
      .once('error', function () {
        bgtask.setCallback(function(){process.exit(0);});
        bgtask.stop(0);
      })
})

gulp.task('build', ['sass', 'browserify'])

gulp.task('sass', function () {
  gulp.src('./public/styles/style.scss')
  .pipe(plugins.plumber())
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.sass())
  .pipe(plugins.autoprefixer())
  .pipe(plugins.cssnano())
  .pipe(plugins.sourcemaps.write('./'))
  .pipe(gulp.dest('./public/dist/css'))
  .pipe(plugins.livereload())
})

gulp.task('watchify', function () {
  // set up the browserify instance on a task basis
  var bundler = watchify(
    browserify({
      entries: './public/components/index.jsx',
      debug: true
    })
    ).transform('babelify', { presets: ['es2015', 'react'] })

  bundler.on('update', function () { compile(bundler) })
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
  .pipe(plugins.livereload())
}
