'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');

const browserSync = require('browser-sync');
const reload = browserSync.reload;

const del = require('del');
const exec = require('child_process').exec;


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

gulp.task('styles-minify', ['styles'], () => {
  return gulp.src('.tmp/stylesheets/main.css')
    .pipe($.cssnano({safe: true, autoprefixer: false}))
    .pipe(gulp.dest('.tmp/stylesheets/'))
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
    var bundler = browserify('./source/javascripts/main.js', { debug: true }).transform(babelify);
    rebundle(bundler);
  }
}

gulp.task('build-js', () => browserifyBabelify(false) );

gulp.task('watch-js', () => browserifyBabelify(true) );

gulp.task('rename-main-js', ['build-js'], cb => {
  exec('sleep 1 && mv .tmp/javascripts/{main,main-unminified}.js', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('scripts-minify', ['rename-main-js'], () => {
  return gulp.src('.tmp/javascripts/main-unminified.js')
    .pipe($.uglify())
    .pipe($.rename('main.js'))
    .pipe(gulp.dest('.tmp/javascripts'));
});

gulp.task('delete-extra-js', ['scripts-minify'], cb => {
  exec('rm .tmp/javascripts/main-unminified.js', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('lint', () => {
  return gulp.src('source/javascripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()))
    .pipe(gulp.dest('source/javascripts'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'build']));

gulp.task('serve', ['styles', 'watch-js'], () => {
  browserSync({
    notify: false,
    port: 9000,
    proxy: 'http://localhost:4567/',
    browser: 'google chrome'
  });

  gulp.watch([
    'source/**/*.erb',
    'data/*.yml'
  ]).on('change', () => setTimeout(() => reload(), 1500));

  gulp.watch('source/stylesheets/**/*.scss', ['styles']);
});

gulp.task('build', ['styles-minify', 'delete-extra-js']);

gulp.task('default', ['serve']);