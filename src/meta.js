/**
 * @license Copyright (c) 2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

var metaPattern = /(?:\/\*\s*|\@)(bender-(\w+(?:\-\w+)*)\:([^\*\n$]+))/gi;

module.exports = {
	parse: function( data ) {
		var result = {},
			directive,
			current,
			parent,
			value,
			match;

		// process all matching directives (bender-<namepath>: <value>)
		while ( ( match = metaPattern.exec( data ) ) ) {
			directive = match[ 2 ].split( '-' );
			value = match[ 3 ].trim();

			parent = result;

			// process a directive's name path
			while ( ( current = directive.shift() ) && directive.length ) {
				if ( !parent[ current ] ) {
					parent[ current ] = {};
				}

				parent = parent[ current ];
			}

			// if there was a previous value, add the new one after a coma
			parent[ current ] = parent[ current ] ? parent[ current ] + ', ' + value : value;
		}

		return result;
	},

	remove: function( data ) {
		var match,
			newData = data;

		while ( ( match = metaPattern.exec( data ) ) ) {
			newData = newData.replace( new RegExp( '/\\*\\s*' + match[ 1 ] + '\\s*\\*/\\r?\\n|\\r' ), '' );
		}

		return newData;
	}
};
