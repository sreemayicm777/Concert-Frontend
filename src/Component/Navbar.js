import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'; // Import the CSS file

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        🎵 ConcertHub
      </Link>

      <div className="navbar__links">
        <Link to="/" className="navbar__link">Home</Link>
        <Link to="/browse" className="navbar__link">Browse</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="navbar__link">Admin</Link>
        )}
      </div>

      <div>
        {user ? (
          <div className="navbar__user-info">
            <span className="navbar__welcome">Welcome, {user.name} ({user.role})</span>
            <button
              onClick={onLogout}
              className="navbar__button navbar__button--logout"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="navbar__button navbar__button--login"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;