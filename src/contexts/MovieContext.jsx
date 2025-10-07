import { createContext, useState, useEffect, useContext } from 'react'

const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({ children }) => {

    const [favourites, setFavourites] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const storedFavourites = localStorage.getItem('favourites')

        if (storedFavourites) {
            setFavourites(JSON.parse(storedFavourites))
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('favourites', JSON.stringify(favourites))
        }
    }, [favourites, isLoaded])

    const addFavourite = (movie) => {
        setFavourites(prev => [...prev, movie])
    }

    const removeFavourite = (movieId) => {
        setFavourites(prev => prev.filter(movie => movie.id !== movieId))
    }

    const isFavourite = (movieId) => {
        return favourites.some(movie => movie.id === movieId)
    }

    const value = { favourites, addFavourite, removeFavourite, isFavourite }
    
    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}