const gulp = require('gulp');
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');

function styles (){

  const plugin = [
    autoprefixer({browsers: ['> 2%']}),
    mqpacker()
  ];

  return gulp
    .src(['./sass/**/*scss'])
    .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(postcss(plugin))
    .pipe(gulp.dest('./example'));
}


gulp.task('default',function(){
  // 1.'./*scss' の更新を監視
  return gulp.watch(['./sass/**/*.scss'],styles)
});

