const request = require('request');

const flibapi =
{
	_main_url: "http://flibusta.is",
	_search_url: "http://flibusta.site/opds-opensearch.xml",
	
	search( req )
	{
		let
			req_encode = encodeURIComponent( req ),
			url = `http://flibusta.site/opds/opensearch?searchTerm=${req_encode}&amp;searchType=books&amp`;

		return new Promise(  function( resolve, reject ) {
			request( url, function (error, response, body) {
				if( body )
					resolve( flibapi.bodyParce( body ) );
			});
		} );
	},

	read( id )
	{
		let
			url = `${this._main_url}/b/${id}/read`;

		return new Promise(  function( resolve, reject ) {
			request( url, function (error, response, body) {
				if( body )
					resolve( flibapi.bookParce( body ) );
			});
		} );
	},

	bodyParce( body )
	{
		
		body = body.replace( /\n/g, '' );
		
		let
			result = body.match( /<entry>(.*?)<\/entry>/g );

		if( !result )
			return [];
		
			result = result.map( book_entry => {
			   let
					main_url	= flibapi._main_url,
					book_name	= book_entry.match( /<title>(.*?)<\/title>/ )[1],
					author		= book_entry.match( /<name>(.*?)<\/name>/ )[1],
					anotation	= book_entry.match( /<content.*>(.*?)<\/content>/ )[0],
					link		= book_entry.match( /<link.href="([^>]*)".rel="alternate"/ )[1],
					_id			= link.replace( 'b/', '' ),
					cover     	= 	book_entry.match( /<link.href="([^>]*)".rel="x-stanza-cover-image"/ ) ?
									book_entry.match( /<link.href="([^>]*)".rel="x-stanza-cover-image"/ )[1] :
									'';
			   return { main_url, book_name, cover, link, _id, author }
			} );

		return result
	},

	bookParce( body )
	{
		let
			start = body.search( /<h3.class=/  ),
			end = body.search( /<h3>/ ),
			book_content = body.slice( start, end );
			book_content = book_content.replace( /<p class=.*?>/g, '<p>' );
			book_content = book_content.replace( /src="/g, `src="${ flibapi._main_url }` );
			book_content = book_content.replace( /<h[0-9] class=.*?>/g, '<h2 class="title">' );
			
		return book_content;
	}
};

module.exports = flibapi;
