'use strict';

const gulp = require('gulp');
const less = require('gulp-less');
const jade = require('gulp-jade');
const cssmin = require('gulp-cssmin');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const connect = require('gulp-connect');


// Source folder configuration
const SRC_DIR = {};
SRC_DIR.root = './source/';
SRC_DIR.assets = SRC_DIR.root + 'assets/';
SRC_DIR.img = SRC_DIR.assets + 'images/';
SRC_DIR.less = SRC_DIR.root + 'less/';
SRC_DIR.jade = SRC_DIR.root + 'jade/';
// Source file matchers, using respective directories
const SRC_ASSETS = {
	css: SRC_DIR.assets + '**/*.css',
	img: SRC_DIR.assets + 'images/**/*',
	less: SRC_DIR.less + '*.less',
	jade: [
		SRC_DIR.jade + '*.jade',
		SRC_DIR.jade + 'en/*.jade'
	],
	jadeTemplates: SRC_DIR.jade + 'templates/*.jade'
};

// Output directories
const PUB_DIR = {};
PUB_DIR.root = './public/';
PUB_DIR.css = PUB_DIR.root + 'css/';
PUB_DIR.cssFiles = PUB_DIR.root + 'css/style.css';
PUB_DIR.fnt = PUB_DIR.root + 'fonts/';
PUB_DIR.img = PUB_DIR.root + 'images/';


// TASKS

gulp.task('watch', () => {
	gulp.watch(SRC_ASSETS.img, ['imagemin']);
	gulp.watch(SRC_ASSETS.less, ['less']);
	gulp.watch([SRC_ASSETS.jade,  SRC_ASSETS.jadeTemplates], ['jade']);
});

gulp.task('less', () =>
	gulp.src(SRC_ASSETS.less)
		.pipe(less().on('error', err => console.log(err)))
		.pipe(gulp.dest(PUB_DIR.css))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(PUB_DIR.css))
		.pipe(connect.reload())
		.pipe(connect.reload())
);

gulp.task('jade', () =>
	gulp.src(SRC_ASSETS.jade)
		.pipe(jade({
			/* pretty: true // Uncomment this to get unminified HTML */
		}))
		.pipe(gulp.dest(file => {
			var jadeIndex = file.base.lastIndexOf('jade');
			var relPath = file.base.substr(jadeIndex+5);
			return PUB_DIR.root + relPath;
		}))
		.pipe(connect.reload())
);

gulp.task('imagemin', () =>
    gulp.src(SRC_ASSETS.img)
        .pipe(imagemin())
        .pipe(gulp.dest(PUB_DIR.img))
		.pipe(connect.reload())
);

gulp.task('webserver', function() {
	connect.server({
    	root: 'public',
		livereload: true,
		port: 80,
		host: 'localhost'
	});
});

gulp.task('default', ['less', 'jade', 'imagemin']);
gulp.task('server', ['default', 'webserver', 'watch']);
