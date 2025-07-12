import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventAndUpcoming = async () => {
      try {
        setLoading(true);
        const eventResponse = await axios.get(`http://localhost:5000/api/events/${eventId}`);
        setEvent(eventResponse.data);
        
        if (eventResponse.data) {
          const upcomingResponse = await axios.get(`http://localhost:5000/api/events`, {
            params: {
              type: eventResponse.data.type,
              limit: 3,
              exclude: eventId
            }
          });
          setUpcomingEvents(upcomingResponse.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventAndUpcoming();
  }, [eventId]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );
  
  if (!event) return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded" role="alert">
        <p className="font-bold">Not Found</p>
        <p>Event not found.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Event Details</h1>
        <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Event Details */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-purple-700 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-30"></div>
              <div className="relative z-10 text-center px-4">
                <h1 className="text-2xl font-bold text-white">{event.name}</h1>
                <span className="inline-block bg-white text-indigo-700 px-2 py-0.5 rounded-full text-xs font-semibold mt-1">
                  {event.type}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <p className="text-gray-700 mb-4">
                {event.description || 'No description provided'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date & Time</h3>
                    <div className="flex items-start">
                      <svg className="h-4 w-4 text-indigo-500 mr-1 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-900">
                        {new Date(event.startDate).toLocaleString([], { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} - {new Date(event.endDate).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Location</h3>
                    <div className="flex items-start">
                      <svg className="h-4 w-4 text-indigo-500 mr-1 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm text-gray-900">
                        {event.location.type === 'physical' ? (
                          event.location.address
                        ) : 'Online Event'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Registration</h3>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-indigo-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-gray-900">
                        {event.registrationType === 'free' ? 'Free' : 'Paid'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Capacity</h3>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-indigo-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-sm text-gray-900">
                        {event.maxAttendees || 'No limit'}
                      </p>
                    </div>
                  </div>
                  
                  {event.tickets?.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Tickets</h3>
                      <div className="mt-1 space-y-2">
                        {event.tickets.map(ticket => (
                          <div key={ticket._id} className="flex justify-between items-center p-2 bg-white rounded border border-gray-200 text-sm">
                            <div>
                              <p className="font-medium">{ticket.name}</p>
                              <p className="text-xs text-gray-500">Available: {ticket.quantity}</p>
                            </div>
                            <span className="font-bold text-indigo-600">${ticket.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  onClick={() => navigate(`/events/${event._id}/register/${event.registrationType}`)}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition flex items-center justify-center text-sm"
                >
                  {event.registrationType === 'free' ? 'Register for Free' : 'Purchase Tickets'}
                </button>
                
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition text-sm">
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Upcoming Events */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-4 py-3">
              <h2 className="text-lg font-bold text-white">Upcoming {event.type} Events</h2>
            </div>
            
            <div className="p-4">
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 4).map(upcomingEvent => (
                    <div 
                      key={upcomingEvent._id} 
                      className="group border border-gray-200 rounded p-3 hover:border-indigo-300 cursor-pointer bg-gray-50 hover:bg-white text-sm"
                      onClick={() => navigate(`/events/${upcomingEvent._id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium group-hover:text-indigo-600">
                          {upcomingEvent.name}
                        </h3>
                      </div>
                      
                      <div className="mt-1 flex items-center text-gray-500">
                        <svg className="flex-shrink-0 mr-1 h-3 w-3 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {new Date(upcomingEvent.startDate).toLocaleDateString([], { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      
                      <div className="mt-1 flex items-center text-gray-500">
                        <svg className="flex-shrink-0 mr-1 h-3 w-3 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {upcomingEvent.location.type === 'physical' ? 
                          upcomingEvent.location.address.split(',')[0] : 'Online'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-1 text-xs text-gray-500">No other {event.type} events scheduled</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;