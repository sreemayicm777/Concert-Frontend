import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import API from './api/axiosInstance';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    API.get('/auth/me')
      .then(res => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="brand">
          <span>🎵 Concert</span>Hub
        </Link>

        <div className="nav-links">
          {!user ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          ) : (
            <>
              <span className="user-greeting">
                Welcome, {user.username} <span className="user-role">({user.role})</span>
              </span>
              <button onClick={logout} className="logout-btn">Logout</button>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;