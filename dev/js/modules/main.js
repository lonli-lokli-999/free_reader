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
				procent = book_el.scrollTop / book_height * 100;
				
			this.$emit( "changeReadingStatus", procent );
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

//////////////////////////////////// tab bar
const tab_bar =
{
	props: ['chapters', 'cover', 'book_name', 'author', 'seria_name'],
	
	data: function()
	{
		return {
			bookmards: null,
		}
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
			this.bookmards = LSModel.get( 'bookmark', { book: this.book_name } );
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
				bookmark_progress = ev.target.getAttribute( 'data-progress' ),
				book = document.querySelector( '.book' );
				
			book.scrollTop = book.scrollHeight / 100 * bookmark_progress
		},
		
		deleteBookmark(ev)
		{
			let
				the_bookmark = 
					ev.target.getAttribute( 'data-bookmarks-id' ) ?
					ev.target :
					ev.target.parentElement,
				the_bookmark_id = the_bookmark.getAttribute( 'data-bookmarks-id' );
					
			LSModel.del( 'bookmark', the_bookmark_id );			
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
				<div class="tab tab--active links">
					<a v-for="link in chapters" :href="link.href" class="tab-bar__chapter">{{link.label}}</a>
				</div>
				<div class="tab bookmards">
					<div v-for="link in bookmards" class="bookmark-link">
						<button  :data-progress="link.progress" @click="goToBookmarks" class="tab-bar__chapter">{{link.name}}</button>
						<button class="bookmark-del" :data-bookmarks-id="link.$id" @click="deleteBookmark"><span class="fa fa-minus"></span></button>
					</div>
				</div>
				<div class="tab book_info">
					<img class="js-cover" v-if="cover" :src="cover" @click="viewCover">
					<h2 class="book-name">{{ book_name }}</h2>
					<p v-if="author">Автор: {{ author }}</p>
					<p v-if="seria_name">Серия: {{ seria_name }}</p>
				</div>
				<footer class="tab-bar__footer">
					<button class="tab-toggle-btn" @click="showTheTab" id="links">
						<span class="fa fa-list"></span>
					</button>
					<button class="tab-toggle-btn" @click="showTheTab" id="bookmards">
						<span class="fa fa-bookmark"></span>
					</button>
					<button class="tab-toggle-btn" @click="showTheTab" id="book_info">
						<span class="fa fa-info"></span>
					</button>
				</footer>
			</div>
		</div>
		`
}
//////////////////////////////////// tab bar

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
				<div 
					v-if="book"
					is="tab_bar"
					:cover="book.cover"
					:chapters="chapters"
					:book_name="book.title"
					:author="book.author"
					:seria_name="book.seria_name"></div>
				<div 
					v-if="book" 
					is="book_area" 
					:content="book.content"
					@changeReadingStatus="updateReadingStatus"></div>
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
		updateReadingStatus( new_readineg_status )
		{
			this.$emit( "changeReadingStatus", new_readineg_status );
		}
	},
	
	watch:
	{
		book()
		{	
			console.log( this.book );	
			let
				chapters	= [];
				
			setTimeout( () => {
				let
					book_el = document.querySelector( '.book' );

				book_el.scrollTop = this.book.progress != 0 ?
					book_el.scrollHeight / 100 * this.book.progress : 0;
	
				this.$el.querySelectorAll( 'h2' )			
					.forEach( ( title, id ) => {
						title.id = `chapter_${id}`;
						chapters.push( { label: title.innerText, href: `#chapter_${id}` } );
					} );

				this.chapters = chapters;
			}, 2000 )
		}
	}
};
//////////////////////////////////// export main end

