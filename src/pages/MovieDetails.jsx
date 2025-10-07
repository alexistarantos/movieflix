import '../css/MovieDetails.scss'
import { useState, useEffect } from 'react'
import { getMovieDetails } from '../services/api'
import { useParams } from 'react-router-dom'

function MovieDetails() {

    const { id } = useParams()
    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadMovieDetails = async () => {
            try {
                const movieDetails = await getMovieDetails(id)
                setMovie(movieDetails)
                setError(null)
            } catch (error) {
                console.error('Error loading movie details:', error)
                setError(error)
            } finally {
                setLoading(false)
            }
        }

        loadMovieDetails()

    }, [id])


    return (
        <>
            {loading ? (
                <div className="movie-details-loading">
                    <h2>Loading...</h2>
                </div>
            ) : (
                <div className="movie-details">
                    <h2>{movie?.title}</h2>
                    <p>{movie?.overview}</p>
                    <p>{movie?.release_date?.split('-')[0]}</p>
                    <p>{movie?.runtime}</p>
                    <p>{movie?.vote_average}</p>
                    <p>{movie?.vote_count}</p>
                    <p>{movie?.genres.map((genre) => genre.name).join(', ')}</p>
                    <p>{movie?.production_companies.map((company) => company.name).join(', ')}</p>
                </div>
            )}
        </>
    )
}

export default MovieDetails