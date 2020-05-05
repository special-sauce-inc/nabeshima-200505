const gulp = require('gulp');
const sass = require('gulp-sass'); //Sassコンパイル
const plumber = require('gulp-plumber'); //エラー時の強制終了を防止
const notify = require('gulp-notify'); //エラー発生時にデスクトップ通知する
const sassGlob = require('gulp-sass-glob'); //@importの記述を簡潔にする
const browserSync = require('browser-sync'); //ブラウザ反映
const postcss = require('gulp-postcss'); //autoprefixerとセット
const autoprefixer = require('autoprefixer'); //ベンダープレフィックス付与
const cssdeclsort = require('css-declaration-sorter'); //css並べ替え
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
// const ejs = require("gulp-ejs");
const rename = require("gulp-rename"); //.ejsの拡張子を変更
const replace = require("gulp-replace");
const mmq = require('gulp-merge-media-queries');
const htmlbeautify = require("gulp-html-beautify");
const fs = require('fs'); //fsファイルの読み込み

// scssのコンパイル
gulp.task('sass', function () {
  return gulp
    .src([
      './src/scss/**/*.scss',
      '!./src/scss/**/--*.scss',
    ])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))//エラーチェック
    .pipe(sassGlob())//importの読み込みを簡潔にする
    .pipe(sass({
      outputStyle: 'expanded' //expanded, nested, campact, compressedから選択
    }))
    .pipe(postcss([
      cssdeclsort({ order: 'alphabetical' }), //プロパティをソートし直す(アルファベット順)
      autoprefixer({
        // ☆IEは11以上、Androidは4.4以上
        // その他は最新2バージョンで必要なベンダープレフィックスを付与する
        "overrideBrowserslist": ["last 2 versions", "ie >= 11", "Android >= 4"],
        cascade: false
      }),
    ]))
    // .pipe(mmq()) // メディアクエリまとめる
    .pipe(gulp.dest('./src/css'));//コンパイル後の出力先
});

// 保存時のリロード
gulp.task('browser-sync', function (done) {
  browserSync.init({

    //ローカル開発
    server: {
      baseDir: "./src/",
      index: "index.html"
    }
  });
  done();
});

gulp.task('bs-reload', function (done) {
  browserSync.reload();
  done();
});

// gulp.task("ejs", (done) => {
//   var json = JSON.parse(fs.readFileSync("./src/ejs/_data/meta.json", "utf-8"));
//   gulp
//     .src(["./src/ejs/**/*.ejs", "!" + "./src/ejs/**/_*.ejs"])
//     .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))//エラーチェック
//     .pipe(ejs({ json:json }, {}, { ext: '.html' }))
//     .pipe(rename({ extname: ".html" })) //拡張子をhtmlに
//     .pipe(replace(/[\s\S]*?(<!DOCTYPE)/, "$1")) // 冒頭の余白を削除
//     .pipe(gulp.dest("./src/")); //出力先
//   done();
// });

// 監視
gulp.task('watch', function (done) {
  gulp.watch('./src/scss/**/*.scss', gulp.task('sass')); //sassが更新されたらgulp sassを実行
  gulp.watch('./src/scss/**/*.scss', gulp.task('bs-reload')); //sassが更新されたらbs-reloadを実行
  gulp.watch('./src/js/*.js', gulp.task('bs-reload')); //jsが更新されたらbs-relaodを実行
  // gulp.watch('./src/ejs/**/*.ejs', gulp.task('ejs')); //ejsが更新されたらgulp-ejsを実行
  // gulp.watch('./src/ejs/**/*.ejs', gulp.task('bs-reload')); //ejsが更新されたらbs-reloadを実行
});

// default
gulp.task('default', gulp.series(gulp.parallel('browser-sync', 'watch')));

//圧縮率の定義
var imageminOption = [
  pngquant({ quality: [0.7,  0.85], }),
  mozjpeg({ quality: 85 }),
  imagemin.gifsicle({
    interlaced: false,
    optimizationLevel: 1,
    colors: 256
  }),
  imagemin.mozjpeg(),
  imagemin.optipng(),
  imagemin.svgo()
];
// 画像の圧縮
// $ gulp imageminで./src/img/base/フォルダ内の画像を圧縮し./src/img/フォルダへ
// .gifが入っているとエラーが出る
gulp.task('imagemin', function () {
  return gulp
    .src([
      './src/img/base/**/*.{png,jpg,gif,svg}',
      '!src/img/_**/*',
      '!src/img/**/_*'
    ])
    .pipe(imagemin(imageminOption))
    .pipe(gulp.dest('./src/img/'));
});

gulp.task('htmlbeautify', function () {
  var options = {
    indent_size: 2
  };
  return gulp
    .src('./src/**/*.html')
    .pipe(plumber())
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest('./src/'))
});
