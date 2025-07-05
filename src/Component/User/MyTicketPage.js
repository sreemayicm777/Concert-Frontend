import React, { useEffect, useState } from 'react';
import API from '../../api/axiosInstance';
import jsPDF from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';
import './myTicket.css';

function MyTicketPage() {
  const [ticket, setTicket] = useState(null);
  const [user, setUser] = useState(null);

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


const generatePDF = async () => {
  if (!ticket) return;

  try {
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(20);
    doc.setTextColor(209, 0, 0);
    doc.text(' Concert Ticket', 105, 15, null, null, 'center');

    // Add concert info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const yStart = 30;
    const lineSpacing = 10;

    const concert = ticket.concertSubCategory;
    const lines = [
      `Concert: ${concert?.name}`,
      `Artist: ${concert?.artist}`,
      `Date: ${new Date(concert?.date).toLocaleDateString()}`,
      `Time: ${concert?.time}`,
      `Venue: ${concert?.venue}`,
      `Ticket ID: ${ticket._id}`,
      `Tickets: ${ticket.quantity}`,
      `Total Price: Rs.${ticket.totalPrice}`,
      `Payment Status: ${ticket.paymentStatus}`
    ];

    lines.forEach((text, index) => {
      doc.text(text, 20, yStart + index * lineSpacing);
    });

    // Fetch QR code as SVG and convert to PNG (via canvas)
    const qrCodeUrl = 'https://hexdocs.pm/qr_code/docs/qrcode.svg';
    const response = await fetch(qrCodeUrl);
    const svgText = await response.text();

    // Convert SVG to Data URL
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.src = url;

    img.onload = () => {
      // Create canvas to draw PNG
      const canvas = document.createElement('canvas');
      canvas.width = 150;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pngDataUrl = canvas.toDataURL('image/png');
      doc.addImage(pngDataUrl, 'PNG', 140, 40, 50, 50);

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Thank you for using ConcertHub!', 105, 150, null, null, 'center');

      doc.save(`ConcertTicket_${ticket._id}.pdf`);
      URL.revokeObjectURL(url); // Clean up
    };

    img.onerror = () => {
      alert('Failed to load QR code image.');
    };
  } catch (err) {
    console.error('Error generating PDF:', err);
    alert('Failed to generate PDF.');
  }
};

  return (
    <div className="ticket-container">
      <h2 className="ticket-header">🎟️ My Ticket</h2>

      {!ticket ? (
        <p className="no-ticket">No recent ticket found.</p>
      ) : (
        <div className="ticket-card">
          <h3 className="ticket-title">{ticket.concertSubCategory?.name}</h3>
          
          <div className="ticket-detail">
            <span className="ticket-label">Artist:</span>
            <span className="ticket-value">{ticket.concertSubCategory?.artist}</span>
          </div>
          
          <div className="ticket-detail">
            <span className="ticket-label">Date:</span>
            <span className="ticket-value">{new Date(ticket.concertSubCategory?.date).toLocaleDateString()}</span>
          </div>
          
          <div className="ticket-detail">
            <span className="ticket-label">Time:</span>
            <span className="ticket-value">{ticket.concertSubCategory?.time}</span>
          </div>
          
          <div className="ticket-detail">
            <span className="ticket-label">Venue:</span>
            <span className="ticket-value">{ticket.concertSubCategory?.venue}</span>
          </div>
          
          <div className="ticket-detail">
            <span className="ticket-label">Tickets:</span>
            <span className="ticket-value">{ticket.quantity}</span>
          </div>
          
          <div className="ticket-detail">
            <span className="ticket-label">Total Paid:</span>
            <span className="ticket-value highlight-value">₹{ticket.totalPrice}</span>
          </div>
          
          <div className="ticket-detail">
            <span className="ticket-label">Status:</span>
            <span className="ticket-value">{ticket.paymentStatus}</span>
          </div>
          
          <div className="ticket-detail">
            <span className="ticket-label">Ticket ID:</span>
            <span className="ticket-value">{ticket._id}</span>
          </div>

          <div className="qr-container">
            <QRCodeCanvas value={ticket._id} size={150} />
          </div>

          <div className="button-group">
            <button
              className="ticket-button cancel-button"
              onClick={handleCancel}
            >
              Cancel Ticket
            </button>
            <button
              onClick={generatePDF}
              className="ticket-button download-button"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTicketPage;