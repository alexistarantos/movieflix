import '../css/MovieCard.scss'

function LoadingMovieCard() {

  return (
    <div className="movie-card">
        <div className="movie-poster loading"></div>
        <div className="movie-info">
            <h3 className="movie-title loading">Testing...</h3>
            <p className="movie-date loading">Testing...</p>
        </div>
    </div>
  )
}

export default LoadingMovieCard