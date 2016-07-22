'use strict';

let gulp = require('gulp');
let $ = require('gulp-load-plugins')();

gulp.task('css', () => {
  return gulp.src('build/stylesheets/main.css', {base: 'build'})
    .pipe($.autoprefixer({browsers: ['last 2 versions', '> 10%']}))
    .pipe(gulp.dest('optimized-build'))
});

gulp.task('default', () => {
  console.log('pero claro');
});