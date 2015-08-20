// Initialize Gulp plugins.
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var spritesmith = require('gulp.spritesmith');

// Assets paths.
var imagesFolder    = 'images/',
    cssFolder       = 'css/',
    scssFolder      = 'scss/',
    jsFolder        = 'js/',
    spriteFolder    = imagesFolder + 'src/sprite/',
    spriteImageName = 'sprite.png',
    spriteCssName   = '_sprite.scss';

gulp.task('browser-sync', function() {
  browserSync({
    proxy: ""
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src(imagesFolder + 'src/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(imagesFolder));
});

gulp.task('sprite', function() {
  var spriteData =
    gulp.src(spriteFolder + '*.png')
    .pipe(spritesmith({
      imgName: spriteImageName,
      cssName: spriteCssName,
      imgPath: imagesFolder + spriteImageName
    }));

  spriteData.img.pipe(gulp.dest(imagesFolder));
  spriteData.css.pipe(gulp.dest(scssFolder + 'base/'));
});

gulp.task('styles', function(){
  gulp.src([scssFolder + '**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(cssFolder))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(cssFolder))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
  return gulp.src('js/src/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('default', ['browser-sync'], function(){
  gulp.watch(scssFolder + "**/*.scss", ['styles']);
  gulp.watch("js/src/**/*.js", ['scripts']);
  gulp.watch(spriteFolder + "*.png", ['sprite']);
  gulp.watch("*.html", ['bs-reload']);
});
