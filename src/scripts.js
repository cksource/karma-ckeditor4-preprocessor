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

			scripts.push( '\nvar test_editor_config = ' + JSON.stringify( data.ckeditor ) + ';\n' );
		}

		return scripts.join( '' );
	}
};
