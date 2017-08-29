/**
 * @license Copyright (c) 2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

var fs = require( 'fs' ),
	path = require( 'path' ),
	meta = require( './src/meta' );

function createCKEditor4Preprocessor() {

	return function( content, file, done ) {
		var tags = meta.parse( content ),
			htmlFixture = getHtmlFixture( file.path );

		tags.test = {
			name: getTestName( file.path ),
			file: file.path
		};

		if ( htmlFixture ) {
			tags.test.fixture = htmlFixture;
		}

		done( meta.generate( tags ) + meta.remove( content ) );
	};
}

function getHtmlFixture( filePath ) {
	var fixturePath = filePath.replace( /\.js$/, '.html' );
	if ( filePath && fs.existsSync( fixturePath ) ) {
		return fixturePath;
	}
	return null;
}

function getTestName( filePath ) {
	var testsDir = path.sep + 'tests' + path.sep;
	if ( filePath.indexOf( testsDir ) !== -1 ) {
		return path.join( testsDir, filePath.split( testsDir ).pop() );
	}
	return null;
}

module.exports = {
	'preprocessor:ckeditor4': [ 'factory', createCKEditor4Preprocessor ]
};
