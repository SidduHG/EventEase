import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEnvelopeOpenText, FaHeadset, FaReply } from 'react-icons/fa';
import { FiAlertCircle } from 'react-icons/fi';
import { apiUrl } from '../../utils/api';

const SupportPortal = () => {
  const [queries, setQueries] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(apiUrl('/api/adminanalytics/contact'));
        setQueries(res.data);
      } catch (err) {
        setError('Failed to load queries. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQueries();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="p-3 rounded-lg bg-gradient-to-r from-teal-500 to-purple-600 shadow-lg mr-4">
            <FaHeadset className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Support Portal</h1>
            <p className="text-gray-500">Manage customer inquiries and support requests</p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start">
            <FiAlertCircle className="text-red-500 text-xl mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Error Loading Queries</h3>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-1.5 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-purple-500 border-b-transparent animate-spin animation-delay-150"></div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-purple-50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Customer Inquiries</h2>
                <span className="px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded-full">
                  {queries.length} {queries.length === 1 ? 'Query' : 'Queries'}
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {queries.length > 0 ? (
                    queries.map((q) => (
                      <tr key={q._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold">
                              {q.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{q.name}</div>
                              <div className="text-sm text-gray-500">{q.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-800 line-clamp-2">{q.message}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href={`mailto:${q.email}?subject=Response to your query&body=Hi ${q.name},%0D%0A%0D%0AWe received your message: "${q.message}"%0D%0A%0D%0A[Your Response Here]%0D%0A%0D%0AThanks,%0D%0AEventEase Support Team`}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 transition-all hover:shadow-md"
                          >
                            <FaReply className="mr-2" />
                            Respond
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FaEnvelopeOpenText className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-lg font-medium text-gray-900">No inquiries found</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            All customer messages will appear here when received.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination/Footer */}
            {queries.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{queries.length}</span> of{' '}
                  <span className="font-medium">{queries.length}</span> results
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SupportPortal;