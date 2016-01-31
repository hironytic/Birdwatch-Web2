var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var webserver = require('gulp-webserver');
var mochaPhantomjs = require('gulp-mocha-phantomjs');
var gutil = require('gulp-util');

function bundle(entry, outFile, dest, doWatch) {
  var bundler = browserify({
    entries: [entry],
    debug: true,
    cache: {},
    packageCache: {}
  });
  if (doWatch) {
    bundler = watchify(bundler);
  }
  bundler.transform(babelify, {presets: ["es2015", "react"], plugins: ["transform-object-rest-spread"]})
  
  function rebundle() {
    if (doWatch) {
      gutil.log("Browserifying...");
    }
    
    return bundler.bundle()
      .on('error', function(err) { gutil.log("Error: " + gutil.colors.red(err.message)) })
      .pipe(source(outFile))
      .pipe(gulp.dest(dest))
  }
  
  bundler.on('update', rebundle);
  bundler.on('log', gutil.log);
  
  return rebundle();
}

gulp.task('browserify', ['set-dev-node-env'], function() {
  return bundle('./src/main.jsx', 'main.js', './app/', false);
});

gulp.task('browserify-test', ['set-dev-node-env'], function() {
  return bundle('./test/main.js', 'main.js', './testapp/', false);
});

gulp.task('watch', ['set-dev-node-env'], function() {
  return bundle('./src/main.jsx', 'main.js', './app/', true);
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

gulp.task('default', ['watch', 'webserver']);

gulp.task('test', ['browserify-test'], function() {
  return gulp.src('./testapp/index.html')
    .pipe(mochaPhantomjs({
      reporter: 'spec',
      phantomjs: {
        useColors: true,
      },
    }))
});
