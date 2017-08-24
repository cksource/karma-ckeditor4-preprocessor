/**
 * @license Copyright (c) 2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

var meta = require( './src/meta' ),
	scripts = require( './src/scripts' );

function createCKEditor4Preprocessor() {

	return function( content, file, done ) {
		var tags = meta.parse( content ),
			scriptsHtml = scripts.generate( tags );

		console.log( scriptsHtml + meta.remove( content ) );

		done( scriptsHtml + meta.remove( content ) );
	};
}

module.exports = {
	'preprocessor:ckeditor4': [ 'factory', createCKEditor4Preprocessor ]
};
