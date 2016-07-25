'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync');
const del = require('del');

const reload = browserSync.reload;

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

gulp.task('build', ['styles']);
gulp.task('default', ['styles']);