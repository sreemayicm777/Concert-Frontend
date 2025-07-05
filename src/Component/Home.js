import React, { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import "./home.css";
import { Link } from "react-router-dom";

function Home() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const fetchCategories = () => {
    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error loading categories:", err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/categories/${editId}`, formData);
        alert("Category updated");
      } else {
        await API.post("/categories", formData);
        alert("Category created");
      }
      setFormData({ name: "", description: "" });
      setIsEditing(false);
      setEditId(null);
      fetchCategories();
    } catch (err) {
      alert("Action failed. You may need admin access.");
    }
  };

  const handleEdit = (cat) => {
    setIsEditing(true);
    setEditId(cat._id);
    setFormData({ name: cat.name, description: cat.description });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      try {
        await API.delete(`/categories/${id}`);
        alert("Deleted successfully");
        fetchCategories();
      } catch (err) {
        alert("Delete failed. You may need admin access.");
      }
    }
  };

  return (
    <div className="home-container">
      {/* Header */}
      {/* <header className="concerthub-header">
        <h1 className="concerthub-title">🎵 ConcertHub</h1>
        <p className="concerthub-subtitle">Discover and manage concert categories</p>
      </header> */}

      {/* Category List */}

      {user?.role === 'user' && (
  <div className="view-booking-container">
    <Link to="/tickets" className="button button-primary">
      🎫 View My Booking
    </Link>
  </div>
)}
{user?.role === 'admin' && (
  <Link to="/admin/bookings" className="button button-primary">
    📋 View All Bookings
  </Link>
)}
      <section className="categories-section">
        <h2 className="section-title">Current Categories</h2>
        <ul className="category-list">
          {categories.map((cat) => (
            <li key={cat._id} className="category-item">
              <div className="category-info">
                <Link
                  to={`/category/${cat._id}`}
                  className="category-name text-blue-700 underline"
                >
                  {cat.name}
                </Link>
                <p className="category-description">{cat.description}</p>
              </div>
              {user?.role === "admin" && (
                <div className="admin-controls">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="button button-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="button button-danger"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Admin Form */}
      {user?.role === "admin" && (
        <section className="category-form-section">
          <h2 className="form-heading">
            {isEditing ? "Update Category" : "Create New Category"}
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              className="form-input"
              placeholder="Category Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <textarea
              className="form-textarea"
              placeholder="Category Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
            <div className="button-group">
              <button type="submit" className="button button-primary">
                {isEditing ? "Update Category" : "Create Category"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: "", description: "" });
                  }}
                  className="button button-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

export default Home;
