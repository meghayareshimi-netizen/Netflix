const API_KEY = "0f228824515575fd42f07f9a9305327d";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/original";

const requests = {
    fetchTrending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`,
    fetchNetflixOriginals: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`,
    fetchTopRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
    fetchActionMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`,
    fetchComedyMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`,
    fetchHorrorMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27`,
    fetchRomanceMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749`,
    fetchDocumentaries: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=99`,
};

function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

async function fetchBanner() {
    const response = await fetch(requests.fetchNetflixOriginals);
    const data = await response.json();
    const movie = data.results[Math.floor(Math.random() * data.results.length - 1)];

    const banner = document.getElementById("banner");
    const bannerTitle = document.getElementById("banner__title");
    const bannerDescription = document.getElementById("banner__description");

    banner.style.backgroundImage = `url(${IMAGE_URL}${movie.backdrop_path})`;
    bannerTitle.innerText = movie.name || movie.title || movie.original_name;
    bannerDescription.innerText = truncate(movie.overview, 150);
}

async function fetchRow(title, fetchUrl, isLargeRow = false) {
    const response = await fetch(fetchUrl);
    const data = await response.json();
    const movies = data.results;

    const rowsContainer = document.getElementById("rows");
    const row = document.createElement("div");
    row.classList.add("row");

    const rowTitle = document.createElement("h2");
    rowTitle.classList.add("row__title");
    rowTitle.innerText = title;
    row.appendChild(rowTitle);

    const postersContainer = document.createElement("div");
    postersContainer.classList.add("row__posters");

    movies.forEach(movie => {
        if (movie.backdrop_path || movie.poster_path) {
            const poster = document.createElement("img");
            poster.classList.add("row__poster");
            if (isLargeRow) poster.classList.add("row__posterLarge");
            
            poster.src = `${IMAGE_URL}${isLargeRow ? movie.poster_path : movie.backdrop_path}`;
            poster.alt = movie.name || movie.title;
            postersContainer.appendChild(poster);
        }
    });

    row.appendChild(postersContainer);
    rowsContainer.appendChild(row);
}

const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
        nav.classList.add("nav--black");
    } else {
        nav.classList.remove("nav--black");
    }
});

async function init() {
    await fetchBanner();
    await fetchRow("NETFLIX ORIGINALS", requests.fetchNetflixOriginals, true);
    await fetchRow("Trending Now", requests.fetchTrending);
    await fetchRow("Top Rated", requests.fetchTopRated);
    await fetchRow("Action Movies", requests.fetchActionMovies);
    await fetchRow("Comedy Movies", requests.fetchComedyMovies);
    await fetchRow("Horror Movies", requests.fetchHorrorMovies);
    await fetchRow("Romance Movies", requests.fetchRomanceMovies);
    await fetchRow("Documentaries", requests.fetchDocumentaries);
}

init();
