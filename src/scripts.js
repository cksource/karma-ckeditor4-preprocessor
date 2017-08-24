/**
 * @license Copyright (c) 2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {

	generate: function( data ) {
		var scripts = [];

		if ( data.ckeditor && (
				data.ckeditor.plugins || data.ckeditor[ 'remove-plugins' ] ||
				( data.ckeditor.remove && data.ckeditor.remove.plugins ) || data.ckeditor.adapters
			) ) {

			scripts.push(
				'\n(function (bender) {\n',
				'bender.configureEditor(',
				JSON.stringify( data.ckeditor ),
				');\n',
				'})(bender);\n'
			);
		}

		return scripts.join( '' );
	}
};
