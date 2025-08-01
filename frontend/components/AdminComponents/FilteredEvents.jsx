import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../utils/api';

const eventTypes = ['conference', 'concert', 'workshop'];
const timeFilters = ['current', 'upcoming', 'past'];

const FilteredEventList = () => {
  const [selectedType, setSelectedType] = useState('conference');
  const [selectedTime, setSelectedTime] = useState('current');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilteredEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${apiUrl}/api/admindashboard/filter?type=${selectedType}&time=${selectedTime}`
        );
        setFilteredEvents(res.data);
      } catch (err) {
        console.error('Failed to fetch filtered events', err);
        setError('Failed to load events. Please try again.');
        setFilteredEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredEvents();
  }, [selectedType, selectedTime]);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-purple-600 mb-8">
        Discover Exciting Events
      </h2>
      
      {/* Time Filters */}
      <div className="mb-3 bg-white rounded-xl p-3 shadow-lg">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
          <svg className="w-4 h-4 mr-2 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Time Period
        </h3>
        <div className="flex flex-wrap gap-3">
          {timeFilters.map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedTime(filter)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedTime === filter
                  ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-lg transform -translate-y-0.5'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Event Type Tabs */}
      <div className="mb-3 bg-white rounded-xl p-3 shadow-lg">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
          <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Event Categories
        </h3>
        <div className="flex space-x-4 border-b border-gray-200 pb-1">
          {eventTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-5 py-3 text-sm font-medium relative transition-all duration-300 ${
                selectedType === type
                  ? 'text-purple-600 font-bold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
              {selectedType === type && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-teal-400 to-purple-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-purple-500 border-b-transparent animate-spin animation-delay-150"></div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-5 mb-8 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Oops! Something went wrong</h3>
              <p className="mt-1 text-sm text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!isLoading && filteredEvents.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-lg p-8">
            <div className="mx-auto h-24 w-24 text-gray-400 relative">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute -inset-4 bg-gradient-to-tr from-teal-100 to-purple-100 rounded-full opacity-20"></div>
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-900">No events matching your criteria</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              We couldn't find any {selectedType} events in the {selectedTime} period. Try adjusting your filters.
            </p>
            <button 
              onClick={() => {
                setSelectedType('conference');
                setSelectedTime('current');
              }}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-teal-400 to-purple-500 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div 
              key={event._id} 
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="relative h-48 bg-gradient-to-r from-teal-400 to-purple-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-white/90 text-teal-800">
                    {event.type}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-2">
                    {event.name}
                  </h4>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  {new Date(event.startDate).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                
                <p className="text-gray-600 mb-6 line-clamp-3">{event.description}</p>
                
                <button
                  onClick={() => navigate(`/event-details/${event._id}`)}
                  className="w-full px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  View Details
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FilteredEventList;