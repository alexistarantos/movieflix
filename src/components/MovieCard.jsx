import '../css/MovieCard.scss'
import { Link } from 'react-router-dom'
import { useMovieContext } from '../contexts/MovieContext'

function MovieCard({movie}) {

  const { addFavourite, removeFavourite, isFavourite } = useMovieContext()
  const favourite = isFavourite(movie.id)

  function onFavouriteClick(e) {
    e.preventDefault()

    if (favourite) removeFavourite(movie.id)
    else addFavourite(movie)
  }

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
        <div className="movie-poster">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        </div>
        <button className={`favourite-btn${favourite ? ' active' : ''}`} onClick={onFavouriteClick}>
          {`${favourite ? '❤︎' : '♡'}`}
        </button>
        <div className="movie-overlay">
        </div>
        <div className="movie-info">
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-date">{movie.release_date?.split('-')[0]}</p>
        </div>
    </Link>
  )
}

export default MovieCard