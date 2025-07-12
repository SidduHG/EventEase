import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';

import { FaDownload, FaPrint, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';

const EventTickets = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${eventId}/ticket`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTicketData(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to load ticket');
          toast.error('Failed to load ticket data');
        }
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [eventId, navigate]);

  const handleDownloadTicket = () => {
    const ticketElement = document.getElementById('ticket');
    html2canvas(ticketElement).then(canvas => {
      const link = document.createElement('a');
      link.download = `ticket-${eventId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  const handlePrintTicket = () => {
    const ticketElement = document.getElementById('ticket');
    html2canvas(ticketElement).then(canvas => {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`<img src="${canvas.toDataURL('image/png')}" />`);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    });
  };

  const verifyTicket = async (qrData) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/events/verify-ticket`, {
        qrData,
        eventId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setVerificationStatus(response.data.valid ? 'valid' : 'invalid');
      toast.success(response.data.message);
    } catch (err) {
      setVerificationStatus('error');
      toast.error(err.response?.data?.message || 'Verification failed');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
        <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Ticket</h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  if (!ticketData) return null;

  const qrData = JSON.stringify({
    eventId: ticketData.event._id,
    userId: ticketData.user._id,
    registrationId: ticketData._id,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Your Event Ticket</h1>
          <p className="mt-2 text-lg text-gray-600">Present this ticket at the event entrance</p>
        </div>

        <div id="ticket" className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-indigo-100">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{ticketData.event.name}</h2>
                <p className="text-indigo-600 font-medium">
                  {ticketData.event.organizer?.name || 'Event Organizer'}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 bg-indigo-100 px-4 py-2 rounded-lg">
                <p className="text-indigo-800 font-semibold">
                  Ticket #{ticketData._id.slice(-6).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {new Date(ticketData.event.startDate).toLocaleDateString('en-US', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">
                      {new Date(ticketData.event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {' '}
                      {new Date(ticketData.event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">
                      {ticketData.event.location?.address || 'Online Event'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="mb-4 p-3 bg-white border-2 border-gray-200 rounded-lg">
                  <QRCode 
                    value={qrData} 
                    size={150} 
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-sm text-gray-500 text-center">Scan this QR code at the entrance</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Attendee Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{ticketData.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{ticketData.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registration Type</p>
                  <p className="font-medium capitalize">{ticketData.registrationType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registered On</p>
                  <p className="font-medium">
                    {new Date(ticketData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
            <button
              onClick={handleDownloadTicket}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              <FaDownload className="mr-2" /> Download
            </button>
            <button
              onClick={handlePrintTicket}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
            >
              <FaPrint className="mr-2" /> Print
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to my events
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventTickets;
