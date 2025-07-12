import { useState } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaLink, FaMapMarkerAlt, FaMoneyBillWave, FaTicketAlt, FaTrash, FaPlus } from 'react-icons/fa';

const EventForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    type: initialData.type || 'conference',
    description: initialData.description || '',
    startDate: initialData.startDate ? new Date(initialData.startDate) : new Date(),
    endDate: initialData.endDate ? new Date(initialData.endDate) : new Date(),
    location: {
      type: initialData.location?.type || 'physical',
      address: initialData.location?.address || '',
      url: initialData.location?.url || ''
    },
    registrationType: initialData.registrationType || 'free',
    maxAttendees: initialData.maxAttendees || '',
    tickets: initialData.tickets || [],
  });

  const [newTicket, setNewTicket] = useState({
    price: '',
    quantity: '',
    saleStart: new Date(),
    saleEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      maxAttendees: formData.maxAttendees === '' ? null : Number(formData.maxAttendees),
      startDate: formData.startDate.toISOString(),
      endDate: formData.endDate.toISOString(),
      tickets: formData.tickets.map(ticket => ({
        ...ticket,
        saleStart: ticket.saleStart.toISOString(),
        saleEnd: ticket.saleEnd.toISOString()
      }))
    };

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/events', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 201) {
        alert('Event created successfully!');
        onSubmit(res.data);
      } else {
        throw new Error('Unexpected response status: ' + res.status);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to create event');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6">
      <form 
        onSubmit={handleSubmit} 
        className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl"
      >
        <h2 className="text-3xl font-bold text-white mb-6">
          {initialData.name ? 'Edit Event' : 'Create New Event'}
        </h2>

        {/* Event Information Section */}
        <div className="mb-10 bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-purple-300 mb-6 flex items-center">
            <FaCalendarAlt className="mr-2" />
            Event Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Event Name</label>
              <input
                type="text"
                value={formData.name}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Event Type</label>
              <select
                value={formData.type}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="conference" className="bg-gray-800">Conference</option>
                <option value="workshop" className="bg-gray-800">Workshop</option>
                <option value="concert" className="bg-gray-800">Concert</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                required
                rows={4}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Start Date</label>
              <DatePicker
                selected={formData.startDate}
                onChange={(date) => setFormData({ ...formData, startDate: date })}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">End Date</label>
              <DatePicker
                selected={formData.endDate}
                onChange={(date) => setFormData({ ...formData, endDate: date })}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={formData.startDate}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Location Details Section */}
        <div className="mb-10 bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-purple-300 mb-6 flex items-center">
            <FaMapMarkerAlt className="mr-2" />
            Location Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Location Type</label>
              <select
                value={formData.location.type}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, type: e.target.value } })}
              >
                <option value="physical" className="bg-gray-800">Physical</option>
                <option value="virtual" className="bg-gray-800">Virtual</option>
                <option value="hybrid" className="bg-gray-800">Hybrid</option>
              </select>
            </div>

            {formData.location.type === 'physical' ? (
              <div>
                <label className="block text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.location.address}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })}
                />
              </div>
            ) : (
              <div>
                <label className="block text-gray-300 mb-2">Event URL</label>
                <input
                  type="url"
                  value={formData.location.url}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, url: e.target.value } })}
                />
              </div>
            )}
          </div>
        </div>

        {/* Registration Details Section */}
        <div className="mb-10 bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-purple-300 mb-6 flex items-center">
            <FaTicketAlt className="mr-2" />
            Registration Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Registration Type</label>
              <select
                value={formData.registrationType}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onChange={(e) => setFormData({ ...formData, registrationType: e.target.value })}
              >
                <option value="free" className="bg-gray-800">Free</option>
                <option value="paid" className="bg-gray-800">Paid</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Maximum Attendees</label>
              <input
                type="number"
                min="1"
                value={formData.maxAttendees}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                placeholder="Leave empty for unlimited"
              />
            </div>
          </div>
        </div>

        {formData.registrationType === 'paid' && (
          <div className="mb-10 bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-purple-300 mb-6 flex items-center">
              <FaMoneyBillWave className="mr-2" />
              Ticket Options
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">  
              <div>
                <label className="block text-gray-300 mb-2">Price ($)</label>
                <input
                  type="number"
                  placeholder="99.99"
                  step="0.01"
                  min="0"
                  value={newTicket.price}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onChange={(e) => setNewTicket({ ...newTicket, price: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Quantity Available</label>
                <input
                  type="number"
                  placeholder="100"
                  min="1"
                  value={newTicket.quantity}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onChange={(e) => setNewTicket({ ...newTicket, quantity: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-gray-300 mb-2">Sale Start Date</label>
                <DatePicker
                  selected={newTicket.saleStart}
                  onChange={(date) => setNewTicket({ ...newTicket, saleStart: date })}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Sale End Date</label>
                <DatePicker
                  selected={newTicket.saleEnd}
                  onChange={(date) => setNewTicket({ ...newTicket, saleEnd: date })}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={newTicket.saleStart}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={!newTicket.price || newTicket.price <= 0}
              className="flex items-center px-4 py-2 bg-purple-600/50 border border-purple-400/50 rounded-lg text-purple-100 hover:bg-purple-600/70 hover:border-purple-400/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                setFormData({ 
                  ...formData, 
                  tickets: [...formData.tickets, newTicket] 
                });
                setNewTicket({
                  price: '',
                  quantity: '',
                  saleStart: new Date(),
                  saleEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                });
              }}
            >
              <FaPlus className="mr-2" />
              Add Ticket Option
            </button>

            {formData.tickets.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-300 mb-4">Added Tickets</h4>
                <div className="space-y-3">
                  {formData.tickets.map((ticket, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center bg-white/5 border border-white/10 rounded-lg p-4"
                    >
                      <div>
                        <h5 className="font-medium text-white">${ticket.price} Ticket</h5>
                        <p className="text-sm text-gray-400">
                          {ticket.quantity || 'Unlimited'} available | 
                          Sale: {ticket.saleStart.toLocaleDateString()} - {ticket.saleEnd.toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-red-400 hover:text-red-300 p-2"
                        onClick={() => {
                          const updatedTickets = [...formData.tickets];
                          updatedTickets.splice(index, 1);
                          setFormData({ ...formData, tickets: updatedTickets });
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button 
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
          >
            {initialData.name ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;