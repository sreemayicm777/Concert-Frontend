import React, { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';
import jsPDF from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';

function MyTicketPage() {
  const [ticket, setTicket] = useState(null);
  const [user, setUser] = useState(null);

  // Get user info
  useEffect(() => {
    API.get('/auth/me')
      .then(res => {
        setUser(res.data.user);
      })
      .catch(() => {
        alert('Please log in to view your tickets');
        setUser(null);
      });
  }, []);

  // Load recently booked ticket only
  useEffect(() => {
    const recentTicketId = localStorage.getItem('recentTicketId');
    if (recentTicketId && user?.id) {
      API.get(`/tickets/user/${user.id}`)
        .then(res => {
          const match = res.data.find(t => t._id === recentTicketId);
          setTicket(match || null);
        })
        .catch(() => alert('Failed to load ticket'));
    }
  }, [user]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) return;
    try {
      await API.delete(`/tickets/${ticket._id}`);
      alert('Ticket cancelled');
      setTicket(null);
      localStorage.removeItem('recentTicketId');
    } catch {
      alert('Cancellation failed');
    }
  };

  const generatePDF = () => {
    if (!ticket) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('🎟️ Concert Ticket', 20, 20);
    doc.text(`Concert: ${ticket.concertSubCategory?.name}`, 20, 40);
    doc.text(`Artist: ${ticket.concertSubCategory?.artist}`, 20, 50);
    doc.text(`Date: ${new Date(ticket.concertSubCategory?.date).toLocaleDateString()}`, 20, 60);
    doc.text(`Venue: ${ticket.concertSubCategory?.venue}`, 20, 70);
    doc.text(`Tickets: ${ticket.quantity}`, 20, 80);
    doc.text(`Total: ₹${ticket.totalPrice}`, 20, 90);
    doc.text(`Status: ${ticket.paymentStatus}`, 20, 100);
    doc.text(`Ticket ID: ${ticket._id}`, 20, 110);
    doc.save(`Ticket_${ticket._id}.pdf`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🎟️ My Ticket</h2>

      {!ticket ? (
        <p>No recent ticket found.</p>
      ) : (
        <div className="border p-4 rounded shadow max-w-md">
          <h3 className="font-semibold text-lg">{ticket.concertSubCategory?.name}</h3>
          <p><strong>Artist:</strong> {ticket.concertSubCategory?.artist}</p>
          <p><strong>Date:</strong> {new Date(ticket.concertSubCategory?.date).toLocaleDateString()}</p>
          <p><strong>Venue:</strong> {ticket.concertSubCategory?.venue}</p>
          <p><strong>Tickets:</strong> {ticket.quantity}</p>
          <p><strong>Total Paid:</strong> ₹{ticket.totalPrice}</p>
          <p><strong>Status:</strong> {ticket.paymentStatus}</p>
          <p><strong>Ticket ID:</strong> {ticket._id}</p>
          <div className="my-2">
            <QRCodeCanvas value={ticket._id} size={80} />
          </div>

          <button
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded mr-2"
            onClick={handleCancel}
          >
            Cancel Ticket
          </button>
          <button
            onClick={generatePDF}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default MyTicketPage;
