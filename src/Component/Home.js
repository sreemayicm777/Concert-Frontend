import React, { useEffect, useState } from 'react';
import API from '../api/axiosInstance';

function Home() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(null);

  // Get user info from token
  useEffect(() => {
    API.get('/auth/me')
      .then(res => {
        setUser(res.data.user);
        console.log(res.data.user);
        
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const fetchCategories = () => {
    API.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error loading categories:', err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/categories/${editId}`, formData);
        alert('Category updated');
      } else {
        await API.post('/categories', formData);
        alert('Category created');
      }
      setFormData({ name: '', description: '' });
      setIsEditing(false);
      setEditId(null);
      fetchCategories();
    } catch (err) {
      alert('Action failed. You may need admin access.');
    }
  };

  const handleEdit = (cat) => {
    setIsEditing(true);
    setEditId(cat._id);
    setFormData({ name: cat.name, description: cat.description });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await API.delete(`/categories/${id}`);
        alert('Deleted successfully');
        fetchCategories();
      } catch (err) {
        alert('Delete failed. You may need admin access.');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🎶 Concert Categories</h1>

      
      <ul>
        {categories.map(cat => (
          <li key={cat._id}>
            <strong>{cat.name}</strong>: {cat.description}
            {user?.role === 'admin' && (
              <>
                <button onClick={() => handleEdit(cat)} style={{ marginLeft: '10px' }}>Edit</button>
                <button onClick={() => handleDelete(cat._id)} style={{ marginLeft: '5px' }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {user?.role === 'admin' && (
        <>
          <h2>{isEditing ? 'Update Category' : 'Create Category'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            /><br />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            /><br />
            <button type="submit">{isEditing ? 'Update' : 'Create'}</button>
            {isEditing && (
              <button type="button" onClick={() => {
                setIsEditing(false);
                setFormData({ name: '', description: '' });
              }}>Cancel</button>
            )}
          </form>
        </>
      )}
    </div>
  );
}

export default Home;
