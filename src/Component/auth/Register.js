import React, { useState } from 'react';
import API from '../../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import './register.css';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      alert('Registration successful');
      navigate('/login');
      window.location.reload();
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            className="register-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="register-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="register-input"
          />
          <button type="submit" className="register-submit">
            Register
          </button>
        </form>
        <div className="login-redirect">
          Already have an account?
          <Link to="/login" className="login-link">Login here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;