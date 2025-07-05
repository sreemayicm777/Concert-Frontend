import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axiosInstance";
import "./SubCategoryPages.css";
import {  useNavigate } from "react-router-dom";

function SubCategoryPages() {
  const { categoryId } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    artist: "",
    date: "",
    time: "",
    venue: "",
    actualPrice: "",
    availableTickets: "",
    image: "",
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    API.get(`/categories/${categoryId}`)
      .then((res) => setCategoryName(res.data.name))
      .catch(() => setCategoryName("Unknown Category"));

    fetchSubCategories();
  }, [categoryId]);

  const fetchSubCategories = () => {
    API.get(`/subcategories/category/${categoryId}`)
      .then((res) => setSubCategories(res.data))
      .catch((err) => console.error(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, category: categoryId };
      if (isEditing) {
        await API.put(`/subcategories/${editId}`, payload);
        alert("Updated successfully");
      } else {
        await API.post("/subcategories", payload);
        alert("Subcategory created");
      }
      resetForm();
      fetchSubCategories();
    } catch (err) {
      console.error(err.response?.data || err.message);
      const errorMsg =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.error ||
        "Unknown error";
      alert("Submit failed: " + errorMsg);
    }
  };

  const handleEdit = (sub) => {
    setFormData({
      name: sub.name,
      artist: sub.artist,
      date: sub.date.slice(0, 10),
      time: sub.time,
      venue: sub.venue,
      actualPrice: sub.actualPrice,
      availableTickets: sub.availableTickets,
      image: sub.image,
      description: sub.description || "",
    });
    setIsEditing(true);
    setEditId(sub._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        await API.delete(`/subcategories/${id}`);
        alert("Deleted successfully");
        fetchSubCategories();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageForm = new FormData();
    imageForm.append("image", file);

    try {
      setUploading(true);
      const res = await API.post("/upload", imageForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploading(false);
      setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert("Image upload failed");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      artist: "",
      date: "",
      time: "",
      venue: "",
      actualPrice: "",
      availableTickets: "",
      image: "",
      description: "",
    });
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div className="subcategory-container dark-theme">
      <div className="header-section">
        <h2 className="page-title">Subcategories of {categoryName}</h2>

        {user?.role === "admin" && !showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="create-btn"
          >
            <span className="btn-icon">+</span> Create Subcategory
          </button>
        )}
      </div>

      {user?.role === "admin" && showForm && (
        <div className="subcategory-form dark-form">
          <h3 className="form-title">
            {isEditing ? "Edit Subcategory" : "Create Subcategory"}
          </h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Artist</label>
              <input
                type="text"
                required
                value={formData.artist}
                onChange={(e) =>
                  setFormData({ ...formData, artist: e.target.value })
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Venue</label>
              <input
                type="text"
                required
                value={formData.venue}
                onChange={(e) =>
                  setFormData({ ...formData, venue: e.target.value })
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                required
                value={formData.actualPrice}
                onChange={(e) =>
                  setFormData({ ...formData, actualPrice: e.target.value })
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available Tickets</label>
              <input
                type="number"
                required
                value={formData.availableTickets}
                onChange={(e) =>
                  setFormData({ ...formData, availableTickets: e.target.value })
                }
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Image</label>
              <div className="file-upload-container">
                <label className="file-upload-label">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="file-upload-input"
                  />
                </label>
                {uploading && (
                  <span className="uploading-text">Uploading...</span>
                )}
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="form-textarea"
              ></textarea>
            </div>

            {formData.image && (
              <div className="form-group full-width">
                <label className="form-label">Image Preview</label>
                <img
                  src={`http://localhost:5000${formData.image}`}
                  alt="Preview"
                  className="image-preview"
                />
              </div>
            )}

            <div className="form-actions full-width">
              <button type="submit" className="form-submit-btn">
                {isEditing ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="form-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="card-grid">
        {subCategories.map((sub) => (
          <div key={sub._id} className="event-card">
            {sub.image && (
              <div className="card-image-container">
                <img
                  src={`http://localhost:5000${sub.image}`}
                  alt={sub.name}
                  className="card-image"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
            <div className="card-content">
              <h3 className="event-title">{sub.name}</h3>

              <div className="event-details">
                <div className="detail-row">
                  <span className="detail-label">Artist:</span>
                  <span>{sub.artist}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span>{new Date(sub.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Time:</span>
                  <span>{sub.time}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Venue:</span>
                  <span>{sub.venue}</span>
                </div>
                <div className="detail-row highlight">
                  <span className="detail-label">Price:</span>
                  <span className="highlight-value">₹{sub.actualPrice}</span>
                </div>
                <div className="detail-row highlight">
                  <span className="detail-label">Tickets:</span>
                  <span className="highlight-value">
                    {sub.availableTickets}
                  </span>
                </div>
              </div>

              {sub.description && (
                <div className="event-description">
                  <p>{sub.description}</p>
                </div>
              )}

              {user?.role === "admin" && (
                <div className="card-actions">
                  <button
                    onClick={() => handleEdit(sub)}
                    className="action-btn edit-action"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="action-btn delete-action"
                  >
                    Delete
                  </button>
                </div>
              )}
              {user && user.role !== "admin" && (
                <button
                  onClick={() => navigate(`/book/${sub._id}`)}
                  className="action-btn book-action"
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubCategoryPages;
