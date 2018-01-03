/**
 * @license Copyright (c) 2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const metaPattern = /(?:\/\*\s*|\@)(bender-(\w+(?:\-\w+)*)\:([^\*\n$]+))/gi;
const globalPattern = /\/\*\s*global\s*([^*\/]*)\*\//gi;

module.exports = {

	/**
	 * Parses bender tags and 'global' tag from a given content. The `data` containing following content:
	 *
	 * 		/* bender-tags: editor *\/
	 * 		/* bender-ckeditor-plugins: wysiwygarea *\/
	 * 		/* global assertPasteEvent, simulatePasteCommand *\/
	 * 		bender.test( { ... } );
	 *
	 * 	will result in `parse` function returning:
	 *
	 * 		{
	 * 			tags: 'editor',
	 * 			ckeditor: {
	 * 				plugins: 'wysiwygarea'
	 * 			},
	 * 			_global: [ 'assertPasteEvent', 'simulatePasteCommand' ]
	 * 		}
	 *
	 * @param {String} data Test file contents as single string.
	 * @returns {Object} Object containing parsed tags.
	 */
	parse( data ) {
		const result = {};
		let directive,
			current,
			parent,
			value,
			match;

		// Process all matching directives (bender-<namepath>: <value>).
		while ( ( match = metaPattern.exec( data ) ) ) {
			directive = match[ 2 ].split( '-' );
			value = match[ 3 ].trim();

			parent = result;

			// Process a directive's name path.
			while ( ( current = directive.shift() ) && directive.length ) {
				if ( !parent[ current ] ) {
					parent[ current ] = {};
				}

				parent = parent[ current ];
			}

			// If there was a previous value, add the new one after a coma.
			parent[ current ] = parent[ current ] ? `${ parent[ current ] }, ${ value }` : value;
		}

		// Parse 'global' tag.
		const globalMatch = globalPattern.exec( data );
		if ( globalMatch && globalMatch[ 1 ] ) {
			result._global = globalMatch[ 1 ].split( ',' ).map( ( item ) => {
				return item.trim();
			} );
		}

		return result;
	},

	/**
	 * Removes bender tags and 'global' tag from data.
	 *
	 * @param {String} data Test file contents as single string.
	 * @returns {String} Test file contents without bender tags.
	 */
	remove( data ) {
		let match,
			newData = data;

		// Remove bender tags.
		while ( ( match = metaPattern.exec( data ) ) ) {
			newData = newData.replace( new RegExp( `/\\*\\s*${ match[ 1 ] }\\s*\\*/\\r?\\n|\\r` ), '' );
		}

		// Remove 'global' tag.
		newData = newData.replace( globalPattern, '' );

		return newData;
	}
};
