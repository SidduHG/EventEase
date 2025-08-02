import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { apiUrl } from '../../utils/api';

const RegisteredPage = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
    

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  const fetchRegisteredEvents = async () => {
    try {
      const response = await axios.get(apiUrl('/api/registrations/registered-events'), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setRegisteredEvents(response.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || err.message);
        toast.error('Failed to load registered events');
      }
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
      <p className="text-lg text-gray-700">Loading your registered events...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Events</h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <button
          onClick={fetchRegisteredEvents}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (registeredEvents.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Registered Events</h2>
        <p className="text-gray-600 mb-6">You haven't registered for any events yet.</p>
        <button
          onClick={() => navigate('/events')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Browse Events
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Registered Events
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Events you've successfully registered for
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {registeredEvents.map((event) => (
            <div key={event._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.name}</h3>
                
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start">
                    <FaCalendarAlt className="mt-1 mr-2 text-indigo-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p>
                        {new Date(event.startDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mt-1 mr-2 text-indigo-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p>{event.location?.address || 'Online Event'}</p>
                    </div>
                  </div>

                  {event.registrationType && (
                    <div className="flex items-start">
                      <FaTicketAlt className="mt-1 mr-2 text-indigo-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Registration Type</p>
                        <p className="capitalize">{event.registrationType}</p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/events/${event._id}/ticket`)}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  View Ticket Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegisteredPage;