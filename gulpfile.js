var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var webserver = require('gulp-webserver');
var mochaPhantomjs = require('gulp-mocha-phantomjs');

gulp.task('browserify', ['set-dev-node-env'], function() {
  return browserify('./src/main.jsx', { debug: true })
    .transform(babelify, {presets: ["es2015", "react"], plugins: ["transform-object-rest-spread"]})
    .bundle()
    .on("error", function (err) { console.log("Error : " + err.message); })
    .pipe(source('main.js'))
    .pipe(gulp.dest('./app/'))
});

gulp.task('browserify-test', ['set-dev-node-env'], function() {
  return browserify('./test/main.js')
    .transform(babelify, {presets: ["es2015", "react"], plugins: ["transform-object-rest-spread"]})
    .bundle()
    .on("error", function (err) { console.log("Error : " + err.message); })
    .pipe(source('main.js'))
    .pipe(gulp.dest('./testapp/'))
});

gulp.task('watch', function() {
  watch(['./src/**/*.jsx', './src/**/*.js'], batch(function (events, done) {
    gulp.start('browserify', done);
  }));
});

gulp.task('webserver', function() {
  return gulp.src('./app')
    .pipe(webserver({
      livereload: true,
    }));
});

gulp.task('set-dev-node-env', function() {
  return process.env.NODE_ENV = 'development';
});

gulp.task('default', ['browserify', 'watch', 'webserver']);

gulp.task('test', ['browserify-test'], function() {
  return gulp.src('./testapp/index.html')
    .pipe(mochaPhantomjs({
      reporter: 'spec',
      phantomjs: {
        useColors: true,
      },
    }))
});
