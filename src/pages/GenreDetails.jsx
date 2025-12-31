import MovieCard from '../components/MovieCard'
import LoadingMovieCard from '../components/LoadingMovieCard'
import { useState, useEffect } from 'react'
import { getMoviesByGenre, getGenres } from '../services/api'
import { useParams } from 'react-router-dom'
import '../css/GenreDetails.scss'
import Pagination from '../components/Pagination'

function GenreDetails() {

    const { id } = useParams()
    const [movies, setMovies] = useState([])
    const [genre, setGenre] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        const loadGenreMovies = async () => {
            setLoading(true)
            try {
                const data = await getMoviesByGenre(id, currentPage)
                
                // Filter out movies without posters
                const moviesWithPosters = (data.results || []).filter((movie) => !!movie.poster_path)
                
                // Cap totalPages at 500 (TMDB API maximum)
                let cappedTotalPages = Math.min(data.totalPages || 1, 500)
                
                // Handle empty results on last page - adjust totalPages if needed
                if (moviesWithPosters.length === 0 && currentPage === cappedTotalPages && cappedTotalPages > 1) {
                    // If we're on the last page and got no results, search backwards to find actual last page
                    // Limit search to 50 pages back to avoid too many API calls
                    const searchLimit = Math.max(1, cappedTotalPages - 50)
                    let lastValidPage = 0
                    
                    for (let testPage = cappedTotalPages - 1; testPage >= searchLimit; testPage--) {
                        const testData = await getMoviesByGenre(id, testPage)
                        const testMoviesWithPosters = (testData.results || []).filter((movie) => !!movie.poster_path)
                        
                        if (testMoviesWithPosters.length > 0) {
                            lastValidPage = testPage
                            break
                        }
                    }
                    
                    // If we found a valid last page and we're beyond it, redirect to that page
                    if (lastValidPage > 0 && currentPage > lastValidPage) {
                        setCurrentPage(lastValidPage)
                        return // Exit early, this will trigger a new load with the correct page
                    } else if (lastValidPage > 0) {
                        cappedTotalPages = lastValidPage
                    }
                }
                
                setMovies(moviesWithPosters)
                setTotalPages(cappedTotalPages)
                setError(null)
            } catch (error) {
                console.error('Error loading genre movies:', error)
                setError(error)
            } finally {
                setLoading(false)
            }
        }

        loadGenreMovies()

    }, [id, currentPage])

    useEffect(() => {
        const loadGenre = async () => {
            try {
                const genres = await getGenres()

                const getGenre = genres.genres.find((genre) => genre.id === parseInt(id))
                setGenre(getGenre)
                console.log(getGenre)

            } catch (error) {
                console.error('Error loading genre:', error)
                setError(error)
            }
        }

        loadGenre()

    }, [id])

    // Reset to page 1 when genre changes
    useEffect(() => {
        setCurrentPage(1)
    }, [id])

    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="genre-details">

            {genre && <h2 className="genre-name">{genre.name}</h2>}

            {error && <div className="error-message">Error: {error}</div>}
        
            {loading ? (
                <div className="movies-grid">
                    {Array.from({ length: 8 }, (_, index) => (
                        <LoadingMovieCard key={index} />
                    ))}
                </div>
            ) : (
                <>
                    <div className="movies-grid">
                        {movies && movies.length > 0 ? (
                            movies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))
                        ) : (
                            <div>No movies found</div>
                        )}
                    </div>
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}

            
        </div>
    )
}

export default GenreDetails