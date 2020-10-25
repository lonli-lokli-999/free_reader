//////////////////////////////////// input book aplet 
const inp_file = 
{
	template: 
	`
	<div class="open-book options-btn">
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
//////////////////////////////////// input book aplet end

//////////////////////////////////// color settings aplet
const color_settings = 
{
	data: function()
	{
		return {
			themes: null,
			new_user_theme_name: null,
			new_user_theme_header_bg: null,
			new_user_theme_header_color: null,
			new_user_theme_main_bg: null,
			new_user_theme_main_color: null
		}
	},
	
	template:
	`
	<div>
		<button class="options-btn" @click="setStatus"><span class="fa fa-paint-brush"></span></button>
		<div class="window">
			<span class="window__label">Выберите цветовую схему</span>
			<button v-for="( theme, id ) in themes" 
					@click="setTheme" 
					class="window__inp-el" 
					:data="theme.colors" :data-theme-name="theme.name">
				{{theme.name}}
			</button>
			<span class="window__label">Создать цветовую схему</span>
			
			<input class="window__inp-el" v-model="new_user_theme_name" placeholder="Введите имя темы">
			
			<div class="window__color-writer">
				<input type="color" class="color-inp" v-model="new_user_theme_header_bg" title="Фон шапки">
				<input type="color" class="color-inp" v-model="new_user_theme_header_color" title="Цвет шапки">
				<input type="color" class="color-inp" v-model="new_user_theme_main_bg" title="Фон контента" >
				<input type="color" class="color-inp" v-model="new_user_theme_main_color" title="Цвет контента" >
			</div>
			
			<button class="window__btn" @click="addTheme( true )">Добавить</button>
			<button class="window__btn" @click="addTheme( false )">Применить</button>
		</div>
	</div>
	`,
	
	methods:
	{
		setStatus()
		{
			this.$el
			.querySelector( '.window' )
			.classList.toggle( 'window--active' );
		},

		addTheme( save )
		{
			let
				new_theme = `${this.new_user_theme_header_bg} ${this.new_user_theme_header_color} ${this.new_user_theme_main_bg} ${this.new_user_theme_main_color}`;
				
			if( new_theme )
				this.activeTheme( new_theme );

			if( save && new_theme && this.new_user_theme_name )
			{
				let
					themes = localStorage.themes ? JSON.parse( localStorage.themes ) : [],
					to_save_new_theme =
					{
						name: this.new_user_theme_name,
						colors: new_theme,
						user: true
					};

				themes.push( to_save_new_theme );
				this.themes.push( to_save_new_theme );
				this.new_user_theme_name = null;
				
				localStorage.themes = JSON.stringify( themes );
			};
		},
		
		setTheme( ev )
		{
			let
				target = ev.target,
				data = target.getAttribute( 'data' ),
				theme_name = target.getAttribute( 'data-theme-name' );
			
			this.$el
				.querySelector( '.window__btn--active' )
				.classList
				.remove('window__btn--active');
				
			target.classList.add( 'window__btn--active' );
			
			this.setDefTheme( theme_name, data )
			this.activeTheme( data );
		},
		
		setDefTheme( name, colors )
		{
			localStorage.def_theme_name = name;
			localStorage.def_theme = colors;
		},
		
		activeTheme( data )
		{
			let main_css_var = document.querySelector( ':root' ).style;
			
			data = data.split( ' ' );
			
			this.new_user_theme_header_bg = data[0];
			this.new_user_theme_header_color = data[1];
			this.new_user_theme_main_bg = data[2];
			this.new_user_theme_main_color = data[3];
			
			main_css_var.setProperty( '--header-bg', data[0] );
			main_css_var.setProperty( '--header-color', data[1] );
			main_css_var.setProperty( '--content-bg', data[2] );
			main_css_var.setProperty( '--content-color', data[3] );
			main_css_var.setProperty( '--translucent-color', `${data[3]}88` );
		}
	},
	
	created()
	{
		let
			user_themes = localStorage.themes ? JSON.parse( localStorage.themes ) : [];
			
		fetch( './data/themes.json' )
			.then( res => res.json() )
			.then( res => { 
				this.themes = res.concat( user_themes );
				this.activeTheme( localStorage.def_theme ? localStorage.def_theme : res[0].colors );
				
				setTimeout( () => {
						this.$el
							.querySelectorAll( '[data-theme-name]' )
							.forEach( ( theme_btn, id ) => {								
								if( localStorage.def_theme )
									if( theme_btn.getAttribute( 'data-theme-name' ) == localStorage.def_theme_name )
										theme_btn.classList.add( 'window__btn--active' );
										
								if( id == 0 && !localStorage.def_theme )
									theme_btn.classList.add( 'window__btn--active' );
							} );
				}, 1000 );
			} );
	}
};
//////////////////////////////////// color settings aplet end

//////////////////////////////////// settings aplet
const settings =
{
	data: function() {
		let
			data = {},
			root = getComputedStyle( document.documentElement );
			
		data.system_font = root.getPropertyValue( '--system-fonts');
		data.book_font = root.getPropertyValue( '--book-fonts');
		data.book_font_size = root.getPropertyValue( '--book-font-size');
		
		return data
	},
	
	template:
	`
	<div>
		<button @click="setStatus" class="options-btn"><span class="fa fa-cogs"></span></button>
		<div class="window">
			<span class="window__label">Размер шрифта</span>
			<input class="window__inp-el" placeholder="Размер шрифта" v-model="book_font_size">
			
			<span class="window__label">Шрифт книги</span>
			<input class="window__inp-el" placeholder="Шрифт книги" v-model="book_font">
			
			<span class="window__label">Системный шрифт</span>
			<input class="window__inp-el" placeholder="Системный шриф" v-model="system_font">
			
			<span class="window__label">Выравнивание</span>
			 <div class="align-book-text">
				<button class="align-book-text__btn window__inp-el window__btn--active" data="left" @click="setAlign"><span class="fa fa-align-left"></span></button>
				<button class="align-book-text__btn window__inp-el" data="right" @click="setAlign"><span class="fa fa-align-right"></span></button>
				<button class="align-book-text__btn window__inp-el" data="center" @click="setAlign"><span class="fa fa-align-center"></span></button>
				<button class="align-book-text__btn window__inp-el" data="justify" @click="setAlign" ><span class="fa fa-align-justify"></span></button>
			</div>
		</div>
	</div>
	`,
	
	methods:
	{
		setStatus()
		{
			this.$el
			.querySelector( '.window' )
			.classList.toggle( 'window--active' )
		},
		
		setAlign( ev )
		{
			let
				target =	ev.target.tagName == 'BUTTON' ?
							ev.target : 
							ev.target.closest('button'),
				align = target.getAttribute('data');
				
			this.$el
				.querySelector('.window__btn--active')
				.classList.remove( 'window__btn--active' );
				
			this.$el
				.querySelector( `[data="${align}"]` )
				.classList.add( 'window__btn--active' );
				
			document
				.querySelector('.book')
				.style.textAlign = align;
		}
	},
	
	watch: {
		system_font( val ){
			document
				.querySelector( ':root' )
				.style
				.setProperty( '--system-fonts', val );
		},
		
		book_font( val ){
			document
				.querySelector( ':root' )
				.style
				.setProperty( '--book-fonts', val );
		},
		
		book_font_size( val ){
			document
				.querySelector( ':root' )
				.style
				.setProperty( '--book-font-size', val );
		}
	}
};
//////////////////////////////////// settings aplet end

//////////////////////////////////// reading status aplet
const reading_status_aplet =
{
props: ['reading_status'],
	
	template:
	`
	<div class="reading-status-aplet">
		<span class="print-status options-btn" @click="toggleInp">{{ reading_status.pages }}</span>
		
		<input class="reading-status__inp" placeholder="Прейти к ..." @change="setReadingStatus()">
		
		<div class="reading-status-grafic" @click="setBookProgressInProcent">
			<span class="reading-status-grafic__progress-line" :style="'width:'+reading_status.procent+'%'"></span>
		</div>
	</div>
	`,
	
	methods:
	{
		setBookProgressInProcent(ev)
		{
			let
				book_el = document.querySelector( '.book' ),
				progress_bar = document.querySelector( '.reading-status-grafic' ),
				progress_bar_width = progress_bar.clientWidth,
				click_coard_x = ev.layerX,
				new_reading_status_procent = click_coard_x / progress_bar_width * 100;
			
			book_el.scrollTop = book_el.scrollHeight / 100 * new_reading_status_procent;
		},
		
		setReadingStatus()
		{
			let
				reg = /[0-9]/,
                book_el = document.querySelector( '.book' ),
				inp_value = document.querySelector( '.reading-status__inp' ).value,
                scrolling_now = book_el.clientHeight * ( inp_value-1 ) + 1;
                
				if( inp_value !== '' && reg.test( inp_value ) )
					book_el.scrollTop = scrolling_now;
					
				document.querySelector( '.reading-status__inp' ).value = null
		},
		
		toggleInp()
		{
			document
				.querySelector( '.reading-status__inp' )
				.classList.toggle( 'reading-status__inp--active' );
				
			document
				.querySelector( '.reading-status-grafic' )
				.classList.toggle( 'reading-status-grafic--active' );
		}
	}
};
//////////////////////////////////// reading status aplet end

//////////////////////////////////// bookmarks aplet
const bookmarks = 
{
	props: ['book_name'],
	
	data: function()
	{
		return {
			bookmark_name: null
		}
	},
	
	template:
	`
	<div class="bookmarks-aplet">
		<button class="options-btn" @click="toggleInp"><span class="fa fa-bookmark"></span></button>
		<input class="bookmarks__inp" placeholder="Имя закладки ..." v-model="bookmark_name" @change="saveBookmark">
	</div>
	`,
	
	methods:
	{
		toggleInp()
		{
			this.$el
				.querySelector( '.bookmarks__inp' )
				.classList.toggle( 'bookmarks__inp--active' );
		},
		
		saveBookmark()
		{
			if( !this.bookmark_name )
				return;	
				
			let
				all_bookmarks = localStorage.bookmarks ? JSON.parse( localStorage.bookmarks ) : [],
				book = document.querySelector( '.book' ),
				new_bookmark = 
				{
					id: new Date().getTime(),
					name: this.bookmark_name,
					process: book.scrollTop / book.scrollHeight * 100,
					book_name: this.book_name
				};
			
			all_bookmarks.push( new_bookmark );
			localStorage.bookmarks = JSON.stringify( all_bookmarks );
			
			this.bookmark_name = null;
			this.toggleInp();
		}
	}
};
//////////////////////////////////// bookmarks aplet end

//////////////////////////////////// flibusta aplet
const flibusta =
{
data: function()
	{
		return { books: null, search_str: null }
	},
	
	template:
	`
	<div class="flibusta-aplet">
		<button @click="toggleBookSearchBox" class="options-btn">
			<span class="fa fa-search"></span>
		</button>

		<div class="flibusta-aplet__search-box window">
			<header class="search-box__header">
				<div class="search">
					<input class="search__inp-el" placeholder="Введите название книги." v-model="search_str" @change="getBooks">
					<button class="search__btn" @click="getBooks"><i class="fa fa-search"></i></button>
				</div>
				<button class="window__close-btn window__btn" @click="toggleBookSearchBox"><i class="fa fa-close"></i></button>
			</header>

			<main class="flibusta-aplet__main">
				<div class="books-list">
					<div v-for="book in books" class="books-list-item" :style="('background-image: url('+book.main_url+book.cover+');')">
						<main class="books-list-item__main">
							<p>{{ book.book_name }}</p>
							<p>{{ book.author }}</p>
						</main>
						<footer class="books-list-item__footer">
							<button class="footer__btn" @click="read( book )"><i class="fa fa-book"></i></button>
							<div class="book__downloads">
								<button class="footer__btn" @click="toggleDownloadsLinks"><i class="fa fa-download"></i></button>
								<div class="book__downloads-links">
									<a class="footer__btn" :href="(book.main_url+book.link + '/fb2')">Fb2</a>
									<a class="footer__btn" :href="(book.main_url+book.link + '/epub')">Epub</a>
									<a class="footer__btn" :href="(book.main_url+book.link + '/mobi')">Mobi</a>
								</div>
							</div>					
						</footer>
					</div>
				</div>
			</main>
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

		getBooks()
		{
			if( this.search_str == '' )
				return;
			
			fetch( `/search/${ this.search_str }` )
				.then( res => res.json() )
				.then( res => { this.books = res } )
		},

		read( book )
		{
			let
				{book_name, cover, main_url, _id } = book;

			fetch( `/read${ _id }` )
				.then( res => res.text() )
				.then( res => {
					let book = 
						{
							content: res,
							cover: `${main_url}/${cover}`,
							title: book_name
						};
						
					this.$emit( 'libopen', book );
				} )
		}
	}
};
//////////////////////////////////// flibusta aplet end

//////////////////////////////////// info
const info = 
{
	template:
	`
	<div>
		<button @click="setStatus" class="options-btn"><span class="fa fa-info"></span></button>
		<div class="window">
			<h2 class="window__label">О приложении - Free reader</h2>
			<p>V - 3.0.0</p>
			<p>Free reader - это безплатное веб приложение с открытым исходным кодом.</p>
			<p>Программа предаставляет возможность:</p>
			<p>чтения форматов fb2, epub, txt;</p>
			<p>поиск книг по базе данных flibusta;</p>
			<p>гибкие настройки интерфейса;</p>
			<h2 class="window__label">Ссылки</h2>
			<ul>
				<li><a href="https://github.com/lonli-lokli-999/open-fb2-web">Github</a></li>
				<li><a href="https://money.yandex.ru/to/410017268643291">Поддержать разработку</a></li>
			</ul>
		</div>
	</div>
	`,
	
	methods:
	{
		setStatus()
		{
			this.$el
			.querySelector( '.window' )
			.classList.toggle( 'window--active' )
		}
	}	
};
//////////////////////////////////// info end

//////////////////////////////////// export header
export const header = 
{
	props: ['reading_status', 'book_name'],
	
	data: function()
	{
		return { book_open: false }
	},
	
	template: 
	`
		<header class="main-header-wrap" >
			<div class="main-header conatiner">
				<div class="options">
					<div is="inp_file" @select="selectFile"></div>
					<div is="flibusta" @libopen="bookOpen"></div>
					<div v-if="book_open" is="bookmarks" :book_name="book_name"></div>
					<div is="settings"></div>
					<div is="color_settings"></div>
					<div is="info"></div>
					<div v-if="reading_status" is="reading_status_aplet" :reading_status="reading_status"></div>
				</div>
			</div>
		</header>
	`,
	
	components: 
	{
		'inp_file': inp_file,
		'color_settings': color_settings,
		'settings': settings,
		'reading_status_aplet': reading_status_aplet,
		'flibusta': flibusta,
		'bookmarks': bookmarks,
		'info': info
	},
	
	methods:
	{
		selectFile( file )
		{
			if( file )
				this.$emit( 'select', file );
				
			this.book_open = file ? true : false;
		},
		
		bookOpen( book )
		{
			this.$emit( 'flibopen', book );
		}
	}
};
//////////////////////////////////// export header
