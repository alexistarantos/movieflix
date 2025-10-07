import MovieCard from '../components/MovieCard'
import LoadingMovieCard from '../components/LoadingMovieCard'
import { useState, useEffect } from 'react'
import '../css/Home.scss'
import { getPopularMovies, searchMovies } from '../services/api'

function Home() {

    const [searchQuery, setSearchQuery] = useState('')
    const [previousSearchQuery, setPreviousSearchQuery] = useState('')
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadingSkeletons = Array.from({ length: 8 }, (_, index) => (
        <LoadingMovieCard key={index} />
    ))

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
                setError(null)
            } catch (error) {
                console.error('Error loading popular movies:', error)
                setError(error)
            } finally {
                setLoading(false)
            }
        }

        loadPopularMovies()

    }, [])

    const handleSearch = async (e) => {
        e.preventDefault()
        
        // if (!searchQuery.trim()) return 
        if (loading) return 
        
        // Prevent duplicate search if the query is the same as the previous one
        if (searchQuery.trim() === previousSearchQuery.trim()) {
            return
        }
        
        setLoading(true)
        setPreviousSearchQuery(searchQuery.trim())

        try {
            const searchedMovies = await searchMovies(searchQuery)
            setMovies(searchedMovies)
            setError(null)

            if (searchedMovies.length === 0) {
                setError('No movies found')
            }
            
        } catch (error) {
            console.error('Failed to search movies:', error)
            setError(error)
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input type="text" placeholder="Search for movies..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                <button type="submit" className="search-button">Search</button>
            </form>

            {error && <div className="error-message">Error: {error}</div>}

            {loading ? (
                <div className="movies-grid">
                    {loadingSkeletons}
                </div>
            ) : (
                <div className="movies-grid">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
            
        </div>
    )
}

export default Home