const gulp			= require('gulp');
const gulp_concat	= require('gulp-concat');
const scss 			= require('gulp-sass');
const css 			= require('gulp-cssnano');
const js 			= require('gulp-uglify-es').default;
const watch 		= require('gulp-watch');
const plumber		= require( 'gulp-plumber' );
	
const path = 
{
	dev: 
	{
		scss: './dev/scss/*.scss',
		js: './dev/js/**/*.js'
	},
	
	dest: 
	{
		css: './public/css',
		js: './public/js'
	}
};

gulp.task('run', function()
{
	scssCopile();
	jsCopile();
	
	watch( path.dev.scss, scssCopile );
	watch( path.dev.js, jsCopile );
});

function scssCopile()
{
	gulp.src( path.dev.scss )
		.pipe( plumber() )
		.pipe( scss() )
		.pipe( css() )
		.pipe( gulp.dest( path.dest.css ) );
    
	console.log( '~> css compiling done!' );
};

function jsCopile()
{
	gulp.src( path.dev.js )
		.pipe( plumber() )
		.pipe( js() )
		.pipe( gulp.dest( path.dest.js ) );
	
	console.log( '~> js compiling done!' );
};
