var	gulp    = require('gulp')
  , babel   = require('gulp-babel')
  , uglify  = require('gulp-uglify')
  , plumber = require('gulp-plumber')
  , rename  = require('gulp-rename')
  , using   = require('gulp-using')
  // Define some individual deploy params
  , src_dir  = 'src/'
  , dist_dir = 'dist/'
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
		.src([src_dir + '*.js'])
		.pipe(plumber({ plumber_handle_err }))
		.pipe(using(using_options_processing))
		.pipe(babel({ presets: ['es2015'] }));

	// After uglifying save into dest-directory
	return stream
		.pipe(uglify({preserveComments: 'license'}))
		.pipe(rename({
			prefix: 'jquery.',
			suffix: '.min'
		}))
		.pipe(gulp.dest(dist_dir))
		.pipe(using(using_options_cleaning));
});

/**
 * Watcher
 */
gulp.task('watch', function() {
	gulp.watch(src_dir + '*.js', [ 'deploy-js' ]);
});
