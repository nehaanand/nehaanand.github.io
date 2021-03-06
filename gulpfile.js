var gulp        = require('gulp'),
    clean       = require('gulp-clean'),
    stylus      = require('gulp-stylus'),
    browserSync = require('browser-sync'),
    cp          = require('child_process');

// Watch for file changes
gulp.task('watch', function() {
  gulp.watch(["!./_site/**/*.*", "styl/*.styl"], ['stylus']);
  gulp.watch(["!./_site/**/*.*", "./**/*.*", "!./styl/*.styl"], ['rebuild']);
});

// Clean built files in '_site' directory
gulp.task('clean', function() {
  return gulp.src(['_site/'], {read: false})
    .pipe(clean());
});

// Build Jekyll
gulp.task('build', function (done) {
    browserSync.notify('Building Jekyll');
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

// Rebuild Jekyll and reload
gulp.task('rebuild', ['build'], function () {
    browserSync.reload();
});

// Compile Stylus to CSS
gulp.task('stylus', function() {
  gulp.src('styl/*.styl')
      .pipe(stylus())
      .pipe(gulp.dest('css/'))
      // Copy updated CSS into built _site directory to save rebuilding
      .pipe(gulp.dest('_site/css/'))
      // Reload browser
      .pipe(browserSync.reload({stream: true}));
});

// Serve website
gulp.task('serve', ['build'], function () {
    browserSync.init({server: {baseDir: '_site/'}});
});

// Default task to serve the website and update automatically
gulp.task('default', ['clean'], function() {
  gulp.start('stylus', 'serve', 'watch');
});
