/* ========================================
 * BOOKMARDS END
 * ======================================== */
 
/* =====================================================
 * The model bookmards
 * |_ add 			| ( bookmard : Object ) ~> false
 * |_ remove 		| ( id ) ~> boolean
 * |_ the_file		| ( file_name ) ~> array
 * |_ get 			| ( false ) ~> array
 * ===================================================== */

const bookmards = {
	add( bookmard )
	{
		bookmard.id = new Date().getTime();

		let
		   bookmards_list = this.get();
		
		bookmards_list.push( bookmard );
		localStorage.bookmards = JSON.stringify( bookmards_list );
	},

	remove( id )
	{
	    i( 'Removing bookmards!' );
	},

	the_file( file_name )
	{
		let
			all_bookmards = this.get();

			return all_bookmards ? 
				all_bookmards.filter( bookmard => bookmard.file == the_file ) :
				[];
	},

	get()
	{
		return localStorage.bookmards ? JSON.parse( localStorage.bookmards ) : [];
	}
};
/* ========================================
 * BOOKMARDS END
 * ======================================== */

/* ========================================
 * WORKER HENDLER
 * ======================================== */
onmessage = ev => 
{
	let
		{ method, arg } = ev.data;

	postMessage( bookmards[ method ]( arg ) );
};
/* ========================================
 * WORKER HENDLER END
 * ======================================== */
