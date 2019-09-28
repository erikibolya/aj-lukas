var gulp          = require('gulp'),
    config        = require('../config');

gulp.task('copy', function() {
    var a = gulp.src('./node_modules/bootstrap/scss/**/*.scss')
    .pipe(gulp.dest(config.styles.src + 'vendor/bootstrap'))
    var b = gulp.src('./node_modules/bootstrap/dist/js/bootstrap.js')
    .pipe(gulp.dest(config.scripts.src + 'plugins'));
    var c = gulp.src('./assets/icon-font/*')
    .pipe(gulp.dest('./dist/icon-font/'))
    var d = gulp.src('./node_modules/flag-icon-css/flags/4x3/*')
    .pipe(gulp.dest('./dist/svg/flags/'))
    return merge(a,b,c,d);
});
