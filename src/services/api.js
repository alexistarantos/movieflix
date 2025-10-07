// import 'dotenv/config.js'; 

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export const getPopularMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
    const data = await response.json()
    return data.results
}

export const searchMovies = async (query) => {
    let response;
    if (!query.trim()) {
        response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    } else {
        response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    }
    const data = await response.json()
    return data.results
}

export const getMovieDetails = async (movieId) => {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`)
    const data = await response.json()
    return data
}