const PORT = process.env.PORT || 1340;

const fs        = require('fs');
const pump      = require('pump');
const gulp      = require('gulp');
const gls       = require('gulp-live-server');
const sass      = require('gulp-sass');
const cleanCSS  = require('gulp-clean-css');
const uglify    = require('gulp-uglify');
const rename    = require('gulp-rename');
const replace   = require('gulp-replace');
const concat    = require('gulp-concat');
const newer     = require('gulp-newer');
const imagemin  = require('gulp-imagemin');
const prefixCSS = require('gulp-autoprefixer');
const htmlmin   = require('gulp-htmlmin');
const assetsVer = require('gulp-asset-version');

const folders = {
  src: './src',
  dist: './dist'
};

gulp.task('html', function () {
  //var replacement = fs.readFileSync(folders.dist + '/dist.min.js', 'utf8').toString();

  gulp.src(folders.src + '/pages/**/*.html')
    //.pipe(replace('<script id="lazy-load"></script>', '<script id="lazy-load">/*' + replacement + '*/</script>'))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest(folders.dist));

  gulp.src(folders.dist + '/pages/**/*.html')
      .pipe(assetsVer())
      .pipe(gulp.dest(folders.dist));
});

gulp.task('sass', function () {
  gulp.src([folders.src + '/assets/sass/**.scss', folders.src + '/assets/sass/**/**.scss'])
      .pipe(sass().on('error', sass.logError))
      .pipe(prefixCSS())
      .pipe(cleanCSS())
      .pipe(rename('dist.min.css'))
      .pipe(gulp.dest(folders.dist));

  gulp.src(folders.dist + '/dist.min.css')
      .pipe(assetsVer())
      .pipe(gulp.dest(folders.dist));
});

gulp.task('scripts', function () {
  return gulp.src(folders.src + '/assets/scripts/**.js')
      .pipe(concat('dist.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest(folders.dist));
});

gulp.task('fonts', function () {
  return gulp.src(folders.src + '/assets/fonts/*')
      .pipe(gulp.dest(folders.dist + '/fonts/'));
});

gulp.task('res', function () {
  gulp.src(folders.src + '/favicon.ico').pipe(gulp.dest(folders.dist));
  gulp.src(folders.src + '/.htaccess').pipe(gulp.dest(folders.dist));
});

gulp.task('images', function () {
  return gulp.src(folders.src + '/assets/images/**')
      .pipe(newer(folders.dist + '/images/'))
      .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 7}),
        imagemin.svgo({plugins: [{removeViewBox: true}]})
      ], {verbose: true}))
      .pipe(gulp.dest(folders.dist + '/images/'));
});

gulp.task('watch', function () {
  gulp.watch(folders.src + '/pages/**/*.html', [ 'html' ]);
  gulp.watch([folders.src + '/assets/sass/**.scss', folders.src + '/assets/sass/**/**.scss'], [ 'sass' ]);
  gulp.watch(folders.src + '/assets/fonts/**', [ 'fonts' ]);
  gulp.watch(folders.src + '/assets/images/**', [ 'images' ]);
  gulp.watch(folders.src + '/assets/scripts/**', [ 'scripts' ]);
});

gulp.task('serve', function () {
  var server = gls.static('dist', PORT);

  var files = [
    'src/pages/**/*.html',
    'src/assets/sass/**.scss',
    'src/assets/sass/**/*.scss',
    'src/assets/fonts/**.*',
    'src/assets/images/**.*',
    'src/assets/scripts/**.js',
  ];

  gulp.watch(files, function (file) {
    server.notify.apply(server, [file]);
  });

  server.start();
});

gulp.task('default', [ 'sass', 'scripts', 'fonts', 'res', 'images', 'html', 'watch', 'serve' ]);