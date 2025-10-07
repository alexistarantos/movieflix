import '../css/Favourites.scss'
import { useMovieContext } from '../contexts/MovieContext'
import MovieCard from '../components/MovieCard'

function Favourites() {

  const { favourites } = useMovieContext()
  
  if (favourites.length > 0) {
    return (
      <div className="favourites">
        <h2>Favourites</h2>
        <div className="movies-grid">
            {favourites.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className="favourites-empty">
      <h2>No favourites movies yet.</h2>
      <p>Start adding movies to your favourites list.</p>
    </div>
  )
}

export default Favourites