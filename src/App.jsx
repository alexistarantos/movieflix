import './css/App.scss'
import Home from './pages/Home'
import Favourites from './pages/Favourites'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import MovieDetails from './pages/MovieDetails'
import GenreDetails from './pages/GenreDetails'
import { MovieProvider } from './contexts/MovieContext'

function App() {

  return (
    <MovieProvider>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/genre/:id" element={<GenreDetails />} />
        </Routes>
      </main>
    </MovieProvider>
  )
}

export default App
