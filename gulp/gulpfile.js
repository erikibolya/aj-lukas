var gulp          = require('gulp'),
    config        = require('./config.json'),
    requireDir    = require('require-dir'),
    runSequence   = require('run-sequence');


requireDir('./gulp', { recurse: true});

// Default task
gulp.task('default', function(){
    runSequence('clean', 'copy', function() {
        runSequence(config.tasks.default)
    })
});

gulp.task('build:production', function() {
  runSequence('clean', 'copy', function() {
    runSequence(config.tasks.build)
  })
});
