// EventTypePieChart.jsx
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';
import { FiPieChart } from 'react-icons/fi';
import { apiUrl } from '../../utils/api';
 

const COLORS = [
  'rgba(20, 184, 166, 0.8)',  // teal
  'rgba(124, 58, 237, 0.8)',  // purple
  'rgba(79, 70, 229, 0.8)',   // indigo
  'rgba(16, 185, 129, 0.8)',  // emerald
  'rgba(139, 92, 246, 0.8)',  // violet
  'rgba(99, 102, 241, 0.8)'   // indigo-light
];

const EventTypePieChart = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
     axios.get(apiUrl('/api/adminanalytics/event-type-stats'))
      .then(res => {
        setEventTypes(res.data);
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
        <div className="p-3 rounded-lg bg-gradient-to-r from-teal-500 to-purple-600 text-white mr-4">
          <FiPieChart className="text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Event Type Breakdown</h3>
          <p className="text-sm text-gray-500">Distribution of events by category</p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : eventTypes.length > 0 ? (
        <div className="p-4">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={eventTypes}
                dataKey="value"
                nameKey="type"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {eventTypes.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} events`, 'Count']}
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.96)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              />
              <Legend 
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span className="text-gray-700 text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 flex flex-col items-center justify-center text-gray-400">
          <FiPieChart className="text-4xl mb-2" />
          <p>No event type data available</p>
        </div>
      )}
    </div>
  );
};

export default EventTypePieChart;