var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var concat      = require('gulp-concat-util');
var rename      = require('gulp-rename');
var uncss       = require('gulp-uncss');
var cleanCSS    = require('gulp-clean-css');
var uglify      = require('gulp-uglify');
var gutil       = require('gulp-util');


var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
  browserSync({
      server: {
          baseDir: '_site'
      }
  });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('_scss/main.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css'));
});

gulp.task('uncss', function() {
  return gulp.src('css/main.css')
    .pipe(gulp.dest('_site/css'))
    .pipe(cleanCSS())
    .pipe(uncss({
      html: ['*.html', '_includes/*.html','_layouts/*.html'],
      ignore: [/\.active/, /\.nav-link.active/, /\.nav-link/, /\.tab-active/]
    }))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('css'));
});

gulp.task('critical', function() {
  return gulp.src('css/main.css')
    // wrap with style tags
    .pipe(concat.header('<style>'))
    .pipe(concat.footer('</style>'))
    // convert it to an include file
    .pipe(rename({
        basename: 'criticalCSS',
        extname: '.html'
      }))
    // insert file in the includes folder
    .pipe(gulp.dest('_includes/'));
});

//Concantenate and minify JS files
var jsFiles = 'js/*.js',
    jsDest = 'js/dist';

gulp.task('js', function() {
return gulp.src(jsFiles)
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(jsDest))
    .pipe(rename('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsDest));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('_scss/*.scss', ['sass']);
    gulp.watch(['*.html', '_includes/*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
    gulp.watch('js/*.js', ['scripts']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch', 'uncss']);
