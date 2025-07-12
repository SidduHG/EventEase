import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', user._id);
      localStorage.setItem('userData', JSON.stringify({
        _id: user._id,
        email: user.email,
        role: user.role,
        verifiedOrganizer: user.verifiedOrganizer
      }));

      if (user.role === 'admin') {
        navigate('/adminpage');
      } else {
        navigate('/userpage');
      }
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} w-full max-w-md`}>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02]">
            <div className="mb-6 text-center">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 text-sm font-medium backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Welcome Back
              </span>
            </div>

            <h2 className="text-3xl font-bold text-center text-white mb-6">
              Sign in to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">EventEase</span>
            </h2>

            {err && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-400/30 rounded-lg text-red-300 text-center font-medium">
                {err}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                className="group relative w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.03] overflow-hidden"
              >
                <span className="flex items-center justify-center">
                  Login
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 blur opacity-50 group-hover:opacity-75 transition-opacity -z-10"></div>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-purple-400 hover:text-pink-400 font-medium hover:underline transition-colors duration-300"
                >
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
