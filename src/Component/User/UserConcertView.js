import React, { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';

function UserConcertView() {
  const [categories, setCategories] = useState([]);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [concertsByCategory, setConcertsByCategory] = useState({});

  useEffect(() => {
    API.get('/categories')
      .then(res => setCategories(res.data))
      .catch(() => alert("Failed to load categories"));
  }, []);

  const toggleCategory = async (categoryId) => {
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null); // Collapse
      return;
    }

    // If not already loaded, fetch concerts
    if (!concertsByCategory[categoryId]) {
      try {
        const res = await API.get(`/subcategories/category/${categoryId}`);
        setConcertsByCategory(prev => ({ ...prev, [categoryId]: res.data }));
      } catch (err) {
        console.error("Error loading concerts:", err);
        setConcertsByCategory(prev => ({ ...prev, [categoryId]: [] }));
      }
    }

    setExpandedCategoryId(categoryId); // Expand
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-purple-700">🎤 Browse Concert Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div
            key={cat._id}
            className="border rounded shadow p-4 cursor-pointer hover:bg-gray-100"
            onClick={() => toggleCategory(cat._id)}
          >
            <h2 className="text-xl font-semibold">{cat.name}</h2>
            <p className="text-gray-600">{cat.description}</p>

            {expandedCategoryId === cat._id && (
              <div className="mt-4">
                {concertsByCategory[cat._id]?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {concertsByCategory[cat._id].map(concert => (
                      <div key={concert._id} className="border rounded p-3 bg-white">
                        <img
                          src={concert.image}
                          alt={concert.name}
                          className="w-full h-40 object-cover mb-2 rounded"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                        <h3 className="font-bold">{concert.name}</h3>
                        <p><strong>Artist:</strong> {concert.artist}</p>
                        <p><strong>Date:</strong> {new Date(concert.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {concert.time}</p>
                        <p><strong>Venue:</strong> {concert.venue}</p>
                        <p><strong>Price:</strong> ₹{concert.actualPrice}</p>
                        <button
                          className="mt-2 px-3 py-1 bg-purple-600 text-white rounded"
                          onClick={() => window.location.href = `/book/${concert._id}`}
                        >
                          Book
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No concerts available for this category.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserConcertView;
