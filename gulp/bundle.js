'use strict';

var browserify = require( 'browserify' );
var gulp = require( 'gulp' );
var path = require( 'path' );
var source = require( 'vinyl-source-stream' );
var buffer = require( 'vinyl-buffer' );
var uglify = require( 'gulp-uglify' );
var size = require( 'gulp-size' );
var sourcemaps = require( 'gulp-sourcemaps' );

module.exports = function( options ) {
    var outputDir = path.dirname( options.output );
    var baseName = path.basename( options.output, path.extname( options.output ) );
    
    var bundleOptions = {
        debug: options.debug
    };
    
    if ( typeof( options.require ) !== 'undefined' ) {
        bundleOptions.require = options.require;
    }
    
    var bundler = browserify( bundleOptions );
    
    if ( options.expose ) {
        bundler = bundler.require( options.file, { expose: options.name || path.basename( options.file, path.extname( options.file ) ) } );
    }
    else {
        bundler = bundler.add( options.file );
    }

    // write unminified bundle
    bundler.bundle()
        .pipe( source( baseName + '.js' ) )
        .pipe( buffer() )
        .pipe( size( { showFiles: true } ) )
        .pipe( gulp.dest( outputDir ) );
    
    
    // if minify is set, write a minified version, potentially with sourcemaps
    if ( options.minify ) {
        var minifiedBundler = browserify( bundleOptions );
        
        if ( options.expose ) {
            var name = options.name || path.basename( options.file, path.extname( options.file ) );            
            minifiedBundler = minifiedBundler.require( options.file, { expose: name } );
        }
        else {
            minifiedBundler = minifiedBundler.add( options.file );
        }

        var minifiedBundle = minifiedBundler.bundle()
            .pipe( source( baseName + '.min.js' ) )
            .pipe( buffer() );
        
        if ( options.sourceMaps ) {
            minifiedBundle = minifiedBundle.pipe( sourcemaps.init( {
                loadMaps: true
            } ) );
        }

        minifiedBundle = minifiedBundle.pipe( uglify() );

        if ( options.sourceMaps ) {
            minifiedBundle = minifiedBundle.pipe( sourcemaps.write( '.' + path.sep ) );
        }
        
        minifiedBundle
            .pipe( size( { showFiles: true } ) )
            .pipe( gulp.dest( outputDir ) );
    }
};