import React, { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

function SubCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
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

  useEffect(() => {
    API.get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));

    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const fetchSubCategories = () => {
    if (selectedCategoryId) {
      API.get(`/subcategories/category/${selectedCategoryId}`)
        .then((res) => setSubCategories(res.data))
        .catch(() => setSubCategories([]));
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, [selectedCategoryId]);

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
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
  };

const handleEdit = (sub) => {
  setFormData({
    name: sub.name,
    category: sub.category._id || sub.category,
    artist: sub.artist,
    date: sub.date.slice(0, 10),
    time: sub.time,
    venue: sub.venue,
    actualPrice: sub.actualPrice,
    availableTickets: sub.availableTickets,
    image: sub.image,
    description: sub.description || '',
  });
  setEditId(sub._id);
  setIsEditing(true);
};
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        await API.delete(`/subcategories/${id}`);
        alert("Subcategory deleted");
        fetchSubCategories();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (isEditing) {
      await API.put(`/subcategories/${editId}`, formData);
      alert('Subcategory updated!');
    } else {
      await API.post('/subcategories', formData);
      alert('Subcategory created!');
    }

    setIsEditing(false);
    setEditId(null);
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
    fetchSubCategories(); // refresh data
  } catch (err) {
    console.error(err);
    alert('Submit failed: ' + (err.response?.data?.error || ''));
  }
};


  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Browse Concert Events</h2>

      <select
        className="border px-3 py-2 mb-4"
        value={selectedCategoryId}
        onChange={(e) => setSelectedCategoryId(e.target.value)}
      >
        <option value="">-- Select Category --</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subCategories.map((sub) => (
          <div key={sub._id} className="border rounded p-3 shadow">
            <img
              src={sub.image}
              alt={sub.name}
              className="h-40 w-full object-cover mb-2 rounded"
              onError={(e) => (e.target.style.display = "none")}
            />
            <h3 className="text-lg font-semibold">{sub.name}</h3>
            <p>
              <strong>Artist:</strong> {sub.artist}
            </p>
            <p>
              <strong>Date:</strong> {new Date(sub.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {sub.time}
            </p>
            <p>
              <strong>Venue:</strong> {sub.venue}
            </p>
            <p>
              <strong>Price:</strong> ₹{sub.actualPrice}
            </p>
            <p>{sub.description}</p>

            {user?.role === "admin" && (
              <div className="mt-2 flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(sub)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(sub._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="mt-10 p-4 border-t">
          <h2 className="text-xl font-bold mb-4">Edit SubCategory</h2>
          <form onSubmit={handleSubmit} className="grid gap-2 max-w-2xl">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Artist"
              value={formData.artist}
              onChange={(e) =>
                setFormData({ ...formData, artist: e.target.value })
              }
              required
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
            <input
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Venue"
              value={formData.venue}
              onChange={(e) =>
                setFormData({ ...formData, venue: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.actualPrice}
              onChange={(e) =>
                setFormData({ ...formData, actualPrice: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Available Tickets"
              value={formData.availableTickets}
              onChange={(e) =>
                setFormData({ ...formData, availableTickets: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <div className="col-span-2 flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                {isEditing ? "Update" : "Create"}
              </button>
            

            </div>
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="w-48 border rounded"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}

            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditId(null);
                }}
                className="bg-gray-500 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default SubCategoryPage;
