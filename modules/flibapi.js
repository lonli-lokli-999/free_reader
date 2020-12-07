const request = require('request');
const xml2js = require('xml2js');

const flibapi =
{
	_main_url: "http://flibusta.is",
	_search_url: "http://flibusta.is/opds/opensearch?",
	
	search( req, page )
	{
		let
			req_encode = encodeURIComponent( req ),
			url = `${this._search_url}searchTerm=${req_encode}&pageNumber=${page}`;

		return new Promise(  function( resolve, reject ) {
			request( url, function (error, response, body) {
				if( body )
					resolve( flibapi.bodyParce( body, resolve ) );
			});
		} );
	},

	read( id )
	{
		let
			url = `${this._main_url}/b/${id}/read`;
			
		console.log( url );

		return new Promise(  function( resolve, reject ) {
			request( url, function (error, response, body) {
				if( body )
					resolve( flibapi.bookParce( body ) );
			});
		} );
	},

	bodyParce( body, resolve )
	{
		xml2js.parseString( body, (err, result) => 
		{
			let
				books 		= result.feed.entry || [],
				total 		= result.feed['os:totalResults'][0],
				step 		= result.feed['os:itemsPerPage'][0],
				curent 		= result.feed['os:startIndex'][0],
				main_url	= flibapi._main_url;
				
			books = books.map( book => {
				let
					book_name	= book.title[0],			
					_id			= book
								.link.find( item => item['$'].rel == "alternate"  )
								["$"].href,
					cover 		= book.link
								.find( item => item['$'].type == 'image/jpeg'  ),
					author 		= book.author ? book.author[0].name[0] : '',
					link		= `${this._main_url}${_id}`;
				
				cover = cover ? `${main_url}${cover['$'].href}` : '';
				_id = _id.replace( '/b/', '' );
					
				return { book_name, _id, author, cover, link }
			} );
				
				
			resolve( { books, total, curent, step } );
		})
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
