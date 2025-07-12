// RecentFeedbackTable.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecentFeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/feedbacks')
      .then(res => setFeedbacks(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h3 className="text-xl font-semibold mb-4">Recent Feedback</h3>
      <ul className="divide-y">
        {feedbacks.map((fb, i) => (
          <li key={i} className="py-2">
            <p className="font-medium">{fb.event}</p>
            <p className="text-sm text-gray-600">{fb.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentFeedbackTable;
