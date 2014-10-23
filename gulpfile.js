'use strict';

var gulp = require( 'gulp' );

var bundle = require( './gulp/bundle' );

gulp.task( 'bundle', function() {
    var packageInfo = require( './package.json' );
    bundle( {
        file: packageInfo.main,
        name: packageInfo.name,
        output: './build/' + packageInfo.name + '-' + packageInfo.version + '.js',
        sourceMaps: true,
        minify: true,
        debug: true,
        expose: true
    } );
} );

gulp.task( 'default', [ 'bundle' ] );