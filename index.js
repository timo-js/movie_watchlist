const API_KEY = "71cfaf23";
const BASE_URL = "https://www.omdbapi.com/";

const searchBar = document.getElementById("search-bar");
const searchInput = document.getElementById("search-input");
const modalForm = document.getElementById("modal-form");

let moviesArray = [];

searchBar.addEventListener("submit", (e) => {
  e.preventDefault();

  fetch(`${BASE_URL}?apikey=${API_KEY}&s=${searchInput.value}`)
    .then((res) => res.json())
    .then((res) => {
      moviesArray = [];
      res.Search
        ? res.Search.forEach((movie) => {
            fetch(`${BASE_URL}?apikey=${API_KEY}&i=${movie.imdbID}`)
              .then((res) => res.json())
              .then((res) => {
                moviesArray.push(res);
                render(moviesArray);
              });
          })
        : render(null);
    });

  searchInput.placeholder = searchInput.value;
  searchInput.value = "";
});

modalForm.addEventListener("submit", submitWatchlist);

document.addEventListener("click", (e) => {
  if (e.target.dataset.add) {
    watchlistAdd(e.target.dataset.add);
  }
});

function render(movies) {
  document.getElementById("main").innerHTML = getMoviesHtml(movies);
}

function renderWatchlist() {
  const watchlist = JSON.parse(localStorage.getItem("watchlist"));
  const modalBody = document.getElementById("watchlist-modal-body");

  let htmlString = ``;

  watchlist && watchlist.length > 0
    ? watchlist.forEach((movie) => {
        htmlString += `
        <div class="form-check">
        <input class="form-check-input" type="checkbox" value="${movie}" id="${movie}">
        <label class="form-check-label" for="flexCheckDefault">
        ${movie}
        </label>
      </div>
        `;
      })
    : (htmlString = `<div class="placeholder">No items stored in Watchlist.</div>`);

  modalBody.innerHTML = htmlString;
}

function submitWatchlist(e) {
  e.preventDefault();
  const watchlist = JSON.parse(localStorage.getItem("watchlist"));

  const data = [
    ...document.querySelectorAll("input[type=checkbox]:checked"),
  ].map((e) => e.value);

  const newWatchlist = watchlist.filter((item) => !data.includes(item));
  localStorage.setItem("watchlist", JSON.stringify(newWatchlist));

  renderWatchlist();
  render(moviesArray);
}

function getMoviesHtml(movies) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist"));
  let moviesHtml = ``;

  if (movies) {
    movies.forEach((movie) => {
      moviesHtml += `
      <section class="movie-section">
      <div class="image">
      <div class="mobile-add" data-add="${movie.Title}">
        ${
          watchlist && watchlist.includes(movie.Title)
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          </svg> Watchlist`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
          </svg> Watchlist`
        }
      </div>
        <img
          class="movie-poster"
          alt="${movie.Title}"
          src="${movie.Poster}"
        />
      </div>
      <div class="heading">
        <div class="movie-header">${movie.Title}</div>
        <div class="movie-rating">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="currentColor"
            class="bi bi-star-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
            />
          </svg>
          ${movie.imdbRating}
        </div>
      </div>
      <div class="information">
        <div class="movie-length">${movie.Runtime}</div>
        <div class="movie-genre">${movie.Genre}</div>
        <div class="movie-button" data-add="${movie.Title}">
        ${
          watchlist && watchlist.includes(movie.Title)
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg>`
            : `<svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-plus-circle-fill"
                viewBox="0 0 16 16"
              >`
        }
          
            <path
              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"
            />
          </svg>
          Watchlist
        </div>
      </div>
      <div class="plot">
      ${movie.Plot}
      </div>
    </section>
      `;
    });
  } else {
    moviesHtml = `<h3 class="placeholder">Nothing found, try searching again ...</h3>`;
  }

  return moviesHtml;
}

function watchlistAdd(id) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist"));
  watchlist
    ? !watchlist.includes(id) && watchlist.push(id)
    : (watchlist = [id]);

  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  render(moviesArray);
  renderWatchlist();
}

renderWatchlist();
