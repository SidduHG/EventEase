// UserSignupsLineChart.jsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';
import { FiUsers, FiActivity } from 'react-icons/fi';

const UserSignupsLineChart = () => {
  const [signups, setSignups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios.get('http://localhost:5000/api/adminanalytics/user-signups')
      .then(res => {
        setSignups(res.data);
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
        <div className="p-3 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 text-white mr-4">
          <FiUsers className="text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">User Signups</h3>
          <p className="text-sm text-gray-500">Growth over time</p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : signups.length > 0 ? (
        <div className="p-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={signups}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#6b7280' }}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fill: '#6b7280' }}
                tickMargin={10}
              />
              <Tooltip 
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.96)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
                itemStyle={{ color: '#4f46e5' }}
                labelStyle={{ fontWeight: 'bold', color: '#111827' }}
              />
              <Legend 
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingTop: '10px' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                name="Signups"
                stroke="#4f46e5" 
                strokeWidth={2}
                dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#6366f1' }}
              />
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                name="Total Users"
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#34d399' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 flex flex-col items-center justify-center text-gray-400">
          <FiActivity className="text-4xl mb-2" />
          <p>No signup data available</p>
        </div>
      )}
    </div>
  );
};

export default UserSignupsLineChart;