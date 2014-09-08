var gulp = require('gulp');
var traceur = require('gulp-traceur');
var sourcemaps = require('gulp-sourcemaps');
var header = require('gulp-header');
var removeLines = require('gulp-remove-lines');
var browserify = require('browserify');
var map = require('vinyl-map');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var rename = require("gulp-rename");
var exorcist   = require('exorcist');
var path = require('path');

var traceurRuntime = traceur.RUNTIME_PATH.replace(/.*node_modules[\\\/]/, '').replace(/\\/g, '/')

var removeUseStrict = removeLines({'filters': [
  /^\s*(['"])use strict(\1)\s*;\s*$/
  ]});

gulp.task('traceurize', function () {
  return gulp.src('src/es6/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(traceur({
    sourceMaps: true,
  }))
  .pipe(removeUseStrict)
  .pipe(header('"use strict";\nrequire(\'' + traceurRuntime +'\');\n'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('src/es5'))
  ;
});

gulp.task('browserify', ['traceurize'], function() {
  var browserifyMapped = map(function(code, filename) {

    var relative = path.relative(__dirname, filename);
    var relativeSource = './' + relative;
    var relativeDest = './' + relative.replace(/src[\\\/]es5[\\\/]/, '');

    code = code.toString();

    var b = browserify({ debug: true });
    b.add(relativeSource);
    return b.bundle()
    .pipe(source(relativeDest))
    .pipe(buffer())
    .pipe(rename(function (path) {
       path.basename += ".orig";
     }))
    .pipe(gulp.dest('./src/es5browser'))
    ;

  });

  return gulp.src(['./src/es5/**/*.js'])
  .pipe(browserifyMapped)
  ;
});


gulp.task('default', ['traceurize', 'browserify']);

gulp.task('watch', function() {
	return gulp.watch('src/es6/**/*.js', ['traceurize', 'browserify']);
});