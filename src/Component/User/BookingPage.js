import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axiosInstance';

function BookConcertPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [concert, setConcert] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get('/auth/me')
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));

    API.get(`/subcategories/${id}`)
      .then(res => setConcert(res.data))
      .catch(() => alert('Failed to load concert'));
  }, [id]);

 const handleBooking = async () => {
  if (!user) {
    alert("Please log in first");
    return;
  }

  if (quantity < 1 || quantity > 3) {
    alert("You can only book 1 to 3 tickets.");
    return;
  }

  try {
    const res = await API.post('/tickets/book', {
      concertSubCategoryId: id,
      quantity: Number(quantity),
      userId: user.id
    });

    // ✅ Store the recent ticket ID for /my-tickets page
    localStorage.setItem('recentTicketId', res.data.ticketId);

    alert("Booking successful!");
    navigate('/my-tickets');
  } catch (error) {
    alert("Booking failed. Please try again.");
  }
};


  if (!concert) return <div className="p-6">Loading concert...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🎫 Book Tickets</h2>
      <div className="border rounded shadow p-4">
        <img
          src={concert.image}
          alt={concert.name}
          className="w-full h-48 object-cover rounded mb-3"
          onError={(e) => e.target.style.display = 'none'}
        />
        <h3 className="text-xl font-semibold">{concert.name}</h3>
        <p><strong>Artist:</strong> {concert.artist}</p>
        <p><strong>Date:</strong> {new Date(concert.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {concert.time}</p>
        <p><strong>Venue:</strong> {concert.venue}</p>
        <p><strong>Price per ticket:</strong> ₹{concert.actualPrice}</p>
        <p><strong>Available Tickets:</strong> {concert.availableTickets}</p>

        <label className="block mt-4">Quantity (1 to 3):</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          max="3"
          className="border px-3 py-1 rounded w-full mt-1"
        />

        <button
          className="mt-4 w-full bg-purple-600 text-white py-2 rounded"
          onClick={handleBooking}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default BookConcertPage;
