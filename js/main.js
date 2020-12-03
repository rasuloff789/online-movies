var elSearchForm = document.querySelector(".js-search-form")
var elSearchInput = elSearchForm.querySelector(".js-search-input");
var elSearchBtn = elSearchForm.querySelector(".js-search-btn");

var movieFullInfo = document.querySelector(".movie-full-info");

var elMoviesList = document.querySelector(".movies-list");
var elPaginationList = document.querySelector(".js-pagination-list");

var elMovieTemplate = document.querySelector("#movie-trailer-template").content;
var elPaginationTemplate = document.querySelector("#pagination-template").content;

var API_KEY = "ba96c289" ;
var SEARCH_QUERY ;
var pageMoviesNumber = 10 ;

var renderMovieTemplate = (movie)=>{
  var cloneMovieTemplate = elMovieTemplate.cloneNode(true);
  
  cloneMovieTemplate.querySelector(".movie-name").textContent = movie.Title;
  cloneMovieTemplate.querySelector(".js-movie-info-btn").dataset.id = movie.imdbID;
  
  return cloneMovieTemplate ;
};

var renderMoviesList = (movies)=>{
  elMoviesList.innerHTML = "";
  
  var moviesFragment = document.createDocumentFragment();
  
  movies.forEach((movie)=>{
    moviesFragment.append(renderMovieTemplate(movie));
  });
  
  elMoviesList.append(moviesFragment);
};

var renderPagination = (moviesNumber)=>{
  var pagesNumber = Math.ceil(moviesNumber / pageMoviesNumber);
  
  elPaginationList.innerHTML = "" ;
  
  if(pagesNumber < 2){
    return;
  };
  
  var paginationFragment = document.createDocumentFragment();
  for(var i = 1; i<= pagesNumber ;i++){
    var clonePaginationTemplate = elPaginationTemplate.cloneNode(true);
    
    clonePaginationTemplate.querySelector(".page-number").textContent = i;
    clonePaginationTemplate.querySelector(".page-number").dataset.id = i;
    clonePaginationTemplate.querySelector(".page-number").setAttribute("aria-label" , `Page ${i}`);
    
    
    paginationFragment.appendChild(clonePaginationTemplate);
  }
  elPaginationList.appendChild(paginationFragment);
  document.querySelectorAll(".pagination-link")[0].classList.add("is-current");
}

elSearchForm.addEventListener("submit",(evt)=>{
  evt.preventDefault();
  var elSearchInputValue = elSearchInput.value.trim();
  SEARCH_QUERY = elSearchInputValue;
  
  if (!elSearchInputValue){
    return;
  };
  elSearchBtn.classList.add("is-loading");
  
  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${SEARCH_QUERY}`)
  .then(function (response) {
    return response.json();
  }
  ).then((value) => {
    elSearchBtn.classList.remove("is-loading");
    renderMoviesList(value.Search);
    var totalSearchedMovies = Number(value.totalResults) ;
    renderPagination(totalSearchedMovies);
  });
});

elPaginationList.addEventListener("click" , (evt)=>{
  if(evt.target.matches(".pagination-link")){
    evt.preventDefault();
    
    elPaginationList.querySelectorAll(".pagination-link").forEach((link)=>{
      link.classList.remove("is-current");
    });
    var btnID = evt.target.dataset.id ;
    evt.target.classList.add("is-loading");
    evt.target.classList.add("is-info");
    
    
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${SEARCH_QUERY}&page=${btnID}`)
    .then(function (response) {
      return response.json();
    }
    ).then((value) => {
      evt.target.classList.remove("is-loading");
      evt.target.classList.remove("is-info");
      evt.target.classList.add("is-current");
      renderMoviesList(value.Search);
    });
  };
});

var renderMovieInfo = (object)=>{
  movieFullInfo.classList.remove("is-hidden");
  
  movieFullInfo.querySelector(".movie-img").src = object.Poster;
  movieFullInfo.querySelector(".movie-img").alt = object.Title;
  movieFullInfo.querySelector(".movie-title").textContent = object.Title ;
  movieFullInfo.querySelector(".movie-duration").textContent = object.Runtime;
  movieFullInfo.querySelector(".movie-rated").textContent = object.Rated;
  movieFullInfo.querySelector(".movie-genre").textContent = object.Genre;
  movieFullInfo.querySelector(".movie-year").textContent = object.Released;
  movieFullInfo.querySelector(".movie-language").textContent = object.Language;
  movieFullInfo.querySelector(".movie-country").textContent = object.Country;
  var boo = object.Ratings;
  var none = {};
  var checkRateName = function (name) {
    none = {};
    boo.forEach((i)=>{
      if (i.Source === name){
        none = i
      }
    });
  };
  checkRateName("Internet Movie Database");
  var imdbRating = none || { Value : "N/A" };
  movieFullInfo.querySelector(".imdb-rating").textContent = imdbRating.Value;
  
  checkRateName("Rotten Tomatoes");
  var RTRating = none || { Value : "N/A" };
  movieFullInfo.querySelector(".rt-rating").textContent = RTRating.Value;
  
  checkRateName("Metacritic");
  var MRating = none || { Value : "N/A" };
  movieFullInfo.querySelector(".m-rating").textContent = MRating.Value;
  movieFullInfo.querySelector(".movie-description").textContent = object.Plot;
  movieFullInfo.querySelector(".movie-director").textContent = object.Director
  movieFullInfo.querySelector(".movie-writer").textContent = object.Writer;
  movieFullInfo.querySelector(".movie-actors").textContent = object.Actors;
}

elMoviesList.addEventListener("click" , (evt)=>{
  if(evt.target.matches(".js-movie-info-btn")){
    var movieImDBID = evt.target.dataset.id ;
    evt.target.classList.add("is-loading");
    movieFullInfo.querySelector(".movie-img").src = "https://picsum.photos/id/570/250/350?beacon";
    
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movieImDBID}`)
    .then(function (response) {
      return response.json();
    }
    ).then((value) => {
      evt.target.classList.remove("is-loading");
      renderMovieInfo(value);
    });
  };
});

var BtnToTop = document.querySelector(".js-button-to-top");
BtnToTop.addEventListener("click" , ()=>{
  window.scrollTo(0,0);
});