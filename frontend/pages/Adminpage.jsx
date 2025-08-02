import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCalendar, FiUsers, FiPieChart, FiSettings, FiUser, FiArrowUp, FiAlertCircle, FiChevronDown } from 'react-icons/fi';
import { FiTag } from "react-icons/fi";
import FilteredEventList from '../components/AdminComponents/FilteredEvents';
import EventSummaryCards from '../components/AnalyticsComponents/EventSummaryCards';
import EventTypePieChart from '../components/AnalyticsComponents/EventTypePieChart';
import TopOrganizersList from '../components/AnalyticsComponents/TopOrganizersList';
import UserSignupsLineChart from '../components/AnalyticsComponents/UserSignupsLineChart';
import SupportPortalComponent from '../components/AdminComponents/SupportPortal';
import {apiUrl} from '../utils/api';

const Adminpage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalAttendees: 0,
    revenue: 0
  });
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(apiUrl(`/api/admindashboard/stats`));
        const data = await response.data;
        setStats({
          totalEvents: data.totalEvents,
          activeEvents: data.activeEvents,
          totalAttendees: data.totalAttendees,
          revenue: 145000,
        })
      } catch (err) {
        console.error('Fetch failed:', err);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [])

  // Recent events
  useEffect(() => {
    const fetchRecentEvents = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(apiUrl(`/api/admindashboard/recent-events`));
        setEvents(response.data.recentEvents || []);
      } catch (err) {
        console.log('Failed to fetch events', err);
        setEvents([]);
      }
      setIsLoading(false);
    };
    fetchRecentEvents();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'events':
        return <EventsTab events={events} />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'SupportPortal':
        return <SupportPortal />;
      default:
        return <DashboardTab stats={stats} events={events} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gradient-to-b from-blue-800 to-blue-500 shadow-xl">
          <div className="flex items-center h-20 px-6">
            <h1 className="text-white text-2xl font-bold flex items-center">
              <FiCalendar className="mr-3 text-emerald-300" /> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-200">
                EventEase
              </span>
            </h1>
          </div>
          <div className="flex flex-col flex-grow px-4 py-8 overflow-y-auto">
            <nav className="flex-1 space-y-3">
              <NavItem 
                icon={<FiCalendar className="text-emerald-200" />} 
                active={activeTab === 'dashboard'} 
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </NavItem>
              <NavItem 
                icon={<FiTag className="text-emerald-200" />} 
                active={activeTab === 'events'} 
                onClick={() => setActiveTab('events')}
              >
                Events
              </NavItem>
              <NavItem 
                icon={<FiPieChart className="text-emerald-200" />} 
                active={activeTab === 'analytics'} 
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </NavItem>
              <NavItem 
                icon={<FiUser className="text-emerald-200" />} 
                active={activeTab === 'SupportPortal'} 
                onClick={() => setActiveTab('SupportPortal')}
              >
                Support Portal
              </NavItem>
            </nav>
            <div className="mt-auto px-4 py-6">
              <div className="bg-emerald-900/30 rounded-lg p-4">
                <p className="text-emerald-100 text-sm">Need help?</p>
                <p className="text-emerald-50 font-medium">Contact our support team</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10 border-b border-gray-200/70">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button className="md:hidden mr-4 text-gray-600 hover:text-emerald-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <h2 className="text-lg font-semibold text-gray-800 capitalize">
                {activeTab}
              </h2>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 group"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                      <FiUser className="text-white" />
                    </div>
                    <span className="hidden md:inline text-gray-700 ml-3 mr-2 font-medium">Admin</span>
                    <FiChevronDown className={`transition-transform ${showDropdown ? 'transform rotate-180' : ''} text-gray-500`} />
                  </div>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-20 border border-gray-100">
                    <a href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center">
                      <FiUser className="mr-3 text-emerald-500" /> Profile
                    </a>
                    <a href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center">
                      <FiSettings className="mr-3 text-emerald-500" /> Settings
                    </a>
                    <div className="border-t border-gray-100 my-1"></div>
                    <a href="/" className="block px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-5 py-3 text-sm font-medium rounded-lg w-full transition-all ${active 
      ? 'bg-emerald-900/20 text-white shadow-md' 
      : 'text-emerald-100 hover:bg-emerald-800/30 hover:text-white hover:shadow-sm'}`}
  >
    <span className="mr-3 text-lg">{icon}</span>
    {children}
  </button>
);

const DashboardTab = ({ stats, events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Total Events" 
          value={stats.totalEvents} 
          icon={<FiCalendar className="text-emerald-500" />} 
          trend="up" 
          trendValue="12%"
          color="emerald"
        />
        <StatCard 
          title="Active Events" 
          value={stats.activeEvents} 
          icon={<FiCalendar className="text-amber-500" />} 
          trend="up" 
          trendValue="5%"
          color="amber"
        />
        <StatCard 
          title="Total Attendees" 
          value={stats.totalAttendees.toLocaleString()} 
          icon={<FiUsers className="text-blue-500" />} 
          trend="up" 
          trendValue="8%"
          color="blue"
        />
        <StatCard 
          title="Revenue" 
          value={`$${stats.revenue.toLocaleString()}`} 
          icon={<FiPieChart className="text-purple-500" />} 
          trend="up" 
          trendValue="15%"
          color="purple"
        />
      </div>

      {/* Recent Events list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/70 bg-gradient-to-r from-emerald-50 to-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FiCalendar className="mr-2 text-emerald-600" />
            Recent Events
          </h3>
        </div>
        <div className="divide-y divide-gray-200/50">
          {events.length > 0 ? (
            events.map(event => (
              <div key={event._id} className="p-5 flex justify-between items-center hover:bg-gray-50/80 transition-colors">
                <div>
                  <h4 className="font-semibold text-gray-800">{event.name}</h4>
                  <p className="text-sm text-gray-500 mt-1 flex items-center">
                    <FiCalendar className="mr-1.5 text-gray-400" />
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedEvent(event)} 
                  className="px-4 py-1.5 text-sm font-medium rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors shadow-sm"
                >
                  View
                </button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-400">No recent events found</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-30 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 animate-slideUp">
            <div className="flex justify-between items-start mb-5">
              <h2 className="text-2xl font-bold text-gray-800">{selectedEvent.name}</h2>
              <button 
                onClick={() => setSelectedEvent(null)} 
                className="text-gray-400 hover:text-gray-600 text-xl transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{selectedEvent.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Event Type</h3>
                  <p className="text-gray-600 capitalize">{selectedEvent.type}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Dates</h3>
                  <p className="text-gray-600">
                    {new Date(selectedEvent.startDate).toLocaleString()} -<br />
                    {new Date(selectedEvent.endDate).toLocaleString()}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Location</h3>
                  <p className="text-gray-600">
                    {selectedEvent.location.type === 'physical' 
                      ? selectedEvent.location.address 
                      : selectedEvent.location.url}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Capacity</h3>
                  <p className="text-gray-600">{selectedEvent.maxAttendees} attendees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/70">
          <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
            <FiUsers className="mr-2 text-blue-500" />
            Event Attendance
          </h3>
          <div className="h-64">
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg border border-gray-200/50">
              <p className="text-gray-400">Attendance visualization will appear here</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/70">
          <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
            <FiPieChart className="mr-2 text-purple-500" />
            Revenue Overview
          </h3>
          <div className="h-64">
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-50 to-gray-50 rounded-lg border border-gray-200/50">
              <p className="text-gray-400">Revenue visualization will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, trendValue, color }) => {
  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  };

  return (
    <div className={`p-5 rounded-xl shadow-sm border border-gray-200/70 ${colorClasses[color].bg} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-2xl font-bold ${colorClasses[color].text} mt-2`}>{value}</p>
          <div className={`flex items-center mt-3 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? 
              <FiArrowUp className="mr-1.5" /> : 
              <FiAlertCircle className="mr-1.5" />}
            <span className="text-xs font-medium">{trendValue} from last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color].iconBg} ${colorClasses[color].iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const EventsTab = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200/70 bg-gradient-to-r from-emerald-50 to-gray-50">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <FiTag className="mr-2 text-emerald-600" />
        All Events
      </h3>
    </div>
    <FilteredEventList />
  </div>
);

const AnalyticsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-6">
      <EventSummaryCards />
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-6">
      <EventTypePieChart />
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-6">
      <TopOrganizersList />
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-6">
      <UserSignupsLineChart />
    </div>
  </div>
);

const SupportPortal = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 overflow-hidden">
    <SupportPortalComponent />
  </div>
);

export default Adminpage;