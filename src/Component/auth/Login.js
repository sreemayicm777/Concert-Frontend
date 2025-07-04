import React, { useState } from 'react';
import API from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar'; // adjust the path based on where your Navbar component is located

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
    <div>
      <Navbar user={null} /> {/* You can pass `null` since the user isn't logged in yet */}
      <div className="max-w-sm mx-auto mt-10 p-4 border rounded shadow">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
