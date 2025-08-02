import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaStar as Star, FaQuoteLeft as Quote, FaArrowRight as ArrowRight, FaUser } from 'react-icons/fa';
import { apiUrl } from '../../utils/api';

const FeedbackList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate=useNavigate();
  useEffect(() => {
  
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(apiUrl('/api/feedback'));
        
        // Debug log to verify response structure
        console.log('Fetched feedback response:', response.data);

        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          setReviews(response.data);
        } else if (Array.isArray(response.data.reviews)) {
          setReviews(response.data.reviews);  // In case it's wrapped in a reviews object
        } else {
          throw new Error("Unexpected response format");
        }
        
      } catch (err) {
        console.error('Failed to fetch feedback:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };


    fetchReviews();
  }, []);

  const previewReviews = reviews.slice(0, 3).map(review => ({
    ...review,
    name: review.name || "Anonymous",
    rating: review.rating || 5,
    comment: review.comment || "Great event management platform!",
    avatar: review.avatar || <FaUser className="w-12 h-12 rounded-full object-cover mr-4 text-purple-600 bg-purple-100 p-3" />
  }));

  return (
    <section id="reviews" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-sm font-medium mb-4">
            Customer Stories
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Loved by Event Creators
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto mb-6"></div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-purple-200 border-l-purple-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">
            <p>{error}</p>
          </div>
        ) : previewReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {previewReviews.map((review, index) => (
              <div key={index} className={`group p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 transform delay-${index * 100}`}>
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-purple-300 mb-4" />
                
                <p className="text-gray-700 text-lg italic mb-6 leading-relaxed">
                  "{review.comment}"
                </p>

                <div className="flex items-center">
                  {typeof review.avatar === 'string' ? (
                    <img 
                      src={review.avatar} 
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                  ) : (
                    review.avatar
                  )}
                  <div>
                    <p className="font-bold text-gray-900">{review.name}</p>
                    <p className="text-purple-600 text-sm">
                      {new Date(review.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No reviews available yet</p>
          </div>
        )}

        <div className="text-center">
          <button className="group px-8 py-4 border-2 border-purple-200 text-purple-700 font-semibold rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 cursor-pointer"
          onClick={()=>navigate('/feedback-list')}>
            <span className="flex items-center">
              Read More Reviews
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeedbackList;