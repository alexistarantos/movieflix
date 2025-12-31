import MovieCard from '../components/MovieCard'
import LoadingMovieCard from '../components/LoadingMovieCard'
import { useState, useEffect, useRef } from 'react'
import '../css/Home.scss'
import { getPopularMovies, getSortedMovies } from '../services/api'
import GenresCarousel from '../components/GenresCarousel'
import Pagination from '../components/Pagination'

function Home() {

    const [searchQuery, setSearchQuery] = useState('')
    const [previousSearchQuery, setPreviousSearchQuery] = useState('')
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sort, setSort] = useState('popularity.desc')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [hasActiveFilters, setHasActiveFilters] = useState(false)
    const searchInputRef = useRef(null)
    const sortSelectRef = useRef(null)

    const loadingSkeletons = Array.from({ length: 8 }, (_, index) => (
        <LoadingMovieCard key={index} />
    ))

    // Load movies when page changes or on initial load
    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true)
            try {
                const currentQuery = searchInputRef.current?.value || ''
                const currentSort = sortSelectRef.current?.value || 'popularity.desc'
                
                let data
                if (hasActiveFilters) {
                    // Use filtered/sorted movies
                    data = await getSortedMovies(currentSort, currentQuery, currentPage)
                } else {
                    // Use popular movies
                    data = await getPopularMovies(currentPage)
                }
                
                // Filter out movies without posters immediately
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
                        let testData
                        if (hasActiveFilters) {
                            testData = await getSortedMovies(currentSort, currentQuery, testPage)
                        } else {
                            testData = await getPopularMovies(testPage)
                        }
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
                console.error('Error loading movies:', error)
                setError(error)
            } finally {
                setLoading(false)
            }
        }

        loadMovies()
    }, [currentPage, hasActiveFilters])

    const handleSearch = async (e) => {
        e.preventDefault()
        
        if (loading) return 
        
        // Prevent duplicate search if the query is the same as the previous one
        if (searchQuery.trim() === previousSearchQuery.trim()) {
            return
        }
        
        setPreviousSearchQuery(searchQuery.trim())
        setCurrentPage(1) // Reset to first page on new search
        setHasActiveFilters(true) // Mark that we have active filters
    }

    const handleSortChange = async (e) => {
        if (loading) return 

        setCurrentPage(1) // Reset to first page on sort change
        const newSort = e.target.value
        setSort(newSort)
        
        // Check if we have active filters (search query or non-default sort)
        const currentQuery = searchInputRef.current?.value || ''
        const hasFilters = currentQuery.trim() !== '' || newSort !== 'popularity.desc'
        setHasActiveFilters(hasFilters)
    }

    // Update hasActiveFilters when previousSearchQuery changes (after search is submitted)
    // This handles the case when search is cleared and submitted
    useEffect(() => {
        const currentQuery = previousSearchQuery || ''
        const currentSort = sortSelectRef.current?.value || 'popularity.desc'
        const hasFilters = currentQuery.trim() !== '' || currentSort !== 'popularity.desc'
        setHasActiveFilters(hasFilters)
    }, [previousSearchQuery, sort])

    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="home">

            <GenresCarousel/>

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
                <>
                    <div className="movies-grid">
                        {movies && movies.length > 0 ? (
                            movies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))
                        ) : (
                            <div className="no-movies-found">No movies found</div>
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

export default Home