const hamburger = document.querySelector('.hamburger'),
	leftMenu = document.querySelector('.left-menu'),
	tvShowsList = document.querySelector('.tv-shows__list'),
	modal = document.querySelector('.modal'),
	tvShows = document.querySelector('.tv-shows'),
	tvCardImg = document.querySelector('.tv-card__img'),
	modalTitle = document.querySelector('.modal__title'),
	genres = document.querySelector('.genres-list'),
	rating = document.querySelector('.rating'),
	description = document.querySelector('.description'),
	modalLink = document.querySelector('.modal__link'),
	preloader = document.querySelector('.preloader'),
	searchForm = document.querySelector('.search__form'),
   searchFormInput = document.querySelector('.search__form-input'),
   dropdown =document.querySelectorAll('.dropdown'),
   tvShowsHead = document.querySelector('.tv-shows__head'),
   posterWrapper = document.querySelector('.poster__wrapper'),
   modalContent = document.querySelector('.modal__content'),
   topRated = document.querySelector('.top-rated'),
   pagination = document.querySelector('.pagination'),
   

	IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
	

const loading = document.createElement('div');
loading.classList.add('loading');

const closeDropdown = () => {
   dropdown.forEach(item => {
      item.classList.remove('active');
   });
};

class DBConnect {
	constructor() {
		this.API_KEY = '494bf4c3fc059cead3c5f8fa7ae8caf8';
		this.SERVER = 'https://api.themoviedb.org/3';
	}

	getData = async (url) => {
		const res = await fetch(url);
		if (res.ok) {
			return res.json();
		} else {
			throw new Error(`Не удалось получить данные по адресу ${url}`)
		}
	}

	getTestData =  () => {
		return this.getData('test.json')
	}

	getTestCard = () => {
		return this.getData('card.json')
	}

	getSearchResult = query => {
      this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&query=${query}&language=ru-RU`;
		return this.getData(this.temp);
   }
   
   getPage = page => {
      return this.getData(this.temp + '&page=' + page);
   }

	getTvShow = id => {
		return this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
   }
   
   getTopRated = () => {
      return this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`);
   }

   getPopular = () => {
      return this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`);
   }

   getToday = () => {
      return this.getData(`${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`);
   }
   getWeek = () => {
      return this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`);
   }
}

const dbConnect = new DBConnect();



// формирование списока по запросу

const renderCard = (response, target) => {
   // debugger;                                             // вставляем дебаггер, работать с ним в среде разраба (F12)
   tvShowsList.textContent = '';
   if (!response.total_results) {
      loading.remove();
      tvShowsHead.textContent = 'Ничего не найдено';
      return;
   }
   tvShowsHead.textContent = target ? target.textContent : 'Результат поиска';      // выводим вверху карточек название раздела, куда кликнули (Топ-популяроное-сегодня-за неделю), либо рез поиска

   response.results.forEach(item => {
		const { 
			backdrop_path: backdrop, 
			name: title, 
			poster_path: poster, 
			vote_average: vote ,
			id
			} = item;
		let posterImg = poster ? IMG_URL + poster : 'img/no-poster.jpg';
		let backdropImg = backdrop ? IMG_URL + backdrop : '';
		if (backdrop && !poster) {
			posterImg = backdropImg;
		}
		const tvCardVote = document.querySelector('.tv-card__vote');
		const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

		const card = document.createElement('li');
		card.idTvShow = id;
		card.classList.add('tv-shows__item');
		card.innerHTML = `
			<a href="#" id="${id}" class="tv-card">
					${voteElem}
                    <img class="tv-card__img"
                         src="${posterImg}"
                         data-backdrop="${backdropImg}"
                         alt="${title}">
                    <h4 class="tv-card__head">${title}</h4>
            </a>
      `;
      
		loading.remove();	
		tvShowsList.append(card);
   });
// выводим пагинацию
   pagination.textContent = '';
   if (response.total_pages > 1) {
      for (let i = 1; i <= response.total_pages; i++) {
         pagination.innerHTML += `<li class="pagination__item"><a href="#" class="pagination__link">${i}</a></li>`;
      }
   }
};



// отправка запроса через форму поиска

searchForm.addEventListener('submit', event => {
	event.preventDefault();
	const value = searchFormInput.value.trim();			// trim удаляет пробелы в о краям строки запроса
	if (value) {
      tvShows.append(loading);
		dbConnect.getSearchResult(value).then(renderCard);
	}
	searchFormInput.value = '';
});




// открыть меню-гамбургер

hamburger.addEventListener('click', () => {
	leftMenu.classList.toggle('openMenu');
   hamburger.classList.toggle('open');
   closeDropdown();
});


// закрыть меню-гамбургер при клике вне меню

document.body.addEventListener('click', event => {
	if (!event.target.closest('.left-menu')) {
		leftMenu.classList.remove('openMenu');
      hamburger.classList.remove('open');
      closeDropdown();
	}
});


// открыть выпадающий список

leftMenu.addEventListener('click', event => {
	event.preventDefault();
	const target = event.target;
	const dropdown = target.closest('.dropdown');
	if (dropdown) {
		dropdown.classList.toggle('active');
		leftMenu.classList.add('openMenu');
		hamburger.classList.add('open');
   };
   
// подклоючение контента в выпадающие списки меню
   if (target.closest('#top-rated')) {
      tvShows.append(loading);
      dbConnect.getTopRated().then((response) => renderCard(response, target));
   }
   if (target.closest('#popular')) {
      tvShows.append(loading);
      dbConnect.getPopular().then((response) => renderCard(response, target));
   }
   if (target.closest('#today')) {
      tvShows.append(loading);
      dbConnect.getToday().then((response) => renderCard(response, target));
   }
   if (target.closest('#week')) {
      tvShows.append(loading);
      dbConnect.getWeek().then((response) => renderCard(response, target));
   }
   if (target.closest('#search')) {
      searchFormInput.focus();
   }
});

 

// открыть модальное окно при клике на карточку

tvShowsList.addEventListener('click', event => {
	event.preventDefault();					// отключает прокрутку наверх страницы после закрытия модального окна
	const card = event.target.closest('.tv-card');

	if (card) {
		preloader.style.display = 'block';

		dbConnect.getTvShow(card.id)
		.then(response => {
			//console.log(response);

         tvCardImg.src = IMG_URL + response.poster_path;
         if (response.poster_path) {
            tvCardImgalt = response.name;
            modalTitle.textContent = response.name;
            posterWrapper.style.display = '';
         } else {
            posterWrapper.style.display = 'none';
            modalContent.style.paddingLeft = '50px';
         }
			
	// вставить жанры
			genres.textContent = '';
			response.genres.forEach(item => {
				genres.innerHTML += `<li>${item.name}</li>`;
			});
	// вставить с помощью for-of:
		// 	for (let item of response.genres) {
		// 		genres.innerHTML += `<li>${item.name}</li>`;		
		// 	}

	// либо с помощью reduce() 
		// genres.innerHTML = response.genres.reduce((acc, item) => `${acc}<li>${item.name}</li>`, '');
			rating.textContent = response.vote_average;
			description.textContent = response.overview;
			modalLink.href = response.homepage;
		})
		.then(() => {
			modal.classList.remove('hide');
			document.body.style.overflow = 'hidden'; 
      })
      .finally(() => {
         preloader.style.display = '';
      })
	}
});



// закрыть модальное окно при клике на крест или вне окна

modal.addEventListener('click', event => {
	if (event.target.closest('.cross') || 
		event.target.classList.contains('modal')) {
		modal.classList.add('hide');
		document.body.style.overflow = '';
	}
});


// сменить обложку карточки при наведении мыши

const changeImage = event => {
	const card = event.target.closest('.tv-shows__item');
	if (card) {
		const img = card.querySelector('.tv-card__img');
		if (img.dataset.backdrop) {
			[img.src, img.dataset.backdrop] = 
			[img.dataset.backdrop, img.src];
		}
	}
};

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);



// клик по ссылке на страницу
pagination.addEventListener('click', event => {
   event.preventDefault();
   target= event.target;

   if (target.classList.contains('pagination__link')) {
      tvShows.append(loading);
      dbConnect.getPage(target.textContent).then(renderCard);
      window.scrollTo(0, 0);
   }
})









/* КЛАСС пример

const Car = class {

	constructor(model, type){
		this.model = model;
		this.type = type;
	}

	drive() {
		console.log(`${this.model} is driving`);
	}

	brake() {
		console.log(`${this.model} slows down`);
	}
}

const almera = new Car('Almera', 'sedan');
*/

