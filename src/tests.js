/**
 * @license Copyright (c) 2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );

module.exports = {

	/**
	 * Checks if the given file path points to regular test file. A regular test file is a file
	 * which does not reside in directory starting with '_' (such directories are for special purposes only).
	 *
	 * @param {String} filePath Relative file path starting from main tests directory.
	 * @returns {Boolean} Whether file path point to regular test file.
	 */
	isTestFile( filePath ) {
		const skippedDirs = filePath.split( path.sep ).find( ( dir ) => {
			return dir.charAt( 0 ) === '_';
		} );

		return !skippedDirs;
	},

	/**
	 * Wraps test contents into additional object inside bender.testSuite function call:
	 *
	 * 		bender.testSuite( {
	 * 			tags: testTags,
	 * 			tests: function() {
	 * 				original test contents
	 * 			}
	 * 		} );
	 *
	 * @param {String} content Test file contents.
	 * @param {Object} tags Test tags.
	 * @returns {String} Test file contents wrap into additional object inside bender.testSuite call.
	 */
	wrap( content, tags ) {
		const tests = `function() { ${ content } }`;
		return `\nbender.testSuite( {\n\ttags: ${ JSON.stringify( tags || {} ) },\n\ttests: ${ tests } } );\n`;
	}
};
