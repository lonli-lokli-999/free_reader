const pugination={props:{curent:{default:0},total:{default:0},step:{default:0},clb:{default:!1}},computed:{pages(){return Math.ceil(this.total/this.step)},page_list(){let t=this.curent-2,e=this.curent+2,n=[];t=t<0?0:t,e=e>this.pages-1?this.pages-1:e;for(let o=t;o<=e;o++)n.push(o);return n}},methods:{nextPage(){this.clb(this.curent+1)},prevPage(){this.clb(this.curent-1)},changePage(t){this.clb(t)}},template:'\n\t\t<div v-if="total > 0 && this.clb" class="pugination">\n\t\t\t<button class="pugination__btn"\n\t\t\t\tv-if="curent > 0"\n\t\t\t\t@click="prevPage"\n\t\t\t>Назад</button>\n\t\t\t<div>\n\t\t\t\t<button class="pugination__btn"\n\t\t\t\t\t:class="{active: page_index == curent}"\n\t\t\t\t\tv-for="page_index in page_list"\n\t\t\t\t\t@click="changePage( page_index )"\n\t\t\t\t>\n\t\t\t\t{{ page_index + 1 }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<button class="pugination__btn"\n\t\t\t\tv-if="( curent + 1 ) < pages"\n\t\t\t\t@click="nextPage"\n\t\t\t>Вперед</button>\n\t\t</div>\n\t'},inp_file={template:'\n\t<div class="open-book options-btn">\n\t\t<span class="fa fa-file"></span>\n\t\t<input type="file" class="open-book__inp" @change="select">\n\t</div>\n\t',methods:{select(t){let e=t.target.files[0];this.$emit("select",e)}}},color_settings={data:function(){return{themes:null,new_user_theme_name:null,new_user_theme_header_bg:null,new_user_theme_header_color:null,new_user_theme_main_bg:null,new_user_theme_main_color:null}},template:'\n\t<div>\n\t\t<button class="options-btn" @click="setStatus"><span class="fa fa-paint-brush"></span></button>\n\t\t<div class="window">\n\t\t\t<header class="window__header">\n\t\t\t\t<button class="window__close-btn window__btn" @click="setStatus"><i class="fa fa-close"></i></button>\n\t\t\t</header>\n\t\t\t\n\t\t\t<main class="window__main">\n\t\t\t\t<span class="window__label">Выберите цветовую схему</span>\n\t\t\t\t<button v-for="( theme, id ) in themes" \n\t\t\t\t\t\t@click="setTheme" \n\t\t\t\t\t\tclass="window__inp-el" \n\t\t\t\t\t\t:data="theme.colors" :data-theme-name="theme.name">\n\t\t\t\t\t{{theme.name}}\n\t\t\t\t</button>\n\t\t\t\t<span class="window__label">Создать цветовую схему</span>\n\t\t\t\t\n\t\t\t\t<input class="window__inp-el" v-model="new_user_theme_name" placeholder="Введите имя темы">\n\t\t\t\t\n\t\t\t\t<div class="window__color-writer">\n\t\t\t\t\t<input type="color" class="color-inp" v-model="new_user_theme_header_bg" title="Фон шапки">\n\t\t\t\t\t<input type="color" class="color-inp" v-model="new_user_theme_header_color" title="Цвет шапки">\n\t\t\t\t\t<input type="color" class="color-inp" v-model="new_user_theme_main_bg" title="Фон контента" >\n\t\t\t\t\t<input type="color" class="color-inp" v-model="new_user_theme_main_color" title="Цвет контента" >\n\t\t\t\t</div>\n\t\t\t\t\n\t\t\t\t<button class="window__btn" @click="addTheme( true )">Добавить</button>\n\t\t\t\t<button class="window__btn" @click="addTheme( false )">Применить</button>\n\t\t\t</main>\n\t\t</div>\n\t</div>\n\t',methods:{setStatus(){this.$el.querySelector(".window").classList.toggle("window--active")},addTheme(t){let e=`${this.new_user_theme_header_bg} ${this.new_user_theme_header_color} ${this.new_user_theme_main_bg} ${this.new_user_theme_main_color}`;if(e&&this.activeTheme(e),t&&e&&this.new_user_theme_name){let t=localStorage.themes?JSON.parse(localStorage.themes):[],n={name:this.new_user_theme_name,colors:e,user:!0};t.push(n),this.themes.push(n),this.new_user_theme_name=null,localStorage.themes=JSON.stringify(t)}},setTheme(t){let e=t.target,n=e.getAttribute("data"),o=e.getAttribute("data-theme-name");this.$el.querySelector(".window__btn--active").classList.remove("window__btn--active"),e.classList.add("window__btn--active"),this.setDefTheme(o,n),this.activeTheme(n)},setDefTheme(t,e){localStorage.def_theme_name=t,localStorage.def_theme=e},activeTheme(t){let e=document.querySelector(":root").style;t=t.split(" "),this.new_user_theme_header_bg=t[0],this.new_user_theme_header_color=t[1],this.new_user_theme_main_bg=t[2],this.new_user_theme_main_color=t[3],e.setProperty("--header-bg",t[0]),e.setProperty("--header-color",t[1]),e.setProperty("--content-bg",t[2]),e.setProperty("--content-color",t[3]),e.setProperty("--translucent-color",t[3]+"88")}},created(){let t=localStorage.themes?JSON.parse(localStorage.themes):[];fetch("./data/themes.json").then(t=>t.json()).then(e=>{this.themes=e.concat(t),this.activeTheme(localStorage.def_theme?localStorage.def_theme:e[0].colors),setTimeout(()=>{this.$el.querySelectorAll("[data-theme-name]").forEach((t,e)=>{localStorage.def_theme&&t.getAttribute("data-theme-name")==localStorage.def_theme_name&&t.classList.add("window__btn--active"),0!=e||localStorage.def_theme||t.classList.add("window__btn--active")})},1e3)})}},settings={data:function(){let t={},e=getComputedStyle(document.documentElement);return t.system_font=e.getPropertyValue("--system-fonts"),t.book_font=e.getPropertyValue("--book-fonts"),t.book_font_size=e.getPropertyValue("--book-font-size"),t},template:'\n\t<div>\n\t\t<button @click="setStatus" class="options-btn"><span class="fa fa-cogs"></span></button>\n\t\t<div class="window">\n\t\t\t<header class="window__header">\n\t\t\t\t<button class="window__close-btn window__btn" @click="setStatus"><i class="fa fa-close"></i></button>\n\t\t\t</header>\n\t\t\t\n\t\t\t<main class="window__main">\n\t\t\t\t<span class="window__label">Размер шрифта</span>\n\t\t\t\t<input class="window__inp-el" placeholder="Размер шрифта" v-model="book_font_size">\n\t\t\t\t\n\t\t\t\t<span class="window__label">Шрифт книги</span>\n\t\t\t\t<input class="window__inp-el" placeholder="Шрифт книги" v-model="book_font">\n\t\t\t\t\n\t\t\t\t<span class="window__label">Системный шрифт</span>\n\t\t\t\t<input class="window__inp-el" placeholder="Системный шриф" v-model="system_font">\n\t\t\t\t\n\t\t\t\t<span class="window__label">Выравнивание</span>\n\t\t\t\t <div class="align-book-text">\n\t\t\t\t\t<button class="align-book-text__btn window__inp-el window__btn--active" data="left" @click="setAlign"><span class="fa fa-align-left"></span></button>\n\t\t\t\t\t<button class="align-book-text__btn window__inp-el" data="right" @click="setAlign"><span class="fa fa-align-right"></span></button>\n\t\t\t\t\t<button class="align-book-text__btn window__inp-el" data="center" @click="setAlign"><span class="fa fa-align-center"></span></button>\n\t\t\t\t\t<button class="align-book-text__btn window__inp-el" data="justify" @click="setAlign" ><span class="fa fa-align-justify"></span></button>\n\t\t\t\t</div>\n\t\t\t</main>\n\t\t</div>\n\t</div>\n\t',methods:{setStatus(){this.$el.querySelector(".window").classList.toggle("window--active")},setAlign(t){let e=("BUTTON"==t.target.tagName?t.target:t.target.closest("button")).getAttribute("data");this.$el.querySelector(".window__btn--active").classList.remove("window__btn--active"),this.$el.querySelector(`[data="${e}"]`).classList.add("window__btn--active"),document.querySelector(".book").style.textAlign=e}},watch:{system_font(t){document.querySelector(":root").style.setProperty("--system-fonts",t)},book_font(t){document.querySelector(":root").style.setProperty("--book-fonts",t)},book_font_size(t){document.querySelector(":root").style.setProperty("--book-font-size",t)}}},reading_status_aplet={props:["reading_status"],template:'\n\t<div class="reading-status-aplet">\n\t\t<span class="print-status options-btn" @click="toggleInp">{{ reading_status.pages }}</span>\n\t\t\n\t\t<input class="reading-status__inp" placeholder="Прейти к ..." @change="setReadingStatus()">\n\t\t\n\t\t<div class="reading-status-grafic" @click="setBookProgressInProcent">\n\t\t\t<span class="reading-status-grafic__progress-line" :style="\'width:\'+reading_status.procent+\'%\'"></span>\n\t\t</div>\n\t</div>\n\t',methods:{setBookProgressInProcent(t){let e=document.querySelector(".book"),n=document.querySelector(".reading-status-grafic").clientWidth,o=t.layerX/n*100;e.scrollTop=e.scrollHeight/100*o},setReadingStatus(){let t=document.querySelector(".book"),e=document.querySelector(".reading-status__inp").value,n=t.clientHeight*(e-1)+1;""!==e&&/[0-9]/.test(e)&&(t.scrollTop=n),document.querySelector(".reading-status__inp").value=null},toggleInp(){document.querySelector(".reading-status__inp").classList.toggle("reading-status__inp--active"),document.querySelector(".reading-status-grafic").classList.toggle("reading-status-grafic--active")}}},bookmarks={props:["book_name"],data:function(){return{bookmark_name:null}},template:'\n\t<div class="bookmarks-aplet">\n\t\t<button class="options-btn" @click="toggleInp"><span class="fa fa-bookmark"></span></button>\n\t\t<input class="bookmarks__inp" placeholder="Имя закладки ..." v-model="bookmark_name" @change="saveBookmark">\n\t</div>\n\t',methods:{toggleInp(){this.$el.querySelector(".bookmarks__inp").classList.toggle("bookmarks__inp--active")},saveBookmark(){if(!this.bookmark_name)return;let t=localStorage.bookmarks?JSON.parse(localStorage.bookmarks):[],e=document.querySelector(".book"),n={id:(new Date).getTime(),name:this.bookmark_name,process:e.scrollTop/e.scrollHeight*100,book_name:this.book_name};t.push(n),localStorage.bookmarks=JSON.stringify(t),this.bookmark_name=null,this.toggleInp()}}},flibusta={data:function(){return{books:null,search_str:null,title:null,total:0,curent:0,step:0}},template:'\n\t<div class="flibusta-aplet">\n\t\t<button @click="toggleBookSearchBox" class="options-btn">\n\t\t\t<span class="fa fa-search"></span>\n\t\t</button>\n\n\t\t<div class="flibusta-aplet__search-box window">\n\t\t\t<header class="window__header">\n\t\t\t\t<div class="search">\n\t\t\t\t\t<input class="search__inp-el" placeholder="Введите название книги." v-model="search_str" @change="getBooks">\n\t\t\t\t\t<button class="search__btn" @click="getBooks"><i class="fa fa-search"></i></button>\n\t\t\t\t</div>\n\t\t\t\t<button class="window__close-btn window__btn" @click="toggleBookSearchBox"><i class="fa fa-close"></i></button>\n\t\t\t</header>\n\n\t\t\t<main class="window__main">\n\t\t\t\t<div class="books-list">\n\t\t\t\t\t<div\n\t\t\t\t\t\tv-for="book in books" \n\t\t\t\t\t\tclass="books-list-item" \n\t\t\t\t\t\t:style="(\'background-image: url(\'+book.cover+\');\')">\n\t\t\t\t\t\t<main class="books-list-item__main">\n\t\t\t\t\t\t\t<p>{{ book.book_name }}</p>\n\t\t\t\t\t\t\t<p>{{ book.author }}</p>\n\t\t\t\t\t\t</main>\n\t\t\t\t\t\t<footer class="books-list-item__footer">\n\t\t\t\t\t\t\t<button class="footer__btn" @click="read( book )"><i class="fa fa-book"></i></button>\n\t\t\t\t\t\t\t<button class="footer__btn" @click="save( book )"><i class="fa fa-save"></i></button>\n\t\t\t\t\t\t\t<div class="book__downloads">\n\t\t\t\t\t\t\t\t<button class="footer__btn" @click="toggleDownloadsLinks"><i class="fa fa-download"></i></button>\n\t\t\t\t\t\t\t\t<div class="book__downloads-links">\n\t\t\t\t\t\t\t\t\t<a class="footer__btn" :href="(book.link + \'/fb2\')" target="_blank">Fb2</a>\n\t\t\t\t\t\t\t\t\t<a class="footer__btn" :href="(book.link + \'/epub\')" target="_blank">Epub</a>\n\t\t\t\t\t\t\t\t\t<a class="footer__btn" :href="(book.link + \'/mobi\')" target="_blank">Mobi</a>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\t\t\t\t\t\n\t\t\t\t\t\t</footer>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t\n\t\t\t\t<div is="pugination"\n\t\t\t\t\t:total="total"\n\t\t\t\t\t:step="step"\n\t\t\t\t\t:curent="curent"\n\t\t\t\t\t:clb="changePage"\n\t\t\t\t></div>\n\t\t\t</main>\n\t\t</div>\n\t</div>\n\t',methods:{toggleBookSearchBox(){this.$el.querySelector(".window").classList.toggle("window--active")},toggleDownloadsLinks(t){t.target.closest(".book__downloads").querySelector(".book__downloads-links").classList.toggle("book__downloads-links--active")},changePage(t){fetch(`/search/${this.search_str}/${t}`).then(t=>t.json()).then(e=>{this.books=e.books,this.total=e.total,this.curent=t,this.step=e.step})},getBooks(){""!=this.search_str&&fetch(`/search/${this.search_str}/0`).then(t=>t.json()).then(t=>{this.books=t.books,this.total=t.total,this.curent=0,this.step=t.step})},read(t){let{book_name:e,cover:n,main_url:o,_id:s}=t;fetch("/read/"+s).then(t=>t.text()).then(t=>{let o={content:t,cover:n,title:e};console.log(o),this.$emit("libopen",o)})},save(t){let e=localStorage.books?JSON.parse(localStorage.books):[],n=e.find(e=>e._id==t._id),{_id:o,book_name:s,cover:a,author:i,link:l}=t;e.push({_id:o,book_name:s,cover:a,author:i,link:l}),n||(localStorage.books=JSON.stringify(e))}},components:{pugination:pugination}},my_books={data:function(){return{books:null}},template:'\n\t<div class="my-books-aplet">\n\t\t<button @click="toggleMyBook" class="options-btn">\n\t\t\t<span class="fa fa-save"></span>\n\t\t</button>\n\n\t\t<div class="flibusta-aplet__search-box window">\n\t\t\t<header class="window__header">\n\t\t\t\t<button class="window__close-btn window__btn" @click="toggleMyBook"><i class="fa fa-close"></i></button>\n\t\t\t</header>\n\n\t\t\t<main class="window__main">\n\t\t\t\t<div class="books-list">\n\t\t\t\t\t<div\n\t\t\t\t\t\tv-for="book in books" \n\t\t\t\t\t\tclass="books-list-item" \n\t\t\t\t\t\t:style="(\'background-image: url(\'+book.cover+\');\')">\n\t\t\t\t\t\t<main class="books-list-item__main">\n\t\t\t\t\t\t\t<p>{{ book.book_name }}</p>\n\t\t\t\t\t\t\t<p>{{ book.author }}</p>\n\t\t\t\t\t\t</main>\n\t\t\t\t\t\t<footer class="books-list-item__footer">\n\t\t\t\t\t\t\t<button class="footer__btn" @click="read( book )"><i class="fa fa-book"></i></button>\n\t\t\t\t\t\t\t<button class="footer__btn" @click="remove( book )"><i class="fa fa-remove"></i></button>\n\t\t\t\t\t\t\t<div class="book__downloads">\n\t\t\t\t\t\t\t\t<button class="footer__btn" @click="toggleDownloadsLinks"><i class="fa fa-download"></i></button>\n\t\t\t\t\t\t\t\t<div class="book__downloads-links">\n\t\t\t\t\t\t\t\t\t<a class="footer__btn" :href="(book.link + \'/fb2\')">Fb2</a>\n\t\t\t\t\t\t\t\t\t<a class="footer__btn" :href="(book.link + \'/epub\')">Epub</a>\n\t\t\t\t\t\t\t\t\t<a class="footer__btn" :href="(book.link + \'/mobi\')">Mobi</a>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\t\t\t\t\t\n\t\t\t\t\t\t</footer>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</main>\n\t\t</div>\n\t</div>\n\t',methods:{toggleMyBook(){this.booksUpdate(),this.$el.querySelector(".window").classList.toggle("window--active")},booksUpdate(){this.books=localStorage.books?JSON.parse(localStorage.books):[]},toggleDownloadsLinks(t){t.target.closest(".book__downloads").querySelector(".book__downloads-links").classList.toggle("book__downloads-links--active")},read(t){let{book_name:e,cover:n,main_url:o,_id:s}=t;fetch("/read/"+s).then(t=>t.text()).then(t=>{let o={content:t,cover:n,title:e};this.$emit("libopen",o)})},remove(t){let e=localStorage.books?JSON.parse(localStorage.books):[];e=e.filter(e=>e._id!=t._id),localStorage.books=JSON.stringify(e)}}},info={template:'\n\t<div>\n\t\t<button @click="setStatus" class="options-btn"><span class="fa fa-info"></span></button>\n\t\t<div class="window">\n\t\t\t<header class="window__header">\n\t\t\t\t<button class="window__close-btn window__btn" @click="setStatus"><i class="fa fa-close"></i></button>\n\t\t\t</header>\n\t\t\t<main class="window__main">\n\t\t\t\t<h2 class="window__label">О приложении - Free reader</h2>\n\t\t\t\t<p>V - 3.0.0</p>\n\t\t\t\t<p>Free reader - это безплатное веб приложение с открытым исходным кодом.</p>\n\t\t\t\t<p>Программа предаставляет возможность:</p>\n\t\t\t\t<p>чтения форматов fb2, epub, txt;</p>\n\t\t\t\t<p>поиск книг по базе данных flibusta;</p>\n\t\t\t\t<p>гибкие настройки интерфейса;</p>\n\t\t\t\t<h2 class="window__label">Ссылки</h2>\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a href="https://github.com/lonli-lokli-999/open-fb2-web">Github</a></li>\n\t\t\t\t\t<li><a href="https://money.yandex.ru/to/410017268643291">Поддержать разработку</a></li>\n\t\t\t\t</ul>\n\t\t\t</main>\n\t\t</div>\n\t</div>\n\t',methods:{setStatus(){this.$el.querySelector(".window").classList.toggle("window--active")}}};export const header={props:["reading_status","book_name"],data:function(){return{book_open:!1}},template:'\n\t\t<header class="main-header-wrap" >\n\t\t\t<div class="main-header conatiner">\n\t\t\t\t<div class="options">\n\t\t\t\t\t<div is="inp_file" @select="selectFile"></div>\n\t\t\t\t\t<div is="flibusta" @libopen="bookOpen"></div>\n\t\t\t\t\t<div is="my_books" @libopen="bookOpen"></div>\n\t\t\t\t\t<div v-if="book_open" is="bookmarks" :book_name="book_name"></div>\n\t\t\t\t\t<div is="settings"></div>\n\t\t\t\t\t<div is="color_settings"></div>\n\t\t\t\t\t<div is="info"></div>\n\t\t\t\t\t<div v-if="reading_status" is="reading_status_aplet" :reading_status="reading_status"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</header>\n\t',components:{inp_file:inp_file,color_settings:color_settings,settings:settings,reading_status_aplet:reading_status_aplet,flibusta:flibusta,my_books:my_books,bookmarks:bookmarks,info:info},methods:{selectFile(t){t&&this.$emit("select",t),this.book_open=!!t},bookOpen(t){this.$emit("flibopen",t),this.book_open=!0}}};