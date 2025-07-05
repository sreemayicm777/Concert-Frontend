import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axiosInstance';
import './booking.css';

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

      localStorage.setItem('recentTicketId', res.data.ticketId);
      alert("Booking successful!");
      navigate('/my-tickets');
    } catch (error) {
      alert("Booking failed. Please try again.");
    }
  };

  if (!concert) return <div className="booking-container">Loading concert...</div>;

  const totalPrice = concert.actualPrice * quantity;

  return (
    <div className="booking-container">
      <div className="booking-box">
        <h2 className="booking-header">🎫 Book Tickets</h2>
        <div className="concert-card">
          <img
            src={concert.image}
            alt={concert.name}
            className="concert-image"
            onError={(e) => e.target.style.display = 'none'}
          />
          <h3 className="concert-title">{concert.name}</h3>
          <p className="concert-detail"><strong>Artist:</strong> {concert.artist}</p>
          <p className="concert-detail"><strong>Date:</strong> {new Date(concert.date).toLocaleDateString()}</p>
          <p className="concert-detail"><strong>Time:</strong> {concert.time}</p>
          <p className="concert-detail"><strong>Venue:</strong> {concert.venue}</p>
          <p className="concert-detail"><strong>Price per ticket:</strong> ₹{concert.actualPrice}</p>
          <p className="concert-detail"><strong>Available Tickets:</strong> {concert.availableTickets}</p>

          <div className="booking-form">
            <label className="quantity-label">Quantity (1 to 3):</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(3, Number(e.target.value))))}
              min="1"
              max="3"
              className="quantity-input"
            />

            <div className="price-summary">
              <div className="price-row">
                <span>Price per ticket:</span>
                <span>₹{concert.actualPrice}</span>
              </div>
              <div className="price-row">
                <span>Quantity:</span>
                <span>{quantity}</span>
              </div>
              <div className="price-row total-price">
                <span>Total Amount:</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <button
              className="booking-button"
              onClick={handleBooking}
              disabled={!user || concert.availableTickets < 1}
            >
              {concert.availableTickets < 1 ? 'SOLD OUT' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookConcertPage;