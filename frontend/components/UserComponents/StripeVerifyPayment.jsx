// components/StripeVerifyPayment.jsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

// Load your Stripe public key (replace with your actual key)
const stripePromise = loadStripe('pk_test_YourPublicKeyHere');

const CheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Call backend to create payment intent for ₹1 (100 paise)
      const { data } = await axios.post('/api/payments/create-payment-intent', {
        amount: 100, // Amount in paise (₹1.00)
        currency: 'inr',
        purpose: 'user-verification',
      });

      const clientSecret = data.clientSecret;

      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          setError(null);
          setProcessing(false);
          onSuccess();
        }
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow">
      <CardElement className="mb-4 p-2 border" />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button
        disabled={!stripe || processing}
        className="bg-blue-600 text-white py-2 px-4 rounded w-full disabled:opacity-50"
      >
        {processing ? 'Processing...' : 'Pay ₹1 to Verify'}
      </button>
    </form>
  );
};

const StripeVerifyPayment = ({ onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm onSuccess={onSuccess} />
    </Elements>
  );
};

export default StripeVerifyPayment;
