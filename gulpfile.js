const gulp = require('gulp');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const post = require('gulp-post');


gulp.task('concat', function () {
  return gulp.src(['app/header.html', 'app/content.html', 'app/footer.html'])
    .pipe(concat('index.html'))
    .pipe(gulp.dest('./tmp/'));
});

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: "./tmp"
    },
    port: 6969 //lol
  });
});

gulp.task('default', ['serve'], function () {
  gulp.watch('./app/*', ['concat']);
  gulp.watch('tmp/*').on('change', reload);
});

gulp.task('htmlMin', function () {
  return gulp.src('tmp/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist/html'));
});

gulp.task('imgMin', () =>
  gulp.src('app/images/*')
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true,
        colors: 48,
        optimizationLevel: 3
      })
    ]))
    .pipe(gulp.dest('dist/images'))
);

gulp.task('build', ['imgMin', 'htmlMin']);

gulp.task("testing", function () {
  var options = {
    callback: function (err, data) {
      if (err) {
        console.error(err);
      } else {
        console.log(data);
      }
    }
  };
  gulp.src("dist/images/*")
    .pipe(post("https://api.imgur.com/3/image", options))
    .pipe(gulp.dest("dist"));
})