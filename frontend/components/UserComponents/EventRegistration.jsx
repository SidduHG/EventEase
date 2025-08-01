import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventRegistration = ({user}) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/events/${eventId}`);
        if (response.data.registrationType !== 'free') {
          alert('This registration is only available for free events.');
          navigate('/'); // Redirect to home or appropriate page
          return;
        }
        setEventData(response.data);
      } catch (err) {
        console.error('Error fetching event:', err);
      }
    };
    fetchData();
  }, [eventId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`${apiUrl}/api/registrations`, {
        ...formData,
        event: eventId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      console.log('Registration successful:', response.data);
      alert('Registration successful!');
      navigate('/registered'); // Success page
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!eventData) {
    return <p>Loading event details...</p>;
  }

  return (
    <>
      <div>
        <h2><b>Event Name:</b> {eventData.name}</h2>
        <p><b>Description:</b> {eventData.description}</p>
        <p><b>Address:</b> {eventData.location?.address}</p>
        <h3><b>Organizer Email:</b> {eventData.organizer?.email}</h3>
        <p><b>Event Start Date:</b> {new Date(eventData.startDate).toLocaleString()}</p>
        <p><b>Event End Date:</b> {new Date(eventData.endDate).toLocaleString()}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Full Name:</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Register'}
        </button>
      </form>
    </>
  );
};

export default EventRegistration;