import React, { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';
import './allBookings.css';

function AllBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get('/auth/me')
      .then(res => {
        setUser(res.data.user);
        if (res.data.user.role === 'admin') {
          fetchAllBookings();
        }
      })
      .catch(() => setUser(null));
  }, []);

  const fetchAllBookings = () => {
    API.get('/tickets/all')
      .then(res => setBookings(res.data))
      .catch(err => console.error('Failed to load bookings:', err));
  };

  if (!user) return <p className="empty-state">Please log in as admin.</p>;
  if (user.role !== 'admin') return <p className="access-denied">Access denied.</p>;

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      default: return '';
    }
  };

  return (
    <div className="dark-theme">
      <h2 className="booking-header">📋 All Booking Details</h2>

      {bookings.length === 0 ? (
        <p className="empty-state">No bookings found.</p>
      ) : (
        <div className="table-container">
          <table className="booking-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Concert</th>
                <th>Artist</th>
                <th>Date</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td>{booking.user?.name || 'N/A'}</td>
                  <td>{booking.user?.email || 'N/A'}</td>
                  <td>{booking.concertSubCategory?.name || 'N/A'}</td>
                  <td>{booking.concertSubCategory?.artist || 'N/A'}</td>
                  <td>{new Date(booking.concertSubCategory?.date).toLocaleDateString() || 'N/A'}</td>
                  <td>{booking.quantity}</td>
                  <td className="price-highlight">₹{booking.totalPrice}</td>
                  <td className={getStatusClass(booking.paymentStatus)}>
                    {booking.paymentStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AllBookingsPage;