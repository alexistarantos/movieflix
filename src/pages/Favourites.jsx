import '../css/Favourites.scss'
import { useMovieContext } from '../contexts/MovieContext'
import MovieCard from '../components/MovieCard'
import { useState } from 'react'
import Pagination from '../components/Pagination'

function Favourites() {

  const { favourites } = useMovieContext()
  const [currentPage, setCurrentPage] = useState(1)
  const moviesPerPage = 20
  
  const totalPages = Math.ceil(favourites.length / moviesPerPage)
  const startIndex = (currentPage - 1) * moviesPerPage
  const endIndex = startIndex + moviesPerPage
  const currentMovies = favourites.slice(startIndex, endIndex)
  
  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  if (favourites.length > 0) {
    return (
      <div className="favourites">
        <h2>Favourites</h2>
        <div className="movies-grid">
            {currentMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
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