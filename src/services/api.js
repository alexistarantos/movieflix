// import 'dotenv/config.js'; 

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export const getPopularMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
    const data = await response.json()
    return data.results
}

export const searchMovies = async (query, sort = 'popularity.desc') => {
    let response;
    if (!query.trim()) {
        response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sort}`);
    } else {
        response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    }
    const data = await response.json()
    return data.results
}

export const getSortedMovies = async (sort = 'popularity.desc', query = '') => {
    let response;
    
    if (query.trim()) {
        response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await response.json()
        
        const sortedResults = sortMovieResults(data.results, sort)
        return sortedResults
    } else {
        response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sort}`);
        const data = await response.json()
        return data.results
    }
}

// Helper function to sort movie results client-side
const sortMovieResults = (movies, sort) => {
    const sortedMovies = [...movies];
    
    switch (sort) {
        case 'popularity.desc':
            return sortedMovies.sort((a, b) => b.popularity - a.popularity);
        case 'vote_average.desc':
            return sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
        case 'release_date.desc':
            return sortedMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        case 'release_date.asc':
            return sortedMovies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        case 'title.asc':
            return sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
        case 'title.desc':
            return sortedMovies.sort((a, b) => b.title.localeCompare(a.title));
        default:
            return sortedMovies;
    }
}

export const getMovieDetails = async (movieId) => {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`)
    const data = await response.json()
    return data
}