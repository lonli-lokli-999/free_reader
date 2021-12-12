	'use strict';

//////////////////////////////////// modules import
import { header } from './modules/header.js';
import { main } from './modules/main.js';
//////////////////////////////////// modules import end

//============================================ workers
const file_processor = new Worker( 'js/workers/reader_worker.js' );
file_processor.addEventListener( 'message', ev => app.bookUpdate( ev.data ) );
//============================================ workers end

//////////////////////////////////// function
window.installDefaultSettings = () =>
{
	let
		user_settings = settingsModel.get()

	fetch( "./data/settings.json" )
		.then( res => res.json() )
		.then( res => 
			{
				res.forEach( setting => 
					{
						if( !setting.css )
						return null;

						let
							the_setting_value = user_settings[ setting.css ] ? user_settings[ setting.css ] : setting.value;

						document
							.querySelector( ':root' )
							.style
							.setProperty( setting.css, the_setting_value );
					}
				);
			} 
		);
};

window.installDefaultTheme = () =>
{
	let 
		main_css_var = document.querySelector( ':root' ).style,
		user_themes = LSModel.get( "user_themes" );

	fetch( "./data/themes.json" )
		.then( res => res.json() )
		.then( res => 
			{
				let
					all_themes = res.concat( user_themes );

				all_themes.forEach( setting => 
					{
						let
							def_theme = localStorage.def_theme_name ? all_themes.find( item => item.name == localStorage.def_theme_name ) : null,
							the_them_colors = def_theme ? def_theme.colors : null;

						if( !the_them_colors )
							localStorage.def_theme_name = all_themes[0].name,
							the_them_colors = all_themes[0].colors;

						activateTheme( the_them_colors );
					}
				);
			} 
		);
};

window.activateTheme = colors =>
{
	let main_css_var = document.querySelector( ':root' ).style;
			
	colors = colors.split( ' ' );
	
	main_css_var.setProperty( '--header-bg', colors[0] );
	main_css_var.setProperty( '--header-color', colors[1] );
	main_css_var.setProperty( '--content-bg', colors[2] );
	main_css_var.setProperty( '--content-color', colors[3] );
	main_css_var.setProperty( '--translucent-color', colors[4] + "aa" );
};

window.msg = text =>
{
	let
		b_msg = document.createElement( 'div' );

	b_msg.classList.add( 'b-msg' );
	b_msg.innerHTML = text;

	document.body.appendChild( b_msg );

	setTimeout( () => ( b_msg.remove() ), 3000 );
};

window.settingsModel =
{
	get: () => localStorage.user_settings ? JSON.parse( localStorage.user_settings ) : {},

	set( setting, value )
	{ 
		let
			settings = this.get();
		
		settings[ setting ] = value;

		localStorage.user_settings = JSON.stringify( settings );
	}
};

window.LSModel = 
{
	get( tab_name, filters )
	{
		let
			filters_keys = filters ? Object.keys( filters ) : [],
			response = localStorage[ tab_name ] ? JSON.parse( localStorage[ tab_name ] ) : [],
			result = null;
		
		result = response.filter( item => 
			{
				let
					founded = true;

				filters_keys.forEach( key => 
					{
						founded = item[ key ] == filters[ key ];
					}
				);

				return founded
			}
		);

		return result
	},

	set( tab_name, new_item, rewrite_item_id ) 
	{
		let
			tab = this.get( tab_name ),
			found_id = false;

		if( rewrite_item_id )
			found_id = tab.findIndex( item => item[ rewrite_item_id ] == new_item[ rewrite_item_id ] );

		if( !found_id )
			new_item.$id = this.generateId(),
			tab.push( new_item );

		if( found_id )
			new_item.$id = tab[ found_id ].$id,
			tab[ found_id ] = new_item;

		localStorage[ tab_name ] = JSON.stringify( tab );
	},

	del( tab_name, id )
	{
		let
			tab = 
				this.get( tab_name )
				.filter( item => item.$id != id );

		localStorage[ tab_name ] = JSON.stringify( tab );
	},

	generateId: () => new Date().getTime(),
};

window.readingStatus =
{
table: () => localStorage.books_progress ?  JSON.parse( localStorage.books_progress ) : [],

update( name, progress ) 
{
	let
		saved_book = this.table(),
		the_book_id = saved_book.findIndex( book => book.name == name );

	if( the_book_id == -1 )
		saved_book.push( { name, progress } )
	else
		saved_book[ the_book_id ].progress = progress
	;

	localStorage.books_progress = JSON.stringify( saved_book );
},

last( name )
{
	let
		saved_book = this.table(),
		the_book = saved_book.find( book => book.name == name );

	return the_book ? the_book.progress : 0;
}
}
//////////////////////////////////// function end

//////////////////////////////////// app
const app = new Vue({
	el: '.app',
	
	data: 
	{
		file: null,
		book: null,
		curent_reading_status: undefined
	},
	
	computed: 
	{
		book_open()
		{
			return this.book ? true : false
		}
	},
	
	template:
	`
		<div class="app">
			<div 
				is="app_header"
				@select="selectFile"
				@flibopen="bookUpdate"
				:curent_reading_status="curent_reading_status"
				:book_open="book_open">
			</div>
			<div 
				is="app_main" 
				:book="book"
				@changeReadingStatus="changeReadingStatus">
			</div>
		</div>
	`,
	
	components: 
	{
		'app_header': header,
		'app_main': main
	},
	
	methods: 
	{
		selectFile( file )
		{
			file_processor.postMessage( file );
		},
		
		bookUpdate( book )
		{
			book.progress = readingStatus.last( book.title );
			this.book = book;
		},

		changeReadingStatus( new_reading_status )
		{
			this.curent_reading_status = new_reading_status;

			if( this.book )
				readingStatus.update( this.book.title, new_reading_status );
		}
	}
});
//////////////////////////////////// app end

installDefaultSettings();
installDefaultTheme();




