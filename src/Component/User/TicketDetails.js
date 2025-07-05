import React, { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function TicketDetails() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch logged-in user
    API.get('/auth/me')
      .then(res => {
        setUser(res.data.user);
        fetchUserTickets(res.data.user.id);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const fetchUserTickets = async (userId) => {
    try {
      const res = await API.get(`/tickets/user/${userId}`);
      setTickets(res.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  };

  const handleCancel = async (ticketId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) return;

    try {
      await API.delete(`/tickets/${ticketId}`);
      setTickets(prev => prev.filter(t => t._id !== ticketId));
      alert('Ticket cancelled successfully');
    } catch (err) {
      alert('Failed to cancel ticket');
    }
  };

  if (!user) return <p className="text-center mt-10">Please log in to view your tickets.</p>;

  if (loading) return <p className="text-center mt-10">Loading your bookings...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🎟️ My Booked Tickets</h2>

      {tickets.length === 0 ? (
        <p>No tickets booked yet.</p>
      ) : (
        <div className="grid gap-4">
          {tickets.map(ticket => (
            <div key={ticket._id} className="border rounded p-4 shadow bg-white">
              <h3 className="text-xl font-semibold mb-1">{ticket.concertSubCategory?.name}</h3>
              <p><strong>Artist:</strong> {ticket.concertSubCategory?.artist}</p>
              <p><strong>Date:</strong> {new Date(ticket.concertSubCategory?.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {ticket.concertSubCategory?.time}</p>
              <p><strong>Venue:</strong> {ticket.concertSubCategory?.venue}</p>
              <p><strong>Quantity:</strong> {ticket.quantity}</p>
              <p><strong>Total Price:</strong> ₹{ticket.totalPrice}</p>
              <p><strong>Status:</strong> {ticket.paymentStatus}</p>

              <div className="mt-2 space-x-2">
                <button 
                  onClick={() => navigate(`/download/${ticket._id}`)} 
                  className="text-blue-600 underline"
                >
                  Download PDF
                </button>
                <button 
                  onClick={() => handleCancel(ticket._id)} 
                  className="text-red-600 underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketDetails;
