import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaClock, FaTicketAlt } from 'react-icons/fa';

const UpcomingEvents = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/events');
                const events = Array.isArray(response.data) ? response.data : [];
                events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                setEvents(events);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, [navigate]);

    // Function to get all events


    // const handleEventDetails = (eventId) => {
    //     navigate(`/events/${eventId}`);
    // };

    const handleRegistration = () => {
        navigate(`/register`);
    };


    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
        </div>
    );

    if (events.length === 0) return (
        <div className="text-center py-16 bg-gray-100">
            <p className="text-gray-600 text-xl">No upcoming events found</p>
        </div>
    );

    return (
        <section id="events" className="py-16 bg-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-indigo-900 mb-4">Upcoming Events</h2>
                    <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover exciting events or create your own to share with the world
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.slice(0, 3).map((event) => (
                        <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                            <div className="h-48 bg-indigo-700 flex items-center justify-center">
                                <FaCalendarAlt className="text-white text-6xl" />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
                                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                                        {event.type}
                                    </span>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-600">
                                        <FaCalendarAlt className="mr-2 text-indigo-600" />
                                        <span>{new Date(event.startDate).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <div className="flex items-center text-gray-600">
                                        <FaClock className="mr-2 text-indigo-600" />
                                        <span>
                                            {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                            {new Date(event.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center text-gray-600">
                                        <FaMapMarkerAlt className="mr-2 text-indigo-600" />
                                        <span>{event.location.type === 'physical' ? event.location.address : 'Online Event'}</span>
                                    </div>
                                    
                                    <div className="flex items-center text-gray-600">
                                        <FaTicketAlt className="mr-2 text-indigo-600" />
                                        <span className={`${event.registrationType === 'free' ? 'text-green-600' : 'text-purple-600'}`}>
                                            {event.registrationType === 'free' ? 'Free Registration' : 'Paid Event'}
                                        </span>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => navigate(`/events/${event._id}`)}
                                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
                                >
                                    View Details
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="text-center mt-12">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-indigo-900 font-bold py-3 px-8 rounded-lg transition duration-300"
                    onClick={() => navigate('/userpage/events')}
                    >
                        Browse All Events
                    </button>
                </div>
            </div>
        </section>
    );
};

export default UpcomingEvents;