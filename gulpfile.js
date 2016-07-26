'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');

const browserSync = require('browser-sync');
const reload = browserSync.reload;

const del = require('del');


gulp.task('styles', () => {
  return gulp.src('source/stylesheets/main.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/stylesheets'))
    .pipe(reload({stream: true}));
});

gulp.task('sass-lint', () => {
  return gulp.src('source/stylesheets/*.scss')
    .pipe($.sassLint({
      configFile: 'sass-lint.yml'
    }))
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError())
});

const browserifyBabelify = watch => {
  const rebundle = bundler => {
    bundler.bundle()
      .on('error', err => {
        console.error(err);
        this.emit('end');
      })
      .pipe(source('main.js'))
      .pipe(buffer())
      .pipe($.plumber())
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('./.tmp/javascripts'))
      .pipe(reload({ stream: true }));
    console.log('-> done bundling!');
  }

  if (watch) {
    var bundler = watchify(browserify('./source/javascripts/main.js', { debug: true }).transform(babelify));
    rebundle(bundler);
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle(bundler);
    });
  }
  else {
    var bundler = browserify('./source/javascripts/main.js', { debug: true }).transform(babelify)
    rebundle(bundler);
  }
}

gulp.task('build-js', () => browserifyBabelify(false) );

gulp.task('watch-js', () => browserifyBabelify(true) );

gulp.task('clean', del.bind(null, ['.tmp', 'build']));

gulp.task('serve', ['styles', 'watch-js'], () => {
  browserSync({
    notify: false,
    port: 9000,
    proxy: 'http://localhost:4567/'
  });

  gulp.watch('source/stylesheets/**/*.scss', ['styles']);
});

gulp.task('build', ['styles', 'build-js']);

gulp.task('default', ['serve']);