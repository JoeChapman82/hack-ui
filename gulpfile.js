/*jshint esversion: 6 */

const gulp = require('gulp');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const runSequence = require('run-sequence');
const uglify = require('gulp-uglify');
const pump = require('pump');

console.log(__dirname + '/app/development/scss/**/*.scss');

gulp.task('sass', function(){
  return gulp.src(__dirname + '/app/development/scss/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest(__dirname + '/app/public/css'));
});

gulp.task('watch', ['sass'], function(){
  gulp.watch(__dirname + '/app/development/scss/**/*.scss', ['sass']);
  gulp.watch(__dirname + '/app/public/**/*.njk');
  gulp.watch(__dirname + '/app/development/scripts/**/*.js', ['uglyjs']);
});

gulp.task('uglyjs', function (cb) {
  pump([
    gulp.src(__dirname + '/app/development/scripts/**/*.js'),
    uglify(),
    gulp.dest(__dirname + '/app/public/scripts')
  ],
  cb
);
});

gulp.task('server', function () {
  nodemon({
    script: 'server.js',
    ext: 'js, json',
  }).on('quit', function () {
    process.exit(0);
  });
});

gulp.task('default', function (done) {
  runSequence('watch', 'sass', 'uglyjs', 'server', done);
});
