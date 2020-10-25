	'use strict';

//////////////////////////////////// modules import
import { header } from './modules/header.js';
import { main } from './modules/main.js';
//////////////////////////////////// modules import end

//============================================ workers
const file_processor = new Worker( 'js/workers/reader_worker.js' );
file_processor.addEventListener( 'message', ev => app.bookUpdate( ev.data ) );
//============================================ workers end

//////////////////////////////////// app
const app = new Vue({
	el: '.app',
	
	data: 
	{
		file: null,
		book: null,
		reading_status: null
	},
	
	template:
	`
		<div class="app">
			<div is="app_header" @select="selectFile" @flibopen="bookUpdate" :reading_status="reading_status" :book_name="( book ? book.title : null )"></div>
			<div is="app_main" :book="book" @changedReadingStatus="updateReadingStatus"></div>
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
			this.book = book;
		},
		
		updateReadingStatus( status )
		{
			this.reading_status = status;
		}
	}
});
//////////////////////////////////// app end
