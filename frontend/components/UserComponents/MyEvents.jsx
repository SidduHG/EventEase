import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { apiUrl } from '../../utils/api';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(apiUrl('/api/events/my-events'), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
            });

            setEvents(response.data);
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError(err.response?.data?.message || err.message);
            }
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
           await axios.delete(apiUrl(`/api/events/${eventId}`), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
            });

            toast.success('Event deleted successfully');
            setEvents(events.filter(event => event._id !== eventId));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete event');
        }
    };

    const handleEventDetails = (id) => {
        navigate(`/events/${id}`);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
                <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Events</h2>
                <p className="text-gray-700 mb-4">{error}</p>
                <button 
                    onClick={fetchEvents}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <div className="py-16 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-indigo-900 mb-4">My Events</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Here are all the events you've registered for or created.
                    </p>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <h3 className="text-xl font-medium text-gray-700">You don't have any events yet.</h3>
                        <p className="text-gray-500 mt-2">Browse events to register or create your own!</p>
                        <button
                            onClick={() => navigate('/events')}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                        >
                            Browse Events
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map(event => (
                            <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => handleDeleteEvent(event._id)}
                                                className="text-red-500 hover:text-red-700 transition"
                                                title="Delete Event"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-gray-700">
                                        <div className="flex items-center">
                                            <FaCalendarAlt className="mr-2 text-indigo-600 flex-shrink-0" />
                                            <span>{new Date(event.startDate).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaClock className="mr-2 text-indigo-600 flex-shrink-0" />
                                            <span>
                                                {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {' '}
                                                {new Date(event.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <FaMapMarkerAlt className="mr-2 text-indigo-600 mt-0.5 flex-shrink-0" />
                                            <span>{event.location.type === 'physical' ? event.location.address : 'Online Event'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaTicketAlt className="mr-2 text-indigo-600 flex-shrink-0" />
                                            <span className="capitalize">{event.registrationType}</span>
                                        </div>

                                        {/* ✅ Registration Info */}
                                        {event.maxAttendees && (
                                            <div className="text-sm text-gray-600">
                                                <p>{event.registeredCount} registered / {event.maxAttendees} total</p>
                                                <p><strong>{event.maxAttendees - (event.registeredCount || 0)}</strong> slots left</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-6 flex space-x-3">
                                        <button 
                                            onClick={() =>navigate('/verify-ticket')}
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                                        >
                                            Verify Tickets
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyEvents;
