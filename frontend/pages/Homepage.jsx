import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  CheckCircle2 as CheckCircle, 
  Ticket, 
  BarChart2 as BarChart3,
  Settings, 
  Smartphone, 
  CreditCard, 
  Shield, 
  Globe, 
  Clock,
  TrendingUp,
  Sparkles, 
  ArrowRight,
  User
} from 'lucide-react';
import { assets } from '../src/assets/assets';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeedbackList from '../components/UserComponents/FeedbackList';

const Homepage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call with mock data
    setTimeout(() => {
      setReviews([]);
      setLoading(false);
    }, 1000);

    setIsVisible(true);
  }, []);

  const events = [
    {
      id: 1,
      title: "Global Tech Summit 2024",
      date: "March 15-17, 2024",
      location: "San Francisco, CA",
      category: "Conference",
      attendees: 2500,
      image:assets.event1
    },
    {
      id: 2,
      title: "Digital Marketing Masterclass",
      date: "April 5, 2024",
      location: "Online",
      category: "Workshop",
      attendees: 850,
      image: assets.event2
    },
    {
      id: 3,
      title: "Startup Networking Gala",
      date: "May 20, 2024",
      location: "New York, NY",
      category: "Networking",
      attendees: 1200,
      image: assets.event3
    }
  ];

  const features = [
    {
      icon: CheckCircle,
      title: "Smart Scheduling",
      description: "AI-powered calendar optimization and conflict resolution",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: Ticket,
      title: "Dynamic Ticketing",
      description: "Customizable tickets with real-time pricing and promotions",
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: Users,
      title: "Attendee Insights",
      description: "Deep analytics and engagement tracking for better experiences",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: BarChart3,
      title: "Live Analytics",
      description: "Real-time dashboards with actionable business intelligence",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const stats = [
    { icon: Globe, value: "15K+", label: "Events Hosted", color: "text-blue-600" },
    { icon: Users, value: "2M+", label: "Happy Attendees", color: "text-purple-600" },
    { icon: TrendingUp, value: "98%", label: "Success Rate", color: "text-emerald-600" },
    { icon: Clock, value: "24/7", label: "Support", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-spin slow-spin"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Content */}
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="mb-4 sm:mb-6">
                <span className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 text-xs sm:text-sm font-medium backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  The Future of Event Management
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                Create
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Extraordinary</span>
                <br />Events
              </h1>
              
              <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl">
                Transform your vision into unforgettable experiences with our cutting-edge platform. 
                From intimate gatherings to massive conferences, we make event magic happen.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
                <button 
                  className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg sm:rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg sm:hover:shadow-2xl hover:shadow-purple-500/50"
                  onClick={() => navigate('/login')}
                >
                  <span className="flex items-center text-sm sm:text-base">
                    Start Creating
                    <ArrowRight className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className={`transform transition-all duration-500 delay-${index * 100}`}>
                    <div className="text-center p-2 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 ${stat.color}`} />
                      <div className="text-lg sm:text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Feature Cards */}
            <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`group p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500 delay-${index * 100} hover:scale-[1.03] sm:hover:scale-105 hover:shadow-lg sm:hover:shadow-2xl`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-300`}>
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              About EventEase
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Redefining Event Excellence
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-4 sm:mb-6"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div className="relative order-last lg:order-first">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl sm:rounded-3xl blur-3xl"></div>
              <img 
                src={assets.event3}
                alt="Event planning excellence" 
                className="relative rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl hover:scale-[1.02] sm:hover:scale-105 transition-transform duration-500 w-full"
              />
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Our Mission</h3>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                  Since 2018, we've been on a mission to democratize event management. 
                  We believe every event, regardless of size, deserves professional-grade tools 
                  and seamless execution.
                </p>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  Our platform combines cutting-edge technology with intuitive design, 
                  empowering organizers to create extraordinary experiences while eliminating 
                  the stress traditionally associated with event planning.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {[
                  { icon: Globe, label: "15,000+ Events Powered", color: "bg-blue-100 text-blue-600" },
                  { icon: Users, label: "2M+ Connected Attendees", color: "bg-purple-100 text-purple-600" },
                  { icon: Shield, label: "Enterprise-Grade Security", color: "bg-emerald-100 text-emerald-600" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${item.color} flex items-center justify-center mr-3 sm:mr-4`}>
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <p className="text-sm sm:text-lg font-semibold text-gray-900">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              Featured Events
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Discover Amazing Events
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our curated selection of upcoming events or create your own to share with the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {events.map((event, index) => (
              <div 
                key={event.id} 
                className={`group bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] sm:hover:scale-105 transform delay-${index * 100}`}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <span className="px-2 py-1 sm:px-3 sm:py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium text-gray-700">
                      {event.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-purple-600 transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center text-sm sm:text-base text-gray-600">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm sm:text-base text-gray-600">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm sm:text-base text-gray-600">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-500" />
                      <span>{event.attendees.toLocaleString()} attendees</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button 
              className="group px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl hover:shadow-lg sm:hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] sm:hover:scale-105"
              onClick={() => navigate('/login')}
            >
              <span className="flex items-center text-sm sm:text-base">
                Explore All Events
                <ArrowRight className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Create Event Section */}
      <section id="create" className="py-16 sm:py-24 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div className="order-last lg:order-first">
              <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                Event Creation
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Launch Your Event in
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Minutes</span>
              </h2>
              <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mb-6 sm:mb-8"></div>
              
              <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Our intuitive creation wizard transforms complex event planning into a seamless, 
                enjoyable experience. From concept to launch in just a few clicks.
              </p>

              <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
                {[
                  { icon: Settings, title: "Smart Setup Wizard", desc: "AI-guided configuration for optimal results" },
                  { icon: CreditCard, title: "Flexible Payment Options", desc: "Multiple gateways with automatic processing" },
                  { icon: Smartphone, title: "Mobile-First Design", desc: "Perfect experience across all devices" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="group px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg sm:rounded-xl hover:shadow-lg sm:hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] sm:hover:scale-105"
                onClick={() => navigate('/login')}
              >
                <span className="flex items-center text-sm sm:text-base">
                  Start Creating Now
                  <ArrowRight className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl sm:rounded-3xl blur-3xl"></div>
              <img 
                src={assets.eventCreate}
                alt="Create amazing events" 
                className="relative rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl hover:scale-[1.02] sm:hover:scale-105 transition-transform duration-500 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-16 sm:py-24 bg-white">
        <FeedbackList />   
      </section>
      
      <Footer />
    </div>
  );
};

export default Homepage;