/*
 * function
 *******************************************/
const apletListGenerate = aplets =>
{
	let aplet_list = [];

	aplets
		.split( '; ' )
		.forEach( item => {
			let	
				aplet = item.split( ', ' ),
				name = aplet[0],
				ico = aplet[1];

			aplet_list.push( { name, ico } )
		} );

	return aplet_list
};

/*
 * intermediate modules
 *******************************************/
const header_btn = 
{
	props: ['ico', 'clb'],

	template: 
	`
		<button
		@click="( clb ? clb() : toggleApletWindow() )"
		class="options-btn"><span :class="ico"></span></button>
	`,

	methods: 
	{
		toggleApletWindow()
		{
			this.$el
				.parentElement
				.querySelector( '.window' )
				.classList.toggle( 'window--active' );
		}	
	}
};

const header_inp = 
{
	data: function()
	{
		return { inp_value: null }
	},

	props: [ 'placeholder', 'clb' ],

	template: 
	`
		<input 
			class="header__inp"
			:placeholder="placeholder" @change="writed" v-model="inp_value">
	`,

	methods: 
	{
		writed()
		{
			this.clb( this.inp_value );
			this.inp_value = "";
			this.$el.classList.remove( 'header__inp--active' );
		}
	} 
};

const color_input = 
{
	data: function()
	{
		return { curent: "#ffffff" }
	},
	props: [ 'name', 'clb' ],

	template:
	`
	<div class="window__inp-el--wrap">
		<h2 class="window__label">{{ name }}</h2>
		<div class="box-color-inp">
			<input type="color" v-model="curent" @change="setProperty">
			<input class="window__inp-el" v-model="curent">
		</div>
	</div>
	`,

	methods: 
	{
		setProperty()
		{
			this.clb( this.name, this.curent )
		}
	}
}

const pugination = 
{
	props:
	{
		curent: 
		{
			default: 0
		},
		
		total:
		{
			default: 0
		},
		
		step: 
		{
			default: 0
		},
		
		clb: 
		{
			default: false
		}
	},
	
	computed:
	{
		pages()
		{
			return Math.ceil( this.total / this.step );
		},
		
		page_list()
		{
			let
				start 	= this.curent - 2,
				end 	= this.curent + 2,
				pages	= [];
				
				start 	= start < 0 ? 0 : start;
				end 	= end > this.pages - 1 ? this.pages - 1 : end;
				
			for( let i = start; i <= end; i++ )
				{ pages.push( i ) };
				
			return pages;
		}
	},
	
	methods: 
	{
		nextPage()
		{
			this.clb( this.curent + 1 );
		},
		
		prevPage()
		{
			this.clb( this.curent - 1 );
		},
		
		changePage( id )
		{
			this.clb( id )
		}
	},
	
	template: 
	`
		<div v-if="total > 0 && this.clb" class="pugination">
			<button class="pugination__btn"
				v-if="curent > 0"
				@click="prevPage"
			>Назад</button>
			<div>
				<button class="pugination__btn"
					:class="{active: page_index == curent}"
					v-for="page_index in page_list"
					@click="changePage( page_index )"
				>
				{{ page_index + 1 }}
				</button>
			</div>
			<button class="pugination__btn"
				v-if="( curent + 1 ) < pages"
				@click="nextPage"
			>Вперед</button>
		</div>
	`
};
/*
 * win contents module
 *******************************************/
const registration_win = 
{
	data: function()
	{
		return { auth: null }
	},
	
	template:
	`
	<div>
		<h2 class="window__label">Выберите цветовую схему</h2>
		<p>Приложение подддеривает синхронизацию через Google аккаунт. Будут синхронизированны сохраненыые книги и прогрес чтения каждой из них.</p>
		<button 
			@click="login"
			class="window__btn"><span class="fa fa-google"></span> {{ auth == null ? 'Вход' : 'Выход' }}</button>
	</div>
	`,
	
	methods: 
	{
		login()
		{
			let config =
			{
			   'client_id': '473312658959-2mc4qqk7gr7i8eukmpmjere4s5cav161.apps.googleusercontent.com',
			   'scope': 'https://www.googleapis.com/auth/drive.file'
			};
			 
			gapi.auth.authorize(config, function() {
				console.log(gapi.auth);
			});
		}
	}
};

const win_content_info = 
{
	template:
	`
		<div>
			<h1>Free reader. V 4.0.1</h1>
			<p>© MIT, 2021.</p>
			<p><a href="https://github.com/lonli-lokli-999/free_reader">Github</a></p>
			<p><a href="https://money.yandex.ru/to/410017268643291">Поддержать разработку</a></p>
		</div>
	`
};

const color_scheme = 
{
	data: function()
	{
		return { themes: null, curent_theme: null }
	},

	template: 
	`
		<div>
			<h2 class="window__label">Выберите цветовую схему</h2>
			<div v-for="( theme, id ) in themes"
				class="theme-item">
				<span class="theme-item__title">{{theme.name}}</span>

				<button
					v-if="theme.$id"
					@click="deleteTheme( theme )" 
					class="window__btn" >
					Удалить
				</button>

				<button 
					@click="setTheme( theme )"
					:class="( curent_theme == theme.name ? 'window__btn--active' : '' )" 
					class="window__btn">
					Активировать
				</button>
			</div>
		</div>
	`,

	methods:
	{
		setTheme( theme )
		{
			this.curent_theme = localStorage.def_theme_name = theme.name;
			activateTheme( theme.colors );	
		},

		deleteTheme( theme )
		{
			LSModel.del( 'user_themes', theme.$id );
			this.themes = this.themes.filter( item => item.$id != theme.$id );
			msg( `Тема: '${ theme.name }', удалена.` )
		}
	},

	created: function()
	{
		fetch( './data/themes.json' )
			.then( res => res.json() )
			.then( res => {
				this.themes = res.concat( LSModel.get( "user_themes" ) );
			} );
	}
};

const new_scheme = 
{
	data: function()
	{
		return { 
			translucent_color: '#ffffff',
			header_bg: '#ffffff',
			header_color: '#ffffff',
			content_bg: '#ffffff',
			content_color: '#ffffff',
			theme_name: null }
	},

	template: 
	`
		<div>
			<span class="window__label">Создать цветовую схему</span>
			
			<input class="window__inp-el" v-model="theme_name" placeholder="Введите имя темы">
			
			<div class="window__color-writer">
				<color_input :name="'translucent_color'" :clb="setColor"></color_input>
				<color_input :name="'header_bg'" :clb="setColor"></color_input>	
				<color_input :name="'header_color'" :clb="setColor"></color_input>	
				<color_input :name="'content_bg'" :clb="setColor"></color_input>	
				<color_input :name="'content_color'" :clb="setColor"></color_input>	
			</div>
			
			<button class="window__btn" @click="add">Добавить</button>
			<button class="window__btn" @click="preview">Предпросмотр</button>
		</div>
	`,

	methods: 
	{
		setColor( name, value )
		{
			this[ name ] = value;
		},

		add()
		{
			if( this.theme_name == '' )
				return false;

			LSModel.set(
				"user_themes" ,
				{
					name: this.theme_name,
					colors: `${ this.header_bg } ${ this.header_color } ${ this.content_bg } ${ this.content_color } ${ this.translucent_color }`,
				 	user: true
				}
			);

			msg( `Тема: '${ this.theme_name }', сохранена.` );
			this.theme_name = '';
		},

		preview()
		{
			activateTheme( `${ this.header_bg } ${ this.header_color } ${ this.content_bg } ${ this.content_color } ${ this.translucent_color }` );
		}
	},

	components: 
	{
		color_input
	}
};

const win_content_settings =
{
	data: function()
	{
		return { settings: null }
	},

	template:
	`
	<div>
		<div
			v-for="( sett, id ) in settings" 
			class="inp-settings-box">
			<span class="window__label" >{{ sett.title }} </span>
			<div class="window__inp-el-wrap">
				<input
				@change="setProperty" 
				:data="sett.css"
				:placeholder="sett.title"
				:value="sett.value"
				class="window__inp-el">
				<button 
				v-if="sett.options"
				@click="toggleOptions"
				class="options-list__toggle">
				<span class="fa fa-angle-double-down"></span></button>
				<ul 
					v-if="sett.options"
					:class="( 5 == id ? 'options-list--last' : '')"
					class="options-list">
					<li
						class="options-list__item"
						@click="selectOption"
						:data="option"
						v-for="option in sett.options.split( ' ' )">
						{{ option }}
					</li>
				</ul>
			</div>
		</div>
	</div>
	`,

	methods: 
	{
		toggleOptions( ev )
		{
			ev
			.target
			.closest( '.window__inp-el-wrap' )
			.querySelector( '.options-list' )
			.classList
			.toggle( "options-list--active" );
		},

		selectOption( ev )
		{
			let
				inp_el = ev.target
					.closest( '.window__inp-el-wrap' )
					.querySelector( '.window__inp-el' ),			
				property = inp_el.getAttribute( "data" ),
				value = ev.target.getAttribute( "data" );

			inp_el.value = value;

			this.setProperty( false, { property, value } );
			this.toggleOptions( ev );
		},

		setProperty( ev, data )
		{
			let
				property = !data ? ev.target.getAttribute( "data" ) : data.property,
				value = !data ? ev.target.value : data.value;

			document
				.querySelector( ':root' )
				.style
				.setProperty( property, value );


			settingsModel.set( property, value );
		}
	},

	created: function()
	{
		fetch( "./data/settings.json" )
			.then( res => res.json() )
			.then( res => this.settings = res );	
	}
};

const flibusta =
{
data: function()
	{
		return { 
			books: null,
			search_str: null,
			title: null,
			total: 0,
			curent: 0,
			step: 0 }
	},
	
	template:
	`
	<div>
		<header class="flibusta-header">
			<div class="search">
				<input class="search__inp-el" placeholder="Найти..." v-model="search_str" @change="getBooks">
				<button class="search__btn" @click="getBooks"><i class="fa fa-search"></i></button>
			</div>
			<div is="pugination"
				:total="total"
				:step="step"
				:curent="curent"
				:clb="changePage">
			</div>
		</header>
		<div class="books-list">
			<div
				v-for="book in books" 
				class="books-list-item" 
				:style="('background-image: url('+book.cover+');')">
				<main class="books-list-item__main">
					<p>{{ book.book_name }}</p>
					<p>{{ book.author }}</p>
				</main>
				<footer class="books-list-item__footer">
					<button class="footer__btn" @click="read( book )"><i class="fa fa-book"></i></button>
					<button class="footer__btn" @click="save( book )"><i class="fa fa-save"></i></button>
					<div class="book__downloads">
						<button class="footer__btn" @click="toggleDownloadsLinks"><i class="fa fa-download"></i></button>
						<div class="book__downloads-links">
							<a class="footer__btn" :href="(book.link + '/fb2')" target="_blank">Fb2</a>
							<a class="footer__btn" :href="(book.link + '/epub')" target="_blank">Epub</a>
							<a class="footer__btn" :href="(book.link + '/mobi')" target="_blank">Mobi</a>
						</div>
					</div>					
					<button class="footer__btn" @click="share( book )"><i class="fa fa-share-alt"></i></button>
					<button v-if="book.seria != ''" class="footer__btn" @click="getTheSeria( book.seria )"><i class="fa fa-angle-double-right"></i></button>
				</footer>
			</div>
		</div>
	
	</div>
	`,
	
	methods:
	{
		toggleBookSearchBox()
		{
			
			this.$el
			.querySelector( '.window' )
			.classList.toggle( 'window--active' )
		},

		toggleDownloadsLinks( ev )
		{
			
			ev.target
			.closest( '.book__downloads' )
			.querySelector( '.book__downloads-links' )
			.classList.toggle( 'book__downloads-links--active' )
		},
		
		getTheSeria( seria_id )
		{			
			fetch( `/seria/${ seria_id }` )
				.then( res => res.json() )
				.then( res => {
					this.books = res.books;
					this.total = res.total;
					this.curent = 0;
					this.step = res.step;
				} )
		},
		
		changePage( next_page )
		{			
			fetch( `/search/${ this.search_str }/${next_page}` )
				.then( res => res.json() )
				.then( res => { 
					this.books = res.books;
					this.total = res.total;
					this.curent = next_page;
					this.step = res.step;
				} )
		},

		getBooks()
		{
			if( this.search_str == '' )
				return;
			
			fetch( `/search/${ this.search_str }/0` )
				.then( res => res.json() )
				.then( res => {
					this.books = res.books;
					this.total = res.total;
					this.curent = 0;
					this.step = res.step;
				} )
		},

		read( book )
		{
			let
				{book_name, cover, main_url, _id, author, seria_name, anot } = book;

			fetch( `/read/${ _id }` )
				.then( res => res.text() )
				.then( res => {
					let book = 
						{
							content: res,
							cover: cover,
							title: book_name,
							author: author,
							seria_name: seria_name,
							anot: anot
						};
						
					this.$root.book = book;
				} )
		},
		
		save( book )
		{
			let
				{ _id, book_name, cover, author, link } = book;
				
			LSModel.set( "books", { _id, book_name, cover, author, link } );
		},
		
		share( book )
		{
			let
				{book_name, cover, _id } = book,
				cb = document.createElement("input"),
				book_url = `${window.location.origin}?id=${_id};book_name=${book_name};cover=${cover}`;
			
			
			document.body.appendChild( cb );
			cb.value = book_url;
			cb.select();
			document.execCommand('copy');
			cb.remove();
		}
	},
	
	created: function()
	{
		let
			search_book = window.location.search;
			
		
		if( search_book.indexOf( 'id=' ) == -1 )
			return false;
			
		let
			_id = search_book.match( /id=([0-9]*);/ )[1],
			book_name = search_book.match( /name=(.*);/ )[1],
			cover = search_book.match( /cover=([^]*)/ )[1];
			
		this.read( { _id, cover, book_name: decodeURIComponent( book_name ) } );
		
	},
	
	components: 
	{
		'pugination': pugination
	}
};

const my_books =
{
	data: function()
	{
		return { my_books: null }
	},
	
	template:
	`
		<div>
			<div class="books-list">
				<div
					v-for="book in my_books" 
					class="books-list-item" 
					:style="('background-image: url('+book.cover+');')">
					<main class="books-list-item__main">
						<p>{{ book.book_name }}</p>
						<p>{{ book.author }}</p>
					</main>
					<footer class="books-list-item__footer">
						<button class="footer__btn" @click="read( book )"><i class="fa fa-book"></i></button>
						<button class="footer__btn" @click="remove( book )"><i class="fa fa-remove"></i></button>
						<div class="book__downloads">
							<button class="footer__btn" @click="toggleDownloadsLinks"><i class="fa fa-download"></i></button>
							<div class="book__downloads-links">
								<a class="footer__btn" :href="(book.link + '/fb2')">Fb2</a>
								<a class="footer__btn" :href="(book.link + '/epub')">Epub</a>
								<a class="footer__btn" :href="(book.link + '/mobi')">Mobi</a>
							</div>
						</div>
					</footer>
				</div>
			</div>
		</div>
	`,
	
	methods:
	{
		toggleMyBook()
		{			
			this.booksUpdate();
			
			this.$el
				.querySelector( '.window' )
				.classList.toggle( 'window--active' )
		},
		
		booksUpdate()
		{
			this.my_books = LSModel.get( "books" ).sort( ( curent, next ) => curent.seria > next.seria ? 1 : -1 );
		},

		toggleDownloadsLinks( ev )
		{
			
			ev.target
				.closest( '.book__downloads' )
				.querySelector( '.book__downloads-links' )
				.classList.toggle( 'book__downloads-links--active' )
		},

		read( book )
		{
			let
				{book_name, cover, main_url, _id, author, seria_name, anot } = book;

			fetch( `/read/${ _id }` )
				.then( res => res.text() )
				.then( res => {
					let book = 
						{
							content: res,
							cover: cover,
							title: book_name,
							author: author,
							seria_name: seria_name,
							anot: anot
						};
					
					setTimeout( () => {
						let
							last_progress = readingStatus.last( book.title ),
							book_el = document.querySelector( '.book' );
							
						book_el.scrollTop = last_progress != 0 ?
						book_el.scrollHeight / 100 * last_progress : 0;
					}, 2000 );
						
					this.$root.book = book;
				} )
		},
		
		remove( book )
		{
			LSModel.del( "books", book._id );
		}
	},
	
	created: function()
	{
		this.booksUpdate()
	}
};

/*
 * aplet creator module
 * use for create construnted module
 *******************************************/
const aplet_creator = 
{
	props: ['aplet_list'],

	template: 
	`
	<div>
		<header class="aplet-list__header">
			<button
			v-for="aplet in aplet_list"
			class="options-btn"
			@click="setTab( aplet.name )"
			><span :class="aplet.ico"></span></button>
		</header>
		<main>
			<div
				v-for="( aplet, item ) in aplet_list"
				class="aplet-list__item"
				:class="(item == 0 ? 'aplet-list__item--active' : '')"
				:id="aplet.name"
				:is="aplet.name" >
			</div>
		</main>
	</div>
	`,

	methods:
	{
		setTab( aplet_id )
		{
			this.$el.querySelector( '.aplet-list__item--active' )
				.classList.remove( 'aplet-list__item--active' );

			this.$el.querySelector( `#${aplet_id}` )
				.classList.add( 'aplet-list__item--active' );
		}	
	},

	components: 
	{ 
		color_scheme,
		new_scheme,
		flibusta,
		my_books
	}
};

/*
 * win module
 *******************************************/
const win =
{
	props: ['content', 'ful_width'],

	template:
	`
	<div class="window"
		:class="( ful_width ? 'window--ful-width' : '' )"
	>
		<header class="window__header">
			<button 
				class="window__close-btn options-btn"
				@click="winClose"><span class="fa fa-close"></span></button>
		</header>
		<main class="window__main">
			<div 
				v-if="typeof content == 'string'"
				:is="content"></div>

			<div 
				v-if="typeof content == 'object'"
				is="aplet_creator"
				:aplet_list="content"></div>
		</main>
	</div>
	`,

	methods: 
	{
		winClose()
		{
			this.$el.classList.remove( 'window--active' )
		}
	},

	components: 
	{ 
		aplet_creator,
		win_content_settings,
		win_content_info,
		registration_win
	}
};

/*
 * widget modules
 * constructed widget elements of header
 *******************************************/

// settings aplet
const settings_aplet =
{
	data: function() 
	{
		return { settings: null }
	},

	template:
	`
	<div>
		<header_btn :ico="'fa fa-cogs'"></header_btn>
		<win :content="'win_content_settings'"></win>
	</div>
	`,

	components: { header_btn, win }
};

// colors aplet
const colors_aplet =
{
	template:
	`
	<div>
		<header_btn :ico="'fa fa-paint-brush'"></header_btn>
		<win :content="the_component_list"></win>
	</div>
	`,

	components: { header_btn, win },

	computed:
	{
		the_component_list()
		{
			return apletListGenerate( 
				"color_scheme, fa fa-list; new_scheme, fa fa-plus"
			);
		}
	}
};

// colors aplet
const libres_aplet =
{
	template:
	`
	<div>
		<header_btn :ico="'fa fa-book'"></header_btn>
		<win :content="the_component_list" :ful_width="true"></win>
	</div>
	`,

	components: { header_btn, win },

	computed:
	{
		the_component_list()
		{
			return apletListGenerate( 
				"flibusta, fa fa-search; my_books, fa fa-save"
			);
		}
	}
};

// inp book aplet
const inp_file_aplet = 
{
	template: 
	`
	<div class="options-btn open-book">
		<span class="fa fa-file"></span>
		<input type="file" class="open-book__inp" @change="select">
	</div>
	`,
	
	methods: 
	{
		select( ev )
		{
			let
				file = ev.target.files[0];		
			this.$emit( 'select', file );
		}
	}
};

// info aplet
const info_aplet = 
{
	template:
	`
	<div>
		<header_btn :ico="'fa fa-info'"></header_btn>
		<win :content="'win_content_info'"></win>
	</div>
	`,

	components: { header_btn, win }
};

// reading status aplet
const reading_status_aplet =
{
	data: function()
	{
		return { reading_status: null }
	},

	props: [ 'curent_reading_status' ],

	template:
	`
	<div class="reading-status-aplet">
		<span class="options-btn print-status" @click="toggleInp">{{ reading_status }}</span>
		<header_inp :placeholder="'Перейти к...'" :clb="goTo"></header_inp>

		<div class="reading-status-grafic" @click="progressLineChange">
			<span 
				class="reading-status-grafic__progress-line"></span>
		</div>
	</div>
	`,

	methods: 
	{
		goTo( coard )
		{
			let
				reg = /[0-9]/,
                book_el = document.querySelector( '.book' ),
                scrolling_now = book_el.clientHeight * ( coard-1 ) + 1;
                
			if( coard !== '' && reg.test( coard ) )
				book_el.scrollTop = scrolling_now;
		},

		progressLineChange( ev )
		{
			let
				book_el = document.querySelector( '.book' ),
				progress_bar = document.querySelector( '.reading-status-grafic' ),
				progress_bar_height = progress_bar.clientHeight,
				click_coard_y = ev.layerY,
				new_reading_status_procent = click_coard_y / progress_bar_height * 100;
			
			if( book_el )
				book_el.scrollTop = book_el.scrollHeight / 100 * new_reading_status_procent;
		},

		toggleInp()
		{
			this.$el.querySelector( '.header__inp' )
				.classList.toggle( 'header__inp--active' );
		}
	},

	watch: 
	{
		curent_reading_status( new_status )
		{
			let
				book_el = document.querySelector( '.book' ),
				progress_line = document.querySelector( '.reading-status-grafic__progress-line' ),
				book_height = book_el.scrollHeight,
                total_pages = Math.floor( book_height /  book_el.clientHeight ),
                curen_page = Math.ceil( book_el.scrollTop / book_el.clientHeight );

			if( curen_page < 1 )
				curen_page = 1;

			progress_line.style.height = `${new_status}%`;

			this.reading_status = `${curen_page}/${total_pages}`;
		}
	},

	components: { header_inp }
};

// registration aplet
const registration_aplet = 
{
	template:
	`
	<div style="display: none">
		<header_btn :ico="'fa fa-user'"></header_btn>
		<win :content="'registration_win'"></win>
	</div>
	`,

	components: { header_btn, win }
};

// reading status aplet
const bookmark_aplet =
{
	props: [ 'curent_reading_status' ],

	template:
	`
	<div class="reading-status-aplet">
		<button class="options-btn" @click="toggleInp"><span class="fa fa-bookmark"></span></button>
		<header_inp :placeholder="'Имя новой закладки'" :clb="addBookmark"></header_inp>
	</div>
	`,

	methods: 
	{
		addBookmark( bookmark_name )
		{
			if( bookmark_name == '' && !bookmark_name )
				return false

			let
                book_el = document.querySelector( '.book' ),
                progress = book_el.scrollTop / book_el.scrollHeight * 100;

            LSModel.set( 'bookmark', { book: this.$root.book.title, name: bookmark_name, progress } );
            msg( `Добавлена закладка '${bookmark_name}' в книге: '${ this.$root.book.title }'` );
		},

		toggleInp()
		{
			this.$el.querySelector( '.header__inp' )
				.classList.toggle( 'header__inp--active' );
		}
	},
	components: { header_inp }
};

/*
 * header module
 *******************************************/
export const header = 
{
	props: ['curent_reading_status', 'book_open'],
	
	template: 
	`
		<header 
			class="main-header-wrap" >
			<div class="main-header conatiner">
				<div 
					class="options"
					:class="book_open ? 'options--active' : ''"
					>
					<inp_file_aplet @select="selectFile" ></inp_file_aplet>
					<libres_aplet></libres_aplet>
					<bookmark_aplet v-if="curent_reading_status != undefined"></bookmark_aplet>
					<div 
						v-if="curent_reading_status != undefined"
						is="reading_status_aplet" 
						:curent_reading_status="curent_reading_status">
					</div>
					<settings_aplet></settings_aplet>
					<colors_aplet></colors_aplet>
					<info_aplet></info_aplet>
					<registration_aplet></registration_aplet>
				</div>
			</div>
		</header>
	`,
	
	components: 
	{
		inp_file_aplet,
		reading_status_aplet,
		settings_aplet,
		colors_aplet,
		info_aplet,
		libres_aplet,
		bookmark_aplet,
		registration_aplet
	},
	
	methods:
	{
		selectFile( file )
		{
			if( file )
				this.$emit( 'select', file );
		}
	}
};
