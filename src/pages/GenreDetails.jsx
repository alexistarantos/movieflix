import MovieCard from '../components/MovieCard'
import LoadingMovieCard from '../components/LoadingMovieCard'
import { useState, useEffect } from 'react'
import { getMoviesByGenre, getGenres } from '../services/api'
import { useParams } from 'react-router-dom'
import '../css/GenreDetails.scss'

function GenreDetails() {

    const { id } = useParams()
    const [movies, setMovies] = useState([])
    const [genre, setGenre] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadGenreMovies = async () => {
            try {
                const genreMovies = await getMoviesByGenre(id)
                setMovies(genreMovies)
                setError(null)
            } catch (error) {
                console.error('Error loading genre movies:', error)
                setError(error)
            } finally {
                setLoading(false)
            }
        }

        loadGenreMovies()

    }, [])

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

    }, [])

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

export default GenreDetails