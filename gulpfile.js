var gulp = require('gulp'),
        del = require('del'),
        sass = require('gulp-sass'),
        twig = require('gulp-twig'),
        sourcemaps = require('gulp-sourcemaps'),
        fs = require('fs'),
        faker = require('gulp-faker'),
        browserSync = require('browser-sync').create(),
        htmlInjector = require("bs-html-injector"),
        svgmin = require('gulp-svgmin'),
        svgstore = require('gulp-svgstore'),
        rename = require('gulp-rename'),
        imagemin = require('gulp-imagemin'),
        config = require('./config');

//compile sass, create source maps, browser sync css
gulp.task('styles', function () {
    return gulp.src(config.styles.src + 'style.scss')
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(config.styles.dist));
});

var iconsPlugins = [{
        removeDimensions: true
    }, {
        removeComments: true
    }, {
        removeAttrs: {attrs: '.*:(fill|stroke)'}
    }];

gulp.task('svg', function () {
    return gulp.src(config.svg.src + 'images/*.svg')
            .pipe(svgmin({
                plugins: [{
                        removeDimensions: true
                    }, {
                        removeComments: true
                    }]
            }))
            .pipe(gulp.dest(config.svg.dist + 'images/'));
});



//compile twig templates
gulp.task('templates', function () {
    var data = JSON.parse(fs.readFileSync(config.templates.src + 'data.json'));
    return gulp.src(config.templates.src + '*.twig')
            .pipe(twig({data: data})).pipe(faker())
            .pipe(gulp.dest(config.templates.dist));
});

//copy scripts
gulp.task('scripts', function () {
    return gulp.src(config.scripts.src + '**/*.js').pipe(gulp.dest(config.scripts.dist));
});

//copy imgs
gulp.task('img', function () {
    return gulp.src(config.img.src + '*').pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
    ])).pipe(gulp.dest(config.img.dist));
});

gulp.task('copy', function () {
//    return es.concat(
//            gulp.src('./node_modules/bootstrap/scss/**/*.scss').pipe(gulp.dest(config.styles.src + 'vendor/bootstrap')),
//            gulp.src('./node_modules/bootstrap/dist/js/bootstrap.js').pipe(gulp.dest(config.scripts.src + 'plugins')),
//            gulp.src('./assets/icon-font/*').pipe(gulp.dest('./dist/icon-font/')),
//            gulp.src('./node_modules/flag-icon-css/flags/4x3/*').pipe(gulp.dest('./dist/svg/flags/'))
//            );

});

//cleans dist
gulp.task('clean', () => {
    return  del(['./dist/**', '!dist']);
});

//
gulp.task('serve', function () {
//    browserSync.use(htmlInjector, {
//        files: "./dist/*.html"
//    });
    browserSync.init({
        server: {
            baseDir: "./dist/"
        },
        watchOptions: {
            awaitWriteFinish: true
        }
    });
    gulp.watch(config.styles.src + '**/*.scss', gulp.series("styles")).on('change', browserSync.reload);
    gulp.watch(config.scripts.src + '**/*.js', gulp.series("scripts")).on('change', browserSync.reload);
    gulp.watch([config.templates.src + '**/*.twig', config.templates.src + 'data/*.json'], gulp.series("templates")).on('change', browserSync.reload);

});

//cleans dists and build project
gulp.task('default', gulp.series([...config.tasks.default]));

//cleans dists and build project for production
//gulp.task('build:production', function () {
//    runSequence('clean', function () {
//        runSequence(config.tasks.build);
//    });
//});