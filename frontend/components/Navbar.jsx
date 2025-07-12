import { useState } from 'react';
import { FaCalendarAlt, FaStar, FaBars, FaTimes } from 'react-icons/fa';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Add scroll effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setScrolled(window.scrollY > 10);
    });
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-slate-900/90 backdrop-blur-sm border-b border-white/10 shadow-xl' : 'bg-gradient-to-b from-slate-900/80 to-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg group-hover:rotate-12 transition-transform">
              <FaCalendarAlt className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              EventEase
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="#about" 
              className="text-gray-300 hover:text-purple-300 transition-colors duration-300 font-medium flex items-center"
            >
              <Sparkles className="w-4 h-4 mr-1 text-purple-400" />
              About
            </Link>
            <Link 
              to="#events" 
              className="text-gray-300 hover:text-purple-300 transition-colors duration-300 font-medium flex items-center"
            >
              <FaCalendarAlt className="w-4 h-4 mr-1 text-purple-400" />
              Events
            </Link>
            <Link 
              to="#create" 
              className="text-gray-300 hover:text-purple-300 transition-colors duration-300 font-medium"
            >
              Create
            </Link>
            <Link 
              to="#testimonials" 
              className="text-gray-300 hover:text-purple-300 transition-colors duration-300 font-medium flex items-center"
            >
              <FaStar className="w-4 h-4 mr-1 text-purple-400" />
              Testimonials
            </Link>
            <div className="flex space-x-4 ml-4">
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-lg border border-white/30 text-white hover:border-purple-400 hover:text-purple-300 transition-all duration-300"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-purple-300 focus:outline-none transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-slate-900/95 backdrop-blur-lg border-t border-white/10 transition-all duration-300`}>
        <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
          <Link
            to="#about"
            className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-purple-300 transition-colors duration-300"
          >
            <Sparkles className="w-5 h-5 mr-3 text-purple-400" />
            About
          </Link>
          <Link
            to="#events"
            className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-purple-300 transition-colors duration-300"
          >
            <FaCalendarAlt className="w-5 h-5 mr-3 text-purple-400" />
            Events
          </Link>
          <Link
            to="#create"
            className="px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-purple-300 transition-colors duration-300"
          >
            Create Event
          </Link>
          <Link
            to="#testimonials"
            className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-purple-300 transition-colors duration-300"
          >
            <FaStar className="w-5 h-5 mr-3 text-purple-400" />
            Testimonials
          </Link>
          <div className="flex flex-col space-y-3 mt-4 px-4">
            <Link 
              to="/login"
              className="w-full text-center py-2 rounded-lg border border-white/30 text-white hover:border-purple-400 hover:text-purple-300 transition-all duration-300"
            >
              Login
            </Link>
            <Link 
              to="/signup"
              className="w-full text-center py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;