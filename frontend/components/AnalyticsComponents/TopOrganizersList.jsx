// TopOrganizersList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiAward, FiUser, FiTrendingUp } from 'react-icons/fi';

const TopOrganizersList = () => {
  const [topOrganizers, setTopOrganizers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios.get('http://localhost:5000/api/adminanalytics/top-organizers')
      .then(res => {
        setTopOrganizers(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center">
        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white mr-4">
          <FiAward className="text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Top Organizers</h3>
          <p className="text-sm text-gray-500">Most active event organizers</p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : topOrganizers.length > 0 ? (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topOrganizers.map((org, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="relative">
                <img
                  src={org.profileImage || '/default-avatar.png'}
                  alt={org.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                />
                {index < 3 && (
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                  }`}>
                    {index + 1}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800 flex items-center">
                  {org.name}
                  {index < 3 && (
                    <FiTrendingUp className={`ml-2 ${
                      index === 0 ? 'text-yellow-500' : 
                      index === 1 ? 'text-gray-400' : 'text-amber-600'
                    }`} />
                  )}
                </p>
                <p className="text-sm text-gray-500 flex items-center">
                  <FiUser className="mr-1" />
                  {org.events} {org.events === 1 ? 'event' : 'events'} organized
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-400">
          <FiUser className="mx-auto text-4xl mb-2" />
          <p>No organizer data available</p>
        </div>
      )}
    </div>
  );
};

export default TopOrganizersList;