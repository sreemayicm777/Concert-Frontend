import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import API from './api/axiosInstance';

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
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Home</Link>

        {!user ? (
          <>
            <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span style={{ marginRight: '10px' }}>
              Welcome, {user.username} ({user.role})
            </span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>

      <Outlet />
    </div>
  );
}

export default App;
