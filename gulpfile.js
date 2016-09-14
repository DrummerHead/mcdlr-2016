const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const sourceStream = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const rollupify = require('rollupify');
const babelify = require('babelify');
const uglifyify = require('uglifyify');

const browserSync = require('browser-sync');
const reload = browserSync.reload;

const del = require('del');
const exec = require('child_process').exec;


// Style
// =======================

gulp.task('styles', () =>
  gulp.src('source/stylesheets/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.'],
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'] }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/stylesheets'))
);


// Style minification
// -----------------------

gulp.task('styles-minify', ['styles'], () =>
  gulp.src('.tmp/stylesheets/*.css')
    .pipe($.cssnano({ safe: true, autoprefixer: false }))
    .pipe(gulp.dest('.tmp/stylesheets/'))
);


// Style linting
// -----------------------

gulp.task('sass-lint', () =>
  gulp.src('source/stylesheets/**/*.scss')
    .pipe($.sassLint({
      configFile: '.sass-lint.yml',
    }))
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError())
);

gulp.task('scss-lint', ['sass-lint'])


// JavaScript
// =======================

const browserifyBabelify = ({ sourceFile = 'main', watch = true } = {}) => {
  const rebundle = bundler => {
    bundler.bundle()
      .on('error', err => {
        console.error(err);
        this.emit('end');
      })
      .pipe(sourceStream(`${sourceFile}.js`))
      .pipe(buffer())
      .pipe($.plumber())
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('./.tmp/javascripts'))
      .pipe(reload({ stream: true }));
    console.log('-> done bundling!');
  };

  if (watch) {
    const bundler = watchify(
      browserify(`./source/javascripts/${sourceFile}.js`, { debug: true })
        .transform(babelify)
    );
    rebundle(bundler);
    bundler.on('update', () => {
      console.log('-> bundling...');
      rebundle(bundler);
    });
  } else {
    const bundler = browserify(`./source/javascripts/${sourceFile}.js`, { debug: true })
      .transform(rollupify)
      .transform(babelify)
      .transform(uglifyify);

    rebundle(bundler);
  }
};

gulp.task('build-js', () => browserifyBabelify({ watch: false }));

gulp.task('watch-js', () => browserifyBabelify());

gulp.task('build-js-color', () => browserifyBabelify({ sourceFile: 'color-test', watch: false }));

gulp.task('watch-js-color', () => browserifyBabelify({ sourceFile: 'color-test' }));


// JavaScript minification
// -----------------------

gulp.task('rename-main-js', ['build-js'], cb => {
  exec('sleep 2 && mv .tmp/javascripts/{main,main-unminified}.js', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('scripts-minify', ['rename-main-js'], () =>
  gulp.src('.tmp/javascripts/main-unminified.js')
    .pipe($.uglify())
    .pipe($.rename('main.js'))
    .pipe(gulp.dest('.tmp/javascripts'))
);

gulp.task('delete-extra-js', ['scripts-minify'], cb => {
  exec('rm .tmp/javascripts/main-unminified.js', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});


// JavaScript linting
// -----------------------

const jsLint = source => () =>
  gulp.src(source)
    .pipe(reload({ stream: true, once: true }))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));

gulp.task('js-lint', jsLint('source/javascripts/**/*.js'));

gulp.task('gulpfile-lint', jsLint('gulpfile.js'));


// Helper
// =======================

gulp.task('clean', del.bind(null, ['.tmp', 'build']));


// Serving
// =======================

gulp.task('serve', ['styles', 'watch-js'], () => {
  browserSync({
    notify: false,
    port: 9000,
    proxy: 'http://localhost:4567/',
    browser: 'google chrome',
  });

  gulp.watch([
    'source/**/*.erb',
    'data/*.yml',
  ]).on('change', () => setTimeout(reload, 2000));

  gulp.watch([
    '.tmp/stylesheets/*.css'
  ]).on('change', reload);

  gulp.watch('source/stylesheets/**/*.scss', ['styles']);
});


// Building
// =======================

gulp.task('build', ['styles-minify', 'delete-extra-js']);


// Default
// =======================

gulp.task('default', ['serve']);
