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


export const getCategories = async () => {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`)
    const data = await response.json()
    return data
}

export const getMoviesByGenre = async (genreId, page = 1) => {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`)
    const data = await response.json()
    return data.results
}

// Helper function to get categories with posters - AI GENERATED
export const getCategoriesWithPosters = async () => {
    try {
        // Get all genres
        const genresResponse = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`)
        const genresData = await genresResponse.json()
        
        // Track used movie IDs to avoid duplicates
        const usedMovieIds = new Set()
        const categoriesWithPosters = []
        
        // Process genres sequentially to avoid duplicate posters
        for (const genre of genresData.genres) {
            try {
                // Try multiple pages to find a unique movie
                let movieWithPoster = null
                let page = 1
                const maxPages = 3 // Limit to avoid too many API calls
                
                while (!movieWithPoster && page <= maxPages) {
                    const moviesResponse = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}&sort_by=popularity.desc&page=${page}`)
                    const moviesData = await moviesResponse.json()
                    
                    // Find first movie with poster that hasn't been used
                    movieWithPoster = moviesData.results.find(movie => 
                        movie.poster_path && !usedMovieIds.has(movie.id)
                    )
                    
                    if (movieWithPoster) {
                        usedMovieIds.add(movieWithPoster.id)
                    }
                    
                    page++
                }
                
                categoriesWithPosters.push({
                    ...genre,
                    poster_path: movieWithPoster?.poster_path || null,
                    backdrop_path: movieWithPoster?.backdrop_path || null
                })
                
            } catch (error) {
                console.error(`Error fetching poster for genre ${genre.name}:`, error)
                categoriesWithPosters.push({
                    ...genre,
                    poster_path: null,
                    backdrop_path: null
                })
            }
        }
        
        return { genres: categoriesWithPosters }
    } catch (error) {
        console.error('Error fetching categories with posters:', error)
        throw error
    }
}