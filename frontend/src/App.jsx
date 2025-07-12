import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Homepage from '../pages/Homepage';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import Userpage from '../pages/Userpage';
import Adminpage from '../pages/Adminpage';
import EventForm from '../components/UserComponents/EventForm';
import AllEvents from '../components/UserComponents/AllEvents';
import MyEvents from '../components/UserComponents/MyEvents';
import EventRegistration from '../components/UserComponents/EventRegistration';
import RegisteredPage from '../components/UserComponents/RegisteredPage';
import EventDetails from '../components/UserComponents/EventDetails';
import EventTickets from '../components/UserComponents/EventTickets';
import VerifyTicket from '../components/UserComponents/VerifyTicket';
import GetVerified from '../components/UserComponents/GetVerified';
import AdminEventDetails from '../components/AdminComponents/AdminEventDetails';
import FeedbackPage from '../components/UserComponents/FeedbackPage';
import FeedbackList from '../components/UserComponents/FeedbackList';
import ContactForm from '../components/ContactForm';
import PaymentPage from '../components/UserComponents/PaymentPage'
import PaidEventRegistration from '../components/UserComponents/PaidEventRegistration';

function App() {
  const [user, setUser] = useState(null);

  // Wrapper component for GetVerified with proper props
  const GetVerifiedWrapper = () => {
    return (
      <GetVerified 
        isVerified={user?.verifiedOrganizer || false}
        onVerified={() => {
          // Refresh user data after verification
          setUser(prev => ({ ...prev, verifiedOrganizer: true }));
          // You might want to add a toast notification here
        }}
      />
    );
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<ContactForm />} />
        
        {/* User Routes */}
        <Route 
          path="/userpage" 
          element={<Userpage user={user} setUser={setUser} />} 
        />
        <Route 
          path="/create-event" 
          element={<EventForm user={user} onSubmit={(data) => console.log('Event Created:', data)} />} 
        />
        <Route 
          path="/userpage/events" 
          element={<AllEvents user={user} />} 
        />
        <Route 
          path="/my-event" 
          element={<MyEvents user={user} />} 
        />
        <Route 
          path="/events/:eventId" 
          element={<EventDetails user={user} />} 
        />
        <Route 
          path="/events/:eventId/register/free" 
          element={<EventRegistration user={user} />} 
        />
        <Route 
          path="/events/:eventId/register/paid" 
          element={<PaidEventRegistration user={user} />} 
        />

        <Route 
          path="/registered" 
          element={<RegisteredPage user={user} />} 
        />
        <Route 
          path="/events/:eventId/ticket" 
          element={<EventTickets user={user} />} 
        />
        <Route 
          path="/verify-ticket" 
          element={<VerifyTicket user={user} />} 
        />
        <Route 
          path="/get-verified" 
          element={<GetVerifiedWrapper />} 
        />
        <Route 
          path="/reviews" 
          element={<FeedbackPage user={user} />} 
        />
        <Route 
          path="/feedback-list" 
          element={<FeedbackList/>} 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/adminpage" 
          element={<Adminpage />} 
        />
        <Route 
          path="/event-details/:eventId" 
          element={<AdminEventDetails />} 
        />
        <Route 
          path="/paymentpage" 
          element={<PaymentPage />} 
        />
      </Routes>
    </Router>
  );
}

export default App;