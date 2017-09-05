'use strict';

var gulp = require('gulp'),
  gulpSequence = require('gulp-sequence'),
  assetsVersionReplace = require("../index"),
  flatten = require('gulp-flatten');

gulp.task('assetsVersionReplace', function () {
  gulp.src(['css_build/*.css', 'js_build/*.js'], {base: '.'})
    .pipe(assetsVersionReplace({
      replaceTemplateList: [
        'php-templates/header.php',
        'php-templates/footer.php'
      ]
    }))
    // Keep the same folder level for correct relative image links in css
    .pipe(flatten())
    .pipe(gulp.dest('dist/'))
});


gulp.task('default', gulpSequence('assetsVersionReplace'))