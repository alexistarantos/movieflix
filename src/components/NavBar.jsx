import { Link } from 'react-router-dom'
import '../css/NavBar.scss'
import logo from '../assets/movieflix-white.svg'

function NavBar() {
    
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/" className="navbar-logo-link" onClick={() => window.location.href = '/'}>
                        <img src={logo} alt="MovieFlix Logo" width={28} height={28} />
                        MOVIEFLIX
                    </Link>
                </div>
                <div className="navbar-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/favourites" className="nav-link">Favourites</Link>
                </div>
            </div>
        </nav>
    )
}

export default NavBar