import React, { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../utils/api';

// Load Razorpay SDK
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const GetVerified = ({ isVerified, onVerified = () => {} }) => {
  const [loading, setLoading] = useState(false);

  const handleRazorpayPayment = async () => {
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK");
      setLoading(false);
      return;
    }

    try {
      const { data: order } = await axios.post(`${apiUrl}/api/payment/create-order`, {
        amount: 1
      });

      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User ID missing. Please log in again.");
        setLoading(false);
        return;
      }

      const options = {
        key: "rzp_test_hZphwB1deRBvWD",
        amount: order.amount,
        currency: order.currency,
        name: "EventEase",
        description: "Organizer Verification Fee",
        order_id: order.id,


        handler: async function (response) {
          try {
            const verifyRes = await axios.post(`${apiUrl}/api/payment/verify-payment`, {
              ...response
            }, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}` // ✅ if token needed
              }
            });

                    console.log('Verification response:', verifyRes.data); // Add logging

            if (verifyRes.data.success) {
              alert("Verification successful! You can now publish events.");
              onVerified();
            } else {
              alert(`Payment verification failed: ${verifyRes.data.message || 'Unknown error'}`);
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert(`Error: ${err.response?.data?.message || err.message || 'Server error'}`);
          }
        },
        prefill: {
          name: "EventEase User",
          email: "test@example.com"
        },
        theme: {
          color: "#2563eb"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Order creation error:", error);
      alert("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      {isVerified ? (
        <div className="text-center text-green-600">
          <h2 className="text-2xl font-bold mb-2">You're Verified ✅</h2>
          <p>You can now publish events freely.</p>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold text-red-600 mb-2">Verification Required ❌</h2>
          <p className="mb-4">You must verify your account to publish events.</p>

          <ul className="bg-gray-100 p-3 mb-4 text-sm text-gray-700 list-disc list-inside">
            <li>Instant publishing</li>
            <li>Higher search visibility</li>
            <li>Trusted Organizer badge</li>
          </ul>

          <button
            onClick={handleRazorpayPayment}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Processing..." : "Pay ₹1 to Verify"}
          </button>
        </>
      )}
    </div>
  );
};

export default GetVerified;