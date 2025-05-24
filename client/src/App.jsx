import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [message, setMessage] = useState('');

  const handleUpgrade = async (tier) => {
    const amount = tier === 'boost' ? 900 : 4900;
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}'/api/create-upgrade-session`, {
        finalistId: 'FIN_123',
        tier,
        amount
      });
      console.log('Mock Stripe Session ID:', res.data.sessionId);
      setMessage(`✅ You're featured! (mock stripe_session_id: ${res.data.sessionId})`);
    } catch (err) {
      console.error(err);
      setMessage('❌ Payment failed – please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-['Roboto']">
      <div className="bg-white shadow-lg rounded-3xl p-8 max-w-md w-full text-center transition-transform duration-300 hover:scale-[1.03]">
        <h1 className="text-3xl font-extrabold mb-3 text-gray-900 font-['Montserrat']">Finalist: Jane Doe</h1>
        <p className="text-gray-600 mb-6 italic">Recognized for Excellence in Innovation</p>
        <div className="flex justify-center gap-6">
          <button
            onClick={() => handleUpgrade('boost')}
            className="bg-[#00897B] hover:bg-teal-800 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
          >
            Boost – $9
          </button>
          <button
            onClick={() => handleUpgrade('premium')}
            className="border border-[#CDDC39] text-[#CDDC39] font-semibold hover:bg-[#CDDC39] hover:text-white px-6 py-3 rounded-xl transition"
          >
            Premium – $49
          </button>
        </div>
        {message && <div className="mt-6 text-lg font-medium">{message}</div>}
      </div>
    </div>
  );
};

export default App;
