import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyTicket = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const verifyTicket = async (qrData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/events/verify-ticket',
        qrData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.valid) {
        setVerificationStatus('valid');
        setTicketDetails(response.data.data);
        toast.success(response.data.message);
      } else {
        setVerificationStatus('invalid');
        toast.error(response.data.message);
      }
    } catch (err) {
      setVerificationStatus('error');
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (data) => {
    if (data) {
      try {
        const qrData = JSON.parse(data.text);
        verifyTicket(qrData);
      } catch (error) {
        console.error('Invalid QR code format', error);
        toast.error('Invalid QR code format');
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    toast.error('Error accessing camera or scanning QR code');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Scan QR Code to Verify Ticket</h1>

      <div className="w-full max-w-md bg-white p-4 rounded shadow">
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      </div>

      {loading && <p className="mt-4 text-blue-600">Verifying ticket...</p>}

      {verificationStatus === 'valid' && ticketDetails && (
        <div className="mt-4 p-4 bg-green-100 rounded shadow w-full max-w-md">
          <h2 className="text-lg font-bold mb-2 text-green-700">✅ Ticket is valid</h2>
          <p><strong>Event Name:</strong> {ticketDetails.eventName}</p>
          <p><strong>Organizer:</strong> {ticketDetails.organizerName}</p>
          <p><strong>Attendee:</strong> {ticketDetails.userName}</p>
          <p><strong>Number of Tickets:</strong> {ticketDetails.ticketQuantity}</p>
        </div>
      )}

      {verificationStatus === 'invalid' && (
        <p className="mt-4 text-red-600 font-semibold flex items-center justify-center">
          ❌ Invalid ticket
        </p>
      )}

      {verificationStatus === 'error' && (
        <p className="mt-4 text-yellow-600 font-semibold flex items-center justify-center">
          ⚠️ Verification error occurred
        </p>
      )}
    </div>
  );
};

export default VerifyTicket;
