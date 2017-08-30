/**
 * @license Copyright (c) 2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const fs = require( 'fs' );
const path = require( 'path' );
const meta = require( './src/meta' );

/**
 * Returns relative path starting from a given folder based on absolute file path:
 *
 * 		filePath: '/Workspace/CKSource/CKEditor4/ckeditor/ckeditor-dev/tests/core/ckeditor/ckeditor.js'
 * 		start: 'tests'
 * 		returns: 'tests/core/ckeditor/ckeditor.js'
 *
 * @param {String} filePath Absolute path to a file.
 * @param {String} start Start folder from which relative path should start.
 * @returns {String|null} Relative path or null.
 */
function getRelativePath( filePath, start ) {
	start = `${ path.sep }${ start }${ path.sep }`;
	if ( filePath.indexOf( start ) !== -1 ) {
		return path.join( start, filePath.split( start ).pop() ).substr( 1 );
	}
	return null;
}

/**
 * Returns test name based on the absolute test file path. By default CKEditor tests are placed in `tests` directory.
 * This directory is treated as a start of the test name:
 *
 * 		filePath: '/Workspace/CKSource/CKEditor4/ckeditor/ckeditor-dev/tests/core/ckeditor/ckeditor.js'
 * 		returns: 'tests/core/ckeditor/ckeditor'
 *
 * @param {String} filePath Absolute path to a test file.
 * @returns {String|null} Test name or null.
 */
function getTestName( filePath ) {
	const testRelativePath = getRelativePath( filePath, 'tests' );
	return testRelativePath ? testRelativePath.replace( /\.js$/, '' ) : null;
}

/**
 * Returns test file info containing absolute and relative file paths. The relative path starts from default
 * CKEditor tests folder which is `tests`.
 *
 * @param {String} filePath Absolute path to a test file.
 * @returns {Object} Object containing relative and absolute file paths.
 * @returns {String} return.path Relative path to a test file.
 * @returns {String} return.fullpath Absolute path to a test file.
 */
function getTestFileInfo( filePath ) {
	return {
		path: getRelativePath( filePath, 'tests' ),
		fullpath: filePath
	};
}

/**
 * Returns test fixture file info containing absolute and relative file paths. The relative path starts from default
 * CKEditor tests folder which is `tests`.
 *
 * @param {String} filePath Absolute path to a test file.
 * @returns {Object} Object containing relative and absolute file paths.
 * @returns {String} return.path Relative path to a fixture file.
 * @returns {String} return.fullpath Absolute path to a fixture file.
 */
function getFixtureFileInfo( filePath ) {
	const fixturePath = filePath.replace( /\.js$/, '.html' );
	if ( filePath && fs.existsSync( fixturePath ) ) {
		return {
			path: getRelativePath( fixturePath, 'tests' ),
			fullpath: filePath
		};
	}
	return null;
}

/**
 * Creates preprocessor which converts bender tags (e.g. `/* bender-tags: editor *\/`) into JavaScript object which then
 * can be accessed by running tests. It also contains test name and test and fixture file paths.
 *
 * @returns {Function} Preprocessor function.
 */
function createCKEditor4Preprocessor() {

	return ( content, file, done ) => {
		const tags = meta.parse( content ),
			htmlFixture = getFixtureFileInfo( file.path );

		tags.test = {
			name: getTestName( file.path ),
			file: getTestFileInfo( file.path )
		};

		if ( htmlFixture ) {
			tags.test.fixture = htmlFixture;
		}

		done( meta.generate( tags ) + meta.remove( content ) );
	};
}

module.exports = {
	'preprocessor:ckeditor4': [ 'factory', createCKEditor4Preprocessor ]
};
