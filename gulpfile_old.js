'use strict'
var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var sassLint = require('gulp-sass-lint');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function(){
  gulp.src(['./*.scss'])
    .pipe(plumber())
    .pipe(sass({outputStyle: 'expanded'}))
    .on('error', notify.onError(function(err) {
      return err.message;
    }))
    .pipe(postcss([autoprefixer({browsers: ['> 2%']})]))
    .pipe(postcss([mqpacker()]))
    .pipe(gulp.dest('./'))
});

gulp.task('watch', function(){
  watch(['./*.scss'], function() {
    return gulp.start(['sass']);
  });
})


gulp.task('default',['watch']);