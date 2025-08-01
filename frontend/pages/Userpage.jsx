import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserNavbar from '../components/UserComponents/UserNavbar.jsx';
import UpcomingEvents from '../components/UserComponents/UpcomingEvents.jsx';
import GetVerified from '../components/UserComponents/GetVerified.jsx';
import { 
  FaCalendarCheck, FaUsers, FaChartLine, FaStar, FaCalendarAlt, FaCog, FaMobileAlt 
} from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import UserFooter from '../components/UserComponents/UserFooter.jsx';
import { Sparkles, ArrowRight } from 'lucide-react';
import { assets } from '../src/assets/assets.js';
import { apiUrl } from '../utils/api';

const Userpage = () => {
  const [user, setUser] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/users/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleVerified = () => {
    setShowVerification(false);
    fetchUser();
    alert('Account verified successfully! You can now create events.');
  };

  const handleStartNewEvent = () => {
    if (!user) return;
    
    if (user.verifiedOrganizer) {
      navigate('/create-event');
    } else {
      setShowVerification(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white text-xl">Loading user data...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-red-400 text-xl">Failed to load user data. Please try again.</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-spin slow-spin"></div>
        </div>

        <UserNavbar user={user} />

        {/* Verification Modal */}
        {showVerification && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-md w-full relative">
              <button 
                onClick={() => setShowVerification(false)}
                className="absolute top-4 right-4 text-gray-300 hover:text-white"
              >
                ✕
              </button>
              <GetVerified 
                isVerified={user.verifiedOrganizer || false}
                onVerified={handleVerified}
              />
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className={`relative pt-24 pb-16 sm:py-24 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-10">
                <div className="mb-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 text-sm font-medium backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Welcome Back
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                  Hello, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{user.name || 'User'}</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 mb-8">
                  Your personalized event management dashboard is ready. 
                  Check your upcoming events, manage attendees, or create something new.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => navigate('/userpage/events')}
                    className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                  >
                    <span className="flex items-center">
                      Browse Events
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                  <button 
                    onClick={handleStartNewEvent}
                    className="group relative px-6 py-3 bg-transparent border border-white/30 text-white font-semibold rounded-xl hover:border-purple-400 hover:text-purple-300 transition-all duration-300 hover:scale-105"
                  >
                    {user.verifiedOrganizer ? 'Create Event' : 'Get Verified'}
                  </button>
                </div>
                {!user.verifiedOrganizer && (
                  <p className="mt-4 text-purple-300 font-semibold">
                    You must verify your account to create events.
                  </p>
                )}
              </div>

              <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: FaCalendarCheck, title: "Your Events", desc: "View and manage all your upcoming and past events", stat: "3 upcoming" },
                  { icon: FaUsers, title: "Attendees", desc: "Manage registrations and communicate with attendees", stat: "124 total" },
                  { icon: FaChartLine, title: "Event Analytics", desc: "Track performance and engagement metrics", stat: "View reports" },
                  { icon: MdPayment, title: "Revenue", desc: "View earnings and manage payouts", stat: "$2,450 earned" }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:bg-white/10 hover:border-purple-400/30 transition-all duration-500 hover:scale-[1.03]"
                  >
                    <item.icon className="text-purple-400 text-2xl mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{item.desc}</p>
                    <p className="text-purple-300 font-medium">{item.stat}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-16 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Upcoming Events</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6"></div>
            </div>
            <UpcomingEvents />
          </div>
        </section>

        {/* Create Event Section */}
        <section className="py-16 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Create <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Amazing Events</span>
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mb-6"></div>
                <p className="text-gray-300 mb-8 text-lg">
                  Our intuitive event creation wizard guides you through every step of the process,
                  from setting up your event details to customizing tickets and promotions.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    { icon: FaCog, text: "Easy-to-use event setup" },
                    { icon: MdPayment, text: "Multiple payment options" },
                    { icon: FaMobileAlt, text: "Mobile-friendly for attendees" }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 bg-purple-500/20 rounded-full p-2 mr-4">
                        <item.icon className="h-5 w-5 text-purple-300" />
                      </div>
                      <p className="text-gray-300">{item.text}</p>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={handleStartNewEvent}
                  className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center">
                    {user.verifiedOrganizer ? 'Start Creating Now' : 'Get Verified'}
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </div>
              <div className="lg:w-1/2 lg:pl-10 mt-10 lg:mt-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur-3xl"></div>
                  <img 
                    src={assets.eventCreate}
                    alt="Create event" 
                    className="relative rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-500 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 pt-20">
        <UserFooter />
      </div>
    </>
  );
};

export default Userpage;