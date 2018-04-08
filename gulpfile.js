var	gulp     = require('gulp')
  , babel    = require('gulp-babel')
  , concat   = require('gulp-concat')
  , uglify   = require('gulp-uglify')
  , plumber  = require('gulp-plumber')
  , using    = require('gulp-using')
  // Define some individual deploy params
  , src_dir       = 'src/'
  , dist_dir      = 'dist/'
  , dist_js_file  = 'jquery.JensSwipe.min.js'
  // Package options
  , using_options_processing = { prefix: 'Processing', path: 'cwd', filesize: true }
  , using_options_merging    = { prefix: 'Merging to', path: 'cwd', filesize: true }
  , using_options_cleaning   = { prefix: 'Cleaning',   path: 'cwd', filesize: true }

	/**
	 * Error handling function for plumber package
	 */
	, plumber_handle_err = function(err) {
		console.log(err);
		this.emit('end');
	};

/**
 * Deploy JS files
 */
gulp.task('deploy-js', function() {
	// First concat all js files together and compile babel
	var stream = gulp
		.src([src_dir + 'jensswipe.js'])
		.pipe(plumber({ plumber_handle_err }))
		.pipe(using(using_options_processing))
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(concat(dist_js_file));

	// After uglifying save into dest-directory
	return stream
		.pipe(using(using_options_merging))
		.pipe(gulp.dest(dist_dir))
		.pipe(uglify({preserveComments: 'license'}))
		.pipe(gulp.dest(dist_dir))
		.pipe(using(using_options_cleaning));
});

/**
 * Watcher
 */
gulp.task('watch', function() {
	gulp.watch(src_dir + '*.js', [ 'deploy-js' ]);
});
