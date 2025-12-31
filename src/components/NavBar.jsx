import { Link } from 'react-router-dom'
import '../css/NavBar.scss'
import logo from '../assets/movieflix-white.svg'

function NavBar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <div className="navbar-logo-link" onClick={() => window.location.href = '/'}>
                        <img src={logo} alt="MovieFlix Logo" width={28} height={28} />
                        MOVIEFLIX
                    </div>
                </div>
                <div className="navbar-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/favourites" className="nav-link">Favourites</Link>
                </div>
                <div className="navbar-mobile-icons">
                    <Link to="/" className="mobile-icon-btn" aria-label="Home">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </Link>
                    <Link to="/favourites" className="mobile-icon-btn" aria-label="Favourites">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </Link>
                </div>
                <div className="burger-btn">
                    <div className="burger-btn-line"></div>
                    <div className="burger-btn-line"></div>
                    <div className="burger-btn-line"></div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar