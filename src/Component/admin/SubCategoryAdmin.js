import React, { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';

function SubCategoryAdmin() {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    artist: '',
    date: '',
    time: '',
    venue: '',
    actualPrice: '',
    availableTickets: '',
    image: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error loading categories', err);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await API.get('/subcategories');
      setSubCategories(res.data);
    } catch (err) {
      console.error('Error loading subcategories', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/subcategories/${editId}`, formData);
        alert('Subcategory updated');
      } else {
        await API.post('/subcategories', formData);
        alert('Subcategory created');
      }
      resetForm();
      fetchSubCategories();
    } catch (err) {
      alert('Action failed: ' + (err.response?.data?.error || 'Server error'));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      artist: '',
      date: '',
      time: '',
      venue: '',
      actualPrice: '',
      availableTickets: '',
      image: '',
      description: ''
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleEdit = (sub) => {
    setFormData({ ...sub, category: sub.category._id });
    setIsEditing(true);
    setEditId(sub._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this subcategory?')) {
      try {
        await API.delete(`/subcategories/${id}`);
        alert('Deleted');
        fetchSubCategories();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit' : 'Create'} SubCategory</h2>

      <form onSubmit={handleSubmit} className="grid gap-2 md:grid-cols-2">
        <input type="text" placeholder="Name" required value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

        <select required value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <input type="text" placeholder="Artist" required value={formData.artist}
          onChange={(e) => setFormData({ ...formData, artist: e.target.value })} />

        <input type="date" required value={formData.date.split('T')[0]}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })} />

        <input type="time" required value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })} />

        <input type="text" placeholder="Venue" required value={formData.venue}
          onChange={(e) => setFormData({ ...formData, venue: e.target.value })} />

        <input type="number" placeholder="Price" required value={formData.actualPrice}
          onChange={(e) => setFormData({ ...formData, actualPrice: e.target.value })} />

        <input type="number" placeholder="Available Tickets" required value={formData.availableTickets}
          onChange={(e) => setFormData({ ...formData, availableTickets: e.target.value })} />

        <input type="text" placeholder="Image URL" required value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })} />

        <textarea placeholder="Description" value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

        <div className="col-span-2 flex gap-2 mt-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
            {isEditing ? 'Update' : 'Create'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-1 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      {formData.image && (
        <div className="mt-4">
          <h4 className="font-semibold">Image Preview:</h4>
          <img src={formData.image} alt="Preview" className="w-40 border" />
        </div>
      )}

      <hr className="my-4" />
      <h2 className="text-xl font-bold mb-2">SubCategory List</h2>
      <ul className="space-y-2">
        {subCategories.map((sub) => (
          <li key={sub._id} className="border p-2 rounded shadow-sm">
            <div className="font-bold">{sub.name}</div>
            <div>Artist: {sub.artist}, Category: {sub.category?.name}</div>
            <div>Date: {new Date(sub.date).toLocaleDateString()} | Time: {sub.time}</div>
            <div>Venue: {sub.venue} | Price: ₹{sub.actualPrice} | Tickets: {sub.availableTickets}</div>
            <div>{sub.description}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(sub)} className="bg-yellow-500 text-white px-2 rounded">Edit</button>
              <button onClick={() => handleDelete(sub._id)} className="bg-red-600 text-white px-2 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>  
  );
}

export default SubCategoryAdmin;
