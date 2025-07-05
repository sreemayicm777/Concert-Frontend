import React, { useState } from 'react';
import API from '../../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      alert('Login successful');
      navigate('/');
      window.location.reload();
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="login-input"
          />
          <button type="submit" className="login-submit">
            Login
          </button>
        </form>
        <div className="register-redirect">
          <span>Don't have an account?</span>
          <Link to="/register" className="register-link">Register here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;