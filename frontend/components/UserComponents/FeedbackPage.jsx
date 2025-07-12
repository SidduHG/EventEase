import React, { useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

const FeedbackPage = () => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0 || !comment) {
      setStatus('Please provide a star rating and comment.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/feedback', {
        name,
        rating,
        comment
      });

      setStatus('✅ Thank you for your feedback!');
      setName('');
      setRating(0);
      setComment('');
    } catch (err) {
      setStatus('❌ Error submitting feedback. Try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Rate your EventEase Experience</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <div className="flex justify-center items-center space-x-1">
          {[...Array(5)].map((_, i) => {
            const starValue = i + 1;
            return (
              <label key={i}>
                <input
                  type="radio"
                  name="rating"
                  value={starValue}
                  className="hidden"
                  onClick={() => setRating(starValue)}
                />
                <FaStar
                  size={30}
                  className="cursor-pointer transition"
                  color={starValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(null)}
                />
              </label>
            );
          })}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your feedback about the portal..."
          rows="4"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
        >
          Submit Feedback
        </button>

        {status && <p className="text-center mt-3 text-sm text-green-600">{status}</p>}
      </form>
    </div>
  );
};

export default FeedbackPage;
