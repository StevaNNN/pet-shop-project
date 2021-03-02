// Load Gulp...of course
const { src, dest, task, watch, series, parallel } = require('gulp');

// CSS related plugins
const sass         = require( 'gulp-sass' );
const autoprefixer = require( 'gulp-autoprefixer' );

// JS related plugins
const uglify       = require( 'gulp-uglify' );
const babelify     = require( 'babelify' );
const browserify   = require( 'browserify' );
const source       = require( 'vinyl-source-stream' );
const buffer       = require( 'vinyl-buffer' );
const stripDebug   = require( 'gulp-strip-debug' );

// Utility plugins
const rename       = require( 'gulp-rename' );
const sourcemaps   = require( 'gulp-sourcemaps' );
const notify       = require( 'gulp-notify' );
const plumber      = require( 'gulp-plumber' );
const options      = require( 'gulp-options' );
const gulpif       = require( 'gulp-if' );

// Browers related plugins
const browserSync  = require( 'browser-sync' ).create();

// Project related variables
const styleSRC     = './src/scss/style.scss';
const styleURL     = './dist/css/';
const mapURL       = './';

const jsSRC        = './src/js/';
const jsFront      = 'main.js';
const jsFiles      = [ jsFront ];
const jsURL        = './dist/js/';

const imgSRC       = './src/images/**/*';
const imgURL       = './dist/images/';

const fontsSRC     = './src/fonts/**/*';
const fontsURL     = './dist/fonts/';

const htmlSRC     = './src/**/*.html';
const htmlURL     = './dist/';

const jsonSRC     = './src/**/*.json';
const jsonURL     = './dist/';

const styleWatch   = './src/scss/**/*.scss';
const jsWatch      = './src/js/**/*.js';
const imgWatch     = './src/images/**/*.*';
const jsonWatch    = './src/**/*.json';
const fontsWatch   = './src/fonts/**/*.*';
const htmlWatch    = './src/**/*.html';

// Tasks
function browser_sync() {
	browserSync.init({
		server: {
			baseDir: './dist/'
		}
	});
}

function reload(done) {
	browserSync.reload();
	done();
}

function css(done) {
	src( [ styleSRC ] )
		.pipe( sourcemaps.init() )
		.pipe( sass({
			errLogToConsole: true,
			outputStyle: 'compressed'
		}) )
		.on( 'error', console.error.bind( console ) )
		.pipe( autoprefixer() )
		.pipe( rename( { suffix: '.min' } ) )
		.pipe( sourcemaps.write( mapURL ) )
		.pipe( dest( styleURL ) )
		.pipe( browserSync.stream() );
	done();
}

function js(done) {
	jsFiles.map( function( entry ) {
		return browserify({
			entries: [jsSRC + entry]
		})
		.transform( babelify, { presets: [ '@babel/preset-env' ] } )
		.bundle()
		.pipe( source( entry ) )
		.pipe( rename( {
			extname: '.min.js'
        } ) )
		.pipe( buffer() )
		.pipe( gulpif( options.has( 'production' ), stripDebug() ) )
		.pipe( sourcemaps.init({ loadMaps: true }) )
		.pipe( uglify() )
		.pipe( sourcemaps.write( '.' ) )
		.pipe( dest( jsURL ) )
		.pipe( browserSync.stream() );
	});
	done();
}

function triggerPlumber( src_file, dest_file ) {
	return src( src_file )
		.pipe( plumber() )
		.pipe( dest( dest_file ) );
}

function images() {
	return triggerPlumber( imgSRC, imgURL );
}

function fonts() {
	return triggerPlumber( fontsSRC, fontsURL );
}

function html() {
	return triggerPlumber( htmlSRC, htmlURL );
}

function json() {
	return triggerPlumber( jsonSRC, jsonURL );
}

function watch_files() {
	watch(styleWatch, series(css, reload));
	watch(jsWatch, series(js, reload));
	watch(imgWatch, series(images, reload));
	watch(fontsWatch, series(fonts, reload));
	watch(jsonWatch, series(json, reload));
	watch(htmlWatch, series(html, reload));
	src(jsURL + 'main.min.js');
}

task("css", css);
task("js", js);
task("images", images);
task("fonts", fonts);
task("json", json);
task("html", html);
task("default", parallel(css, js, images, fonts, html, json));
task("watch", parallel(browser_sync, watch_files));