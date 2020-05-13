const
  // development mode?
  devBuild = (process.env.NODE_ENV !== 'production'),

  // modules
  gulp = require('gulp'),
  newer = require('gulp-newer'),
  imagemin = require('gulp-imagemin'),
  browserSync = require('browser-sync').create(),
  noop = require('gulp-noop'),
  htmlclean = require('gulp-htmlclean'),
  concat = require('gulp-concat'),
  deporder = require('gulp-deporder'),
  terser = require('gulp-terser'),
  stripdebug = devBuild ? null : require('gulp-strip-debug'),
  sourcemaps = devBuild ? require('gulp-sourcemaps') : null,
  order = require("gulp-order"),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  assets = require('postcss-assets'),
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'),
  cssnano = require('cssnano'),
  rename = require('gulp-rename'),
  changed = require('gulp-changed'),
  ssi = require('browsersync-ssi'),



  // folders
  src = 'src/',
  build = 'build/'
  ;

  // image processing
function images() {

  const out = build + 'images/';

  return gulp.src(src + 'images/**/*')
    .pipe(newer(out))
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(out))
    .pipe(browserSync.reload({stream:true}));

};
exports.images = images;

// HTML processing
function html() {
  const out = build;

  return gulp.src(src + '**/*.html')
    .pipe(newer(out))
    .pipe(devBuild ? noop() : htmlclean())
    .pipe(gulp.dest(out))
    .pipe(browserSync.reload({stream:true}));
}
 exports.html = gulp.series(images, html); //this doesnt make much sense, why is it doing images too?
//exports.html = html; trying this instead

// JavaScript processing
function js() {

  return gulp.src(src + 'js/**/*')
    .pipe(sourcemaps ? sourcemaps.init() : noop())
    // .pipe(deporder())
    .pipe(order([
                'js/jquery-3.4.1.min.js',
                'js/jquery-migrate-3.1.0.min.js',
                // 'js/bootstrap.js',
                'js/mmenu.min.js',
                'js/tippy.all.min.js',
                'js/simplebar.min.js',
                'js/bootstrap-slider.min.js',
                'js/bootstrap-select.min.js',
                'js/snackbar.js',
                'js/clipboard.min.js',
                'js/counterup.min.js',
                'js/magnific-popup.min.js',
                'js/slick.min.js',
                'js/custom.js',
            ], { base: './src/' }))
    .pipe(concat('main.js'))
    .pipe(stripdebug ? stripdebug() : noop())
    .pipe(terser())
    .pipe(sourcemaps ? sourcemaps.write() : noop())
    .pipe(gulp.dest(build + 'js/'))
    .pipe(browserSync.reload({stream:true}));

}
exports.js = js;

// CSS processing
function css() {

  return gulp.src(src + 'sass/style.scss')
    //.pipe(sourcemaps ? sourcemaps.init() : noop())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'nested',
      imagePath: '/images/',
      precision: 3,
      errLogToConsole: true
    }).on('error', sass.logError))
    .pipe(postcss([
      assets({ loadPaths: ['images/'] }),
      autoprefixer(),
      mqpacker,
      cssnano
    ]))
  //  .pipe(sourcemaps ? sourcemaps.write() : noop())
.pipe(sourcemaps.write(build + 'css/'))
    .pipe(gulp.dest(build + 'css/'))
    //stream change to all browsers
    .pipe(browserSync.stream());

}
//exports.css = gulp.series(images, css); This loads images first for some reason, get rid
exports.css = css;

// watch for file changes
function watch(done) {
	browserSync.init({
        server: {
            baseDir: build,
            index: "/index.html",
            middleware: ssi({
                baseDir: __dirname+ '/src',
                ext: '.html',
                version: '1.4.0'
            })
        },
        open: false
    });

  // image changes
  gulp.watch(src + 'images/**/*', images);

  // html changes
  gulp.watch(src + '**/*.html', html);

  // css changes
  gulp.watch(src + 'sass/**/*', css);

  // js changes
  gulp.watch(src + 'js/**/*', js);

  done();

}
exports.watch = watch;

// run all tasks
exports.build = gulp.parallel(exports.html, exports.css, exports.js);

// default task
exports.default = gulp.series(exports.build, exports.watch);

