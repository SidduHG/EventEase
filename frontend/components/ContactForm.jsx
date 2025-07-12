import { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaMobileAlt, FaUsers } from 'react-icons/fa';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/home/contact', formData);
      setSuccess(res.data.message);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setSuccess('Failed to send message. Try again later.');
    }
  };

  return (
    <section id="contact" className="py-16 bg-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions? Our team is here to help you with any inquiries.
          </p>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Contact Form */}
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full bg-indigo-800 border border-indigo-700 rounded-md py-2 px-3 text-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full bg-indigo-800 border border-indigo-700 rounded-md py-2 px-3 text-white"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium">Your Message</label>
                <textarea
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full bg-indigo-800 border border-indigo-700 rounded-md py-2 px-3 text-white"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-indigo-900 font-bold py-3 px-4 rounded-md transition duration-300"
              >
                Send Message
              </button>
              {success && <p className="mt-4 text-sm text-yellow-300">{success}</p>}
            </form>
          </div>

          {/* Contact Info */}
          <div className="md:w-1/2 md:pl-10">
            <div className="bg-indigo-800 bg-opacity-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-6">Get In Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-700 rounded-full p-2">
                    <FaEnvelope className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium">Email Us</p>
                    <p className="text-indigo-200">support@eventease.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-700 rounded-full p-2">
                    <FaMobileAlt className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium">Call Us</p>
                    <p className="text-indigo-200">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-700 rounded-full p-2">
                    <FaUsers className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium">Office Hours</p>
                    <p className="text-indigo-200">Mon - Fri: 9AM - 6PM</p>
                    <p className="text-indigo-200">Saturday: 10AM - 4PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
