## 参考
- [公式](https://gulpjs.com/docs/en/api/concepts)
- [Gulp4がリリースされたのでgulpfile.jsをアップデートした](https://qiita.com/hibikikudo/items/493fbfbbea183c94b38b)
- [gulp-cliはインストールすべきじゃないと、思うよ](https://qiita.com/sawa-zen/items/413bab0ec738a272c0b0)
## ポイント
- タスクが`gulp.task(タスク名,function(){})`ではなく、ただの関数になった
- `gulp.start`は削除された
- `gulp-watch`は標準となったのでインストール&requireをしない
## つまづきポイント
- gulp-cli のバージョンをあげる
- 4に限らないがwatchするsassファイルのパスとcssを書き出す場所を正しく指定する
- **タスクをタスクとして登録した場合は""で括り、関数の場合は括ってはいけない**
- gulp.seriesもgulp.parallelも引数を配列にする必要は無い。タスクの列挙でOK。
- 4の問題では無いが`gulp-plumber`はバージョンによっては、オプションで`errorHandler`を書き換えないと復帰しない
## タスクの登録・実行
### 従来通り`gulp.task()`で登録
```JS
gulp.task("styles",function(){
  return gulp
  .src(['./sass/**/*scss']) // "/**/" 下層を含む全てのディレクトリ 
  .pipe(sass({
    outputStyle: 'expanded'
  }))
  .pipe(gulp.dest('./css'));
});

// 実行
// タスクが１つ
return gulp.watch(['./**/*.scss'],gulp.task("styles"));
// タスクが複数＆直列
return gulp.watch(['./**/*.scss'],gulp.series("styles","タスク２","タスク３"...));
// タスクが複数＆並列
return gulp.watch(['./**/*.scss'],gulp.parallel("styles","タスク２","タスク３"...));

/* もしくは下記でもタスクの登録が出来る（実行方法は上記と変わらない） */
function styles(){
  return gulp
  .src(['./sass/**/*scss']) // "/**/" 下層を含む全てのディレクトリ 
  .pipe(sass({
    outputStyle: 'expanded'
  }))
  .pipe(gulp.dest('./css'));
}

gulp.task(styles);
```
### 関数としてタスクを登録
```JS
function styles (){
  return gulp
  .src(['./sass/**/*scss']) // "/**/" 下層を含む全てのディレクトリ 
  .pipe(sass({
    outputStyle: 'expanded'
  }))
  .pipe(gulp.dest('./css'));
}

// 実行
return gulp.watch(['./**/*.scss'],styles)) // タスクを""で括らない
// タスクが複数＆直列
return gulp.watch(['./**/*.scss'],gulp.series(styles,タスク２,タスク３...)); // タスクを""で括らない
// タスクが複数＆並列
return gulp.watch(['./**/*.scss'],gulp.parallel(styles,タスク２,タスク３...)); // タスクを""で括らない
```


## 実践
以下の3のコードを4に書き直す
### 3
```JS
// 3
var gulp = require('gulp'); // 本体
var sass = require('gulp-sass'); // sass
var watch = require('gulp-watch'); // watch
var notify = require('gulp-notify'); // エラー通知
var plumber = require('gulp-plumber'); // エラー後復帰
var sassLint = require('gulp-sass-lint'); // sass-lint
var postcss = require('gulp-postcss'); // postcss
var autoprefixer = require('autoprefixer'); // autoprefixer（postcss）
var mqpacker = require('css-mqpacker'); // メディアクエリ（postcss）

// 'sass'タスク
gulp.task('sass', function(){
  gulp.src(['./sass/**/*.scss']) // "/**/" 下層を含む全てのディレクトリ 
    .pipe(plumber())
    .pipe(sass({outputStyle: 'expanded'}))
    .on('error', notify.onError(function(err) {
      return err.message;
    }))
    .pipe(postcss([autoprefixer({browsers: ['> 2%']})]))
    .pipe(postcss([mqpacker()]))
    .pipe(gulp.dest('./css'))
});

// 'watch'タスク
gulp.task('watch', function(){
  // var watch = require('gulp-watch');
  watch(['./sass/**/*.scss'], function() { // "/**/" 下層を含む全てのディレクトリ 
    return gulp.start(['sass']);
  });
})


gulp.task('default',['watch']);
```
### 4
```JS
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
    .src(['./sass/**/*scss']) // "/**/" 下層を含む全てのディレクトリ 
    .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(postcss(plugin))
    .pipe(gulp.dest('./css'));
}


gulp.task('default',function(){
  // 1.'./*scss' の更新を監視
  return gulp.watch(['./sass/**/*.scss'],styles) // "/**/" 下層を含む全てのディレクトリ 
});

```