const emblem = 
{
	template: '<div class="emblem"><div class="spine"></div><div class="bookmark"></div></div>'
};

//////////////////////////////////// book_area
const book_area = {
	props: ['content'],
	
	template:
	`
	<div class="book" @scroll="updateReadingStatus" >
		<div v-html="content"></div>
		<div class="set-page-btns">
			<button class="set-page-btn" @click="pageUp"><span class="fa fa-angle-double-up"></span></button>
			<button class="set-page-btn" @click="pageDown"><span class="fa fa-angle-double-down"></span></button>
		</div>
	</div>
	`,

	methods:
	{
		updateReadingStatus()
		{
			let
				book_el = document.querySelector( '.book' ),
				book_height = book_el.scrollHeight,
                all_page = Math.floor( book_height /  book_el.clientHeight ),
                the_page = Math.ceil( book_el.scrollTop /  book_el.clientHeight );
				the_page = the_page == 0 ? 1 : the_page;
				
			let
				pages = `${the_page}/${all_page}`,
				procent = book_el.scrollTop / book_height * 100;
				
			this.$emit( 'changedReadingStatus', { procent, pages } );
		},
		
		pageUp()
		{
			let
				book_el = this.$el;	
			book_el.scrollTop -= book_el.clientHeight;
		},
		
		pageDown()
		{
			let
				book_el = this.$el;	
			book_el.scrollTop += book_el.clientHeight;
		}
	}
};
//////////////////////////////////// book_area end

//////////////////////////////////// book_area end
const tab_bar =
{
	props: ['chapters', 'cover', 'book_name'],
	
	data: function()
	{
		return {
			bookmards: null,
		}
	},
	
	mounted() {
		if( localStorage.bookmarks && this.book_name )
			this.bookmards = JSON.parse( localStorage.bookmarks ).filter( bookmark => bookmark.book_name == this.book_name );
	},
	
	methods:
	{
		tabBarToggle()
		{
			document
				.querySelector( '.tab-bar' )
				.classList.toggle( 'tab-bar--active' );
				
			document
				.querySelector( '.tab-bar__toggle-btn' )
				.classList.toggle( 'tab-bar__toggle-btn--active' );
		},
		
		viewCover()
		{
			let
				box_wiev = document.createElement('div');
				box_wiev.classList.add('img-full-screen-view');
				
				box_wiev.appendChild( document.querySelector('.js-cover').cloneNode() );
				
				box_wiev.addEventListener( 'click', function()
					{
						this.remove()
					}
				);
				
				document.body.appendChild( box_wiev );
		},
		
		bookmarksUpdate()
		{
			if( localStorage.bookmarks && this.book_name )
				this.bookmards = JSON.parse( localStorage.bookmarks ).filter( bookmark => bookmark.book_name == this.book_name );
		},
		
		showTheTab( ev )
		{
			this.$el
				.querySelector( '.tab--active' )
				.classList.remove( 'tab--active' );
				
			let
				tab_name = ev.target.id ?
					ev.target.id :
					ev.target.parentElement.id;
					
			this.$el
				.querySelector( `.${ tab_name }` )
				.classList.add( 'tab--active' );
				
			if( tab_name == 'bookmards' )
				this.bookmarksUpdate();
		},
		
		goToBookmarks( ev )
		{
			let
				bookmark_process = ev.target.getAttribute( 'data-process' ),
				book = document.querySelector( '.book' );
				
			book.scrollTop = book.scrollHeight / 100 * bookmark_process
		},
		
		deleteBookmark(ev)
		{
			let
				all_bookmarks = JSON.parse( localStorage.bookmarks ),
				the_bookmark = 
					ev.target.getAttribute( 'data-bookmarks-id' ) ?
					ev.target :
					ev.target.parentElement,
				the_bookmark_id = the_bookmark.getAttribute( 'data-bookmarks-id' );
					
			all_bookmarks = all_bookmarks.filter( bookmark => bookmark.id != the_bookmark_id );
			localStorage.bookmarks = JSON.stringify( all_bookmarks );
			
			the_bookmark.closest( '.bookmark-link' ).remove();
		}
	},
		
	template:
		`
		<div class="tab-bar-wrap">
			<button class="tab-bar__toggle-btn" @click="tabBarToggle">
				<span class="fa fa-angle-double-down toggle-btn__icon"></span>
			</button>
			<div class="tab-bar">
				<header class="tab-bar__header">
					<button class="tab-bar__header-btn options-btn" @click="tabBarToggle">
						<span class="fa fa-close"></span>
					</button>
					<button class="options-btn" @click="showTheTab" id="links">
						<span class="fa fa-list"></span>
					</button>
					<button class="options-btn" @click="showTheTab" id="bookmards">
						<span class="fa fa-bookmark"></span>
					</button>
					<button class="options-btn" @click="showTheTab" id="book_info">
						<span class="fa fa-info"></span>
					</button>
				</header>
				<div class="tab tab--active links">
					<a v-for="link in chapters" :href="link.href" class="tab-bar__btn">{{link.label}}</a>
				</div>
				<div class="tab bookmards">
					<div v-for="link in bookmards" class="bookmark-link">
						<button  :data-process="link.process" @click="goToBookmarks" class="tab-bar__btn">{{link.name}}</button>
						<button class="bookmark-del" :data-bookmarks-id="link.id" @click="deleteBookmark"><span class="fa fa-minus"></span></button>
					</div>
				</div>
				<div class="tab book_info">
					<img class="js-cover" v-if="cover" :src="cover" @click="viewCover">
					<h2 class="book-name">{{ book_name }}</h2>
				</div>
			</div>
		</div>
		`
}
//////////////////////////////////// book_area end

//////////////////////////////////// export main
export const main = 
{
	props: [ 'book' ],
	
	data: function()
	{
		return {
			chapters: null
		}
	},
	
	template: 
	`
		<main class="main-content-wrap" >
			<div class="main-content conatiner">
				<div v-if="book" is="tab_bar" :cover="book.cover" :chapters="chapters" :book_name="book.title"></div>
				<div v-if="book" is="book_area" :content="book.content" @changedReadingStatus="updateReadingStatus"></div>
				<div v-if="!book" is="emblem"></div>
			</div>
		</main>
	`,
	
	components: 
	{
		'book_area': book_area,
		'emblem': emblem,
		'tab_bar': tab_bar
	},
	
	methods: 
	{
		updateReadingStatus( status )
		{
			let
				the_book_id = this.books_progress.findIndex( book => book.name == this.book.title );
			
			if( the_book_id != -1 )
				this.books_progress[ the_book_id ].progress = status
			else
				this.books_progress.push( { name: this.book.title, progress: status } )
			;
			
			localStorage.books_progress = JSON.stringify( this.books_progress );
				
			this.$emit( 'changedReadingStatus', status );
		}
	},
	
	computed:
	{
		books_progress: function()
		{
			return localStorage.books_progress ? JSON.parse( localStorage.books_progress ) : [];
		},
		
		the_progress: function()
		{
			let
				the_book = this.books_progress.find( book => book.name == this.book.title );
				
			return 	the_book ? the_book.progress : false;
		}
	},
	
	watch:
	{
		book()
		{			
			let
				chapters	= [];
				
			setTimeout( () => {
				let
					book_el = document.querySelector( '.book' );
				
				this.$el.querySelectorAll( 'h2' )			
					.forEach( ( title, id ) => {
						title.id = `chapter_${id}`;
						chapters.push( { label: title.innerText, href: `#chapter_${id}` } );
					} );
						
					book_el.scrollTop = this.the_progress ?
						book_el.scrollHeight / 100 * this.the_progress.procent :
						0;
			}, 2000 )
		}
	}
};
//////////////////////////////////// export main end
