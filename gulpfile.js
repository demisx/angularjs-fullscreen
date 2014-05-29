var gulp = require('gulp'),
  size = require('gulp-filesize'),
  clean = require('gulp-clean'),
  coffee = require('gulp-coffee'),
  coffeelint = require('gulp-coffeelint'),
  gutil = require('gulp-util'),
  changed = require('gulp-changed'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify');

var filePath = {
  build_dir: './dist',
  lint:   { src: ['./src/*.coffee','./src/**/*.coffee'] },
  coffee: { 
            src: ['./src/*.coffee','./src/**/*.coffee'], 
            dest: './dist/**/*.js',
            dest_dir: './dist',          
          }
};


gulp.task('clean', function() {
  return gulp.src(filePath.build_dir, {read: false})
    .pipe(clean());
});

gulp.task('lint', function () {
  gulp.src(filePath.lint.src)
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
});

gulp.task('coffee', ['lint'], function() {
  gulp.src(filePath.coffee.src)
    .pipe(changed(filePath.coffee.dest_dir, { extension: '.js' }))
    .pipe(size())
    .pipe(coffee({ bare: true, sourceMap: false, sourceFiles: './app' })
      .on('error', gutil.log))
    .pipe(gulp.dest(filePath.coffee.dest_dir))
    .pipe(uglify())
    .pipe(concat('angularjs-fullscreen.min.js'))
    .pipe(gulp.dest(filePath.coffee.dest_dir))
});

gulp.task('watch-coffee', function() {
  gulp.watch(filePath.coffee.src, ['coffee']);
  gulp.watch(filePath.coffee.dest).on('change', function(file) {
    server.changed(file.path);
  });
});


gulp.task('build', ['lint', 'coffee']);
gulp.task('watch', ['watch-coffee']);
gulp.task('default', ['watch']);
