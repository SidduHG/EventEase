// EventSummaryCards.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiCalendar, FiTrendingUp, FiAward } from 'react-icons/fi';

const EventSummaryCards = () => {
  const [eventStats, setEventStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios.get('http://localhost:5000/api/adminanalytics/event-stats')
      .then(res => {
        setEventStats(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const cards = [
    {
      title: "Events This Week",
      value: eventStats.week || 0,
      icon: <FiCalendar className="text-2xl" />,
      color: "from-teal-400 to-teal-500"
    },
    {
      title: "Events This Month",
      value: eventStats.month || 0,
      icon: <FiTrendingUp className="text-2xl" />,
      color: "from-purple-400 to-purple-600"
    },
    {
      title: "Events This Year",
      value: eventStats.year || 0,
      icon: <FiAward className="text-2xl" />,
      color: "from-indigo-400 to-indigo-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {isLoading ? (
        Array(3).fill(0).map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 h-40 animate-pulse">
            <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 w-1/2 bg-gray-200 rounded mx-auto"></div>
          </div>
        ))
      ) : (
        cards.map((card, index) => (
          <div 
            key={index} 
            className={`bg-gradient-to-r ${card.color} rounded-xl shadow-lg overflow-hidden text-white transition-transform hover:scale-[1.02]`}
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-medium">{card.title}</h4>
                <div className="p-2 bg-white/20 rounded-lg">
                  {card.icon}
                </div>
              </div>
              <div className="mt-auto">
                <p className="text-3xl font-bold">{card.value}</p>
                <div className="h-1 w-full bg-white/30 mt-2">
                  <div 
                    className="h-full bg-white transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min(100, card.value / 10 * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EventSummaryCards;