import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Settings, LogOut, Bell, Search } from 'lucide-react';

const UserNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="relative bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm md:text-lg">E</span>
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                EventEase
              </span>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <div className="hidden lg:flex items-center space-x-6">
              <Link 
                to="/create-event" 
                className="text-gray-700 hover:text-violet-600 transition-colors duration-200 font-medium text-sm"
              >
                Create Event
              </Link>
              <Link 
                to="/userpage/events" 
                className="text-gray-700 hover:text-violet-600 transition-colors duration-200 font-medium text-sm"
              >
                Upcoming Events
              </Link>
              <Link 
                to="/my-event" 
                className="text-gray-700 hover:text-violet-600 transition-colors duration-200 font-medium text-sm"
              >
                My Events
              </Link>
              <Link 
                to="/registered" 
                className="text-gray-700 hover:text-violet-600 transition-colors duration-200 font-medium text-sm"
              >
                Registered
              </Link>
              <Link 
                to="/reviews" 
                className="text-gray-700 hover:text-violet-600 transition-colors duration-200 font-medium text-sm"
              >
                Reviews
              </Link>
            </div>

            <div className="relative mx-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-1.5 w-40 lg:w-56 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>

            <button 
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative ml-2">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                aria-expanded={isProfileOpen}
                aria-label="User profile"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium text-sm hidden lg:inline">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </button>

              {isProfileOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-fade-in"
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors duration-150"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-slide-down">
          <div className="px-4 py-3 space-y-3">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
              />
            </div>
            
            <Link 
              to="/create-event" 
              onClick={() => setIsMenuOpen(false)} 
              className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm"
            >
              Create Event
            </Link>
            <Link 
              to="/userpage/events" 
              onClick={() => setIsMenuOpen(false)} 
              className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm"
            >
              Upcoming Events
            </Link>
            <Link 
              to="/my-event" 
              onClick={() => setIsMenuOpen(false)} 
              className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm"
            >
              My Events
            </Link>
            <Link 
              to="/registered" 
              onClick={() => setIsMenuOpen(false)} 
              className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm"
            >
              Registered Events
            </Link>
            <Link 
              to="/reviews" 
              onClick={() => setIsMenuOpen(false)} 
              className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm"
            >
              Reviews
            </Link>
            
            <div className="pt-2 border-t border-gray-100 mt-2">
              <Link 
                to="/profile" 
                onClick={() => setIsMenuOpen(false)} 
                className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm flex items-center space-x-3"
              >
                <Settings className="w-4 h-4 text-gray-500" />
                <span>Profile Settings</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 font-medium text-sm flex items-center space-x-3"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;