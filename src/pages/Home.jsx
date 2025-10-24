import MovieCard from '../components/MovieCard'
import LoadingMovieCard from '../components/LoadingMovieCard'
import { useState, useEffect, useRef } from 'react'
import '../css/Home.scss'
import { getPopularMovies, getSortedMovies } from '../services/api'

function Home() {

    const [searchQuery, setSearchQuery] = useState('')
    const [previousSearchQuery, setPreviousSearchQuery] = useState('')
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sort, setSort] = useState('popular')
    const searchInputRef = useRef(null)
    const sortSelectRef = useRef(null)

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
        
        if (loading) return 
        
        // Prevent duplicate search if the query is the same as the previous one
        if (searchQuery.trim() === previousSearchQuery.trim()) {
            return
        }
        
        setLoading(true)
        setPreviousSearchQuery(searchQuery.trim())

        try {
            const currentSort = sortSelectRef.current?.value || 'popularity.desc'
            const searchedMovies = await getSortedMovies(currentSort, searchQuery)
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

    const handleSortChange = async (e) => {
        if (loading) return 

        setLoading(true)
        const currentQuery = searchInputRef.current?.value || ''

        try {
            const sortedMovies = await getSortedMovies(e.target.value, currentQuery)
            setMovies(sortedMovies)
            setError(null)

            if (sortedMovies.length === 0) {
                setError('No movies found')
            }
            
        } catch (error) {
            console.error('Failed to sort movies:', error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="home">

            <div className="filters-row">
                <select ref={sortSelectRef} name="sort" id="sort" onChange={handleSortChange} className="sort-select">
                    <option value="popularity.desc">Most Popular</option>
                    <option value="vote_average.desc">Top Rated</option>
                    <option value="release_date.desc">Newest First</option>
                    <option value="release_date.asc">Oldest First</option>
                    <option value="title.asc">Title A-Z</option>
                    <option value="title.desc">Title Z-A</option>
                </select>

                <form onSubmit={handleSearch} className="search-form">
                    <input type="text" ref={searchInputRef} placeholder="Search for movies..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                    <button type="submit" className="search-button">Search</button>
                </form>

            </div>

            {error && <div className="error-message">Error: {error}</div>}

            {loading ? (
                <div className="movies-grid">
                    {loadingSkeletons}
                </div>
            ) : (
                <div className="movies-grid">
                    {movies.filter((movie) => !!movie.poster_path)
                        .map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))
                    }
                </div>
            )}

            
        </div>
    )
}

export default Home