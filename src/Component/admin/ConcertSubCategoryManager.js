import React, { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

function ConcertSubCategoryManager() {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
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
  const [user, setUser] = useState(null);

  // Fetch current user
  useEffect(() => {
    API.get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  // Fetch categories and subcategories
  const fetchData = () => {
    API.get("/subcategories")
      .then((res) => setSubCategories(res.data))
      .catch(console.error);

    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/subcategories/${editId}`, formData);
        alert("Subcategory updated");
      } else {
        await API.post("/subcategories", formData);
        alert("Subcategory created");
      }
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
      fetchData();
    } catch (err) {
      alert("Failed. You may need admin access or validation error.");
    }
  };

  const handleEdit = (sub) => {
    setFormData({
      name: sub.name,
      category: sub.category,
      artist: sub.artist,
      date: sub.date.slice(0, 10),
      time: sub.time,
      venue: sub.venue,
      actualPrice: sub.actualPrice,
      availableTickets: sub.availableTickets,
      image: sub.image,
      description: sub.description || "",
    });
    setEditId(sub._id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this subcategory?")) {
      try {
        await API.delete(`/subcategories/${id}`);
        fetchData();
      } catch (err) {
        alert("Delete failed. Admin access required.");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
  {subCategories.map((sub) => (
    <div key={sub._id} className="border p-4 rounded shadow">
      <img
        src={sub.image}
        alt={sub.name}
        className="w-full h-32 object-cover mb-2 rounded"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      <h3 className="font-semibold text-lg">{sub.name}</h3>
      <p><strong>Artist:</strong> {sub.artist}</p>
      <p><strong>Date:</strong> {new Date(sub.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {sub.time}</p>
      <p><strong>Venue:</strong> {sub.venue}</p>
      <p><strong>Price:</strong> ₹{sub.actualPrice}</p>
      <p><strong>Available:</strong> {sub.availableTickets}</p>

      {user?.role === "admin" && (
        <div className="mt-2 space-x-2">
          <button
            className="text-blue-600 hover:underline"
            onClick={() => handleEdit(sub)}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:underline"
            onClick={() => handleDelete(sub._id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  ))}
</div>

  );
}

export default ConcertSubCategoryManager;
