import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PaidEventRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [attendeeInfo, setAttendeeInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load Razorpay script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Fetch Event Details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/events/${eventId}`);
        setEvent(data);
        if (data.tickets.length > 0) {
          setSelectedTicket(data.tickets[0]._id);
        }
      } catch (err) {
        setError('Failed to load event details');
        console.error('Event fetch error:', err.response?.data || err.message);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Fetch User Details and pre-fill attendee info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to register');
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data?.user) {
          setUser(res.data.user);
          setAttendeeInfo({
            name: res.data.user.name || '',
            email: res.data.user.email || '',
            phone: res.data.user.phone || ''
          });
          // Store user ID in localStorage if not already present
          if (res.data.user.id && !localStorage.getItem('userId')) {
            localStorage.setItem('userId', res.data.user._id);
          }
        }
      } catch (err) {
        setError('Failed to load user details');
        console.error('User fetch error:', err.response?.data || err.message);
      }
    };

    fetchUser();
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Validate all inputs
      if (!attendeeInfo.name || !attendeeInfo.email || !attendeeInfo.phone) {
        throw new Error('Please fill all attendee details');
      }

      // 2. Get fresh token (in case it was updated)
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // 3. Create the order
      console.log('Creating order with:', {
        eventId,
        ticketId: selectedTicket,
        quantity,
        attendeeInfo
      });

      const { data } = await axios.post(
        'http://localhost:5000/api/payment/create-event-order',
        {
          eventId,
          ticketId: selectedTicket,
          quantity,
          attendeeInfo
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // 4. Handle response
      if (!data?.success) {
        console.error('Order creation failed:', data?.message);
        throw new Error(data?.message || 'Payment processing failed');
      }

      // 5. Initialize Razorpay
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) throw new Error('Payment gateway unavailable');
      
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Payment gateway configuration error');
      }
      const options = {
        key: razorpayKey,
        amount: data.order.amount,
        currency: 'INR',
        name: event.name,
        description: `Ticket for ${event.name}`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            console.log('Payment successful, verifying...', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id
            });

            const { data } = await axios.post(
              'http://localhost:5000/api/payment/verify-event-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                eventId,
                ticketId: selectedTicket,
                quantity,
                attendeeInfo: {
                  name: attendeeInfo.name,    // Maps to fullName in Registration
                  email: attendeeInfo.email,
                  phone: attendeeInfo.phone
                }
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                timeout: 15000
              }
            );

            if (!data.success) {
              throw new Error(data.message || 'Verification failed');
            }

            console.log('Payment verified:', data);
            navigate('/registered');

          } catch (err) {
            console.error('Verification error:', {
              message: err.message,
              response: err.response?.data
            });

            let errorMessage = 'Payment verification failed';
            if (err.response?.data?.message) {
              errorMessage = err.response.data.message;
            } else if (err.message.includes('timeout')) {
              errorMessage = 'Verification timed out. Please check your registration status later.';
            } else if (err.message.includes('already processed')) {
              errorMessage = 'This payment was already processed. Check your registrations.';
            }

            setError(errorMessage);
          }
        },
        prefill: {
          name: attendeeInfo.name,
          email: attendeeInfo.email,
          contact: attendeeInfo.phone
        },
        notes: {
          eventId,
          ticketId: selectedTicket,
          quantity
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        setError(`Payment failed: ${response.error.description}`);
      });

      rzp.open();

    } catch (err) {
      console.error('Payment error:', {
        message: err.message,
        response: err.response?.data,
        stack: err.stack
      });
      
      let errorMessage = err.message || 'Payment processing failed';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="animate-pulse flex justify-center">
            <div className="h-8 w-8 bg-blue-400 rounded-full"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header with event image */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Register for {event.name}</h1>
          <p className="opacity-90">{event.description}</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Ticket Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Ticket Options</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Ticket</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={selectedTicket}
                  onChange={(e) => setSelectedTicket(e.target.value)}
                  required
                >
                  {event.tickets.map(ticket => (
                    <option key={ticket._id} value={ticket._id}>
                      {ticket.name} - ₹{ticket.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Attendee Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Attendee Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={attendeeInfo.name}
                  onChange={(e) => setAttendeeInfo({...attendeeInfo, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={attendeeInfo.email}
                  onChange={(e) => setAttendeeInfo({...attendeeInfo, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={attendeeInfo.phone}
                  onChange={(e) => setAttendeeInfo({...attendeeInfo, phone: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          {selectedTicket && (
            <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket Type:</span>
                  <span className="font-medium">{event.tickets.find(t => t._id === selectedTicket).name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per ticket:</span>
                  <span className="font-medium">₹{event.tickets.find(t => t._id === selectedTicket).price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between text-lg font-bold text-blue-600">
                  <span>Total Amount:</span>
                  <span>₹{event.tickets.find(t => t._id === selectedTicket).price * quantity}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={loading || !user}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
              loading || !user 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : !user ? (
              'Please Login to Register'
            ) : (
              'Proceed to Payment'
            )}
          </button>

          {/* Security Assurance */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure payment powered by Razorpay
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaidEventRegistration;