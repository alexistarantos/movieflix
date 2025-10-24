import '../css/MovieCard.scss'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCategoriesWithPosters } from '../services/api'
import LoadingGenreCard from './LoadingGenreCard'

function GenresCarousel() {

    const [categories, setCategories] = useState([])

    useEffect(() => {

        const loadCategories = async () => {
            try {
                const categories = await getCategoriesWithPosters()
                console.log(categories)
                setCategories(categories.genres)
            } catch (error) {
                console.error('Error loading categories:', error)
            }
        }
        loadCategories()

    }, [])

    return (
        <div className="categories-section">
            <div className="categories-grid">
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <Link to={`/genre/${category.id}`} key={category.id} className="category-card">
                            {category.poster_path ? (
                                <img src={`https://image.tmdb.org/t/p/w500${category.poster_path}`} alt={`${category.name} genre`} className="category-poster" />
                            ) : (
                                <div className="category-placeholder">
                                    <span>{category.name.charAt(0)}</span>
                                </div>
                            )}
                            <h3 className="category-name">{category.name}</h3>
                        </Link>
                    ))
                ) : (
                    Array.from({ length: 8 }, (_, index) => (
                        <LoadingGenreCard key={index} />
                    ))
                )}
            </div>
        </div>
    )
}

export default GenresCarousel