import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../utils/api';


const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState('');
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(apiUrl(`/api/admindashboard/event-details/${eventId}`));
        const fetchedEvent = res.data;
        setEvent(fetchedEvent);
        setAttendeeCount(fetchedEvent.attendeeCount || 0);
        setRevenue(fetchedEvent.revenueGenerated || 0);

        const now = new Date();
        const start = new Date(fetchedEvent.startDate);
        const end = new Date(fetchedEvent.endDate);

        if (end < now) setStatus('past');
        else if (start <= now && end >= now) setStatus('current');
        else setStatus('upcoming');
      } catch (error) {
        console.error('Failed to load event:', error);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-amber-50 to-gray-100 min-h-screen">
        <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-md font-medium text-red-900">{error}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-amber-50 to-gray-100 min-h-screen">
        <div className="text-center py-12 bg-white rounded-xl shadow-sm p-8">
          <svg
            className="mx-auto h-14 w-14 text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-xl font-semibold text-gray-800">Event not found</h3>
          <p className="mt-2 text-gray-600">The requested event could not be found.</p>
        </div>
      </div>
    );
  }

  const statusConfig = {
    upcoming: {
      color: 'bg-purple-100 text-purple-800',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      text: 'Upcoming'
    },
    current: {
      color: 'bg-teal-100 text-teal-800',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      ),
      text: 'Ongoing'
    },
    past: {
      color: 'bg-amber-100 text-amber-800',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      ),
      text: 'Past'
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-amber-50 to-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Event Header */}
        <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status].color}`}>
                  {statusConfig[status].icon}
                  <span className="ml-1.5">{statusConfig[status].text}</span>
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {event.type}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
              <p className="mt-3 text-lg text-gray-600">{event.description}</p>
            </div>
            {event.image && (
              <img 
                className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover shadow-md border-2 border-white" 
                src={event.image} 
                alt={event.name} 
              />
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Date & Time */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl shadow-sm border border-purple-100">
              <h3 className="text-sm font-medium text-purple-600 uppercase tracking-wider mb-3">Date & Time</h3>
              <div className="flex items-start">
                <svg className="flex-shrink-0 w-6 h-6 text-purple-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <div>
                  <p className="text-gray-900 font-medium">
                    {new Date(event.startDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-gray-600 mt-1">
                    {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {' '}
                    {new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gradient-to-br from-teal-50 to-white p-5 rounded-xl shadow-sm border border-teal-100">
              <h3 className="text-sm font-medium text-teal-600 uppercase tracking-wider mb-3">Location</h3>
              <div className="flex items-start">
                <svg className="flex-shrink-0 w-6 h-6 text-teal-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <div>
                  <p className="text-gray-900 font-medium">{event.location?.venue || 'Venue not specified'}</p>
                  <p className="text-gray-600 mt-1">{event.location?.address || 'Address not available'}</p>
                </div>
              </div>
            </div>

            {/* Registration Info */}
            <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl shadow-sm border border-indigo-100">
              <h3 className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-3">Registration</h3>
              <div className="flex items-start">
                <svg className="flex-shrink-0 w-6 h-6 text-indigo-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <div>
                  <p className="text-gray-900 font-medium capitalize">{event.registrationType} Registration</p>
                  <p className="text-gray-600 mt-1">
                    {event.maxAttendees ? `${attendeeCount}/${event.maxAttendees} attendees` : `${attendeeCount} attendees`}
                  </p>
                </div>
              </div>
            </div>

            {/* Organizer */}
            <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl shadow-sm border border-amber-100">
              <h3 className="text-sm font-medium text-amber-600 uppercase tracking-wider mb-3">Organizer</h3>
              <div className="flex items-start">
                <svg className="flex-shrink-0 w-6 h-6 text-amber-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <div>
                  <p className="text-gray-900 font-medium">{event.organizer?.name || 'Organizer not specified'}</p>
                  <p className="text-gray-600 mt-1">{event.organizer?.contact || 'Contact not available'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status-specific information */}
          <div className="border-t border-gray-200 pt-8">
            {status === 'upcoming' && (
              <div className="bg-purple-50 border-l-4 border-purple-500 p-5 rounded-lg shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-md font-semibold text-purple-800">Upcoming Event</h3>
                    <div className="mt-2 text-purple-700">
                      <p>This event hasn't started yet. Attendee and revenue data will be available once the event begins.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {status === 'current' && (
              <div className="bg-teal-50 border-l-4 border-teal-500 p-5 rounded-lg shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-md font-semibold text-teal-800">Event In Progress</h3>
                    <div className="mt-2 text-teal-700">
                      <p>This event is currently ongoing with <span className="font-medium">{attendeeCount}</span> attendees so far.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {status === 'past' && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-lg shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-md font-semibold text-amber-800">Event Concluded</h3>
                    <div className="mt-2 text-amber-700">
                      <p>This event has ended with <span className="font-medium">{attendeeCount}</span> total attendees.</p>
                      {event.registrationType === 'paid' && (
                        <p className="mt-2">
                          Total revenue generated: <span className="font-medium">₹{revenue.toLocaleString()}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;