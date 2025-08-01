// src/pages/AllEvents.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { apiUrl } from '../../utils/api';

const AllEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 6;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/events`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const allEvents = Array.isArray(response.data) ? response.data : [];
                allEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                setEvents(allEvents);
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [navigate]);

    const handleEventDetails = (id) => {
        navigate(`/events/${id}`);
    };

    // Get current events
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(events.length / eventsPerPage)));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

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
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <div className="py-16 bg-gray-200 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-indigo-900 mb-4 underline">Upcoming Events</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover and join exciting events happening near you or online.
                    </p>
                </div>

                {currentEvents.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <h3 className="text-xl font-medium text-gray-700">No events available at the moment.</h3>
                        <p className="text-gray-500 mt-2">Check back later for new events!</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {currentEvents.map(event => (
                                <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
                                            <span className={`px-2 py-1 text-xs rounded-full ${event.registrationType === 'free' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                                                {event.registrationType === 'free' ? 'FREE' : 'PAID'}
                                            </span>
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
                                        </div>
                                        <button 
                                            onClick={() => handleEventDetails(event._id)}
                                            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {events.length > eventsPerPage && (
                            <div className="flex justify-center items-center space-x-4 mt-8">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50'}`}
                                >
                                    <FaChevronLeft />
                                </button>
                                
                                {Array.from({ length: Math.ceil(events.length / eventsPerPage) }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => paginate(index + 1)}
                                        className={`w-10 h-10 rounded-full ${currentPage === index + 1 ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === Math.ceil(events.length / eventsPerPage)}
                                    className={`p-2 rounded-full ${currentPage === Math.ceil(events.length / eventsPerPage) ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50'}`}
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AllEvents;