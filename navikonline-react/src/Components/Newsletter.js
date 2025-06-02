import React, { useState } from 'react'; 
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from '../Constants';

const Newsletter = () => {
  const { isDarkMode } = useSelector(Store => Store.ThemeSlice);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${BASE_URL}/newsletter/api/subscribe/`, { email });
      toast.success(response.data.message);
      setEmail(''); // Clear the input
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong. Please try again later.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-gradient-to-r mt-6 lg:mt-16 ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-gray-300  brightness-105 text-black'} px-4 sm:px-6 shadow-xl`}>
      <div className="max-w-[90%] lg:max-w-[80%] mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 w-full text-left mb-5 md:mb-0">
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold mt-5 lg:mt-0 mb-4">
            Subscribe to Our Newsletter
          </h1>
          <p className={`text-sm sm:text-lg ${isDarkMode ? 'text-gray-300' :  'text-gray-700' } mb-6`}>
            Get Updates from us via the most informational Newsletter.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="email"
              placeholder="Email here..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-black rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={isSubmitting}
            />
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`bg-sky-700 hover:bg-sky-600 text-white px-6 py-2 rounded-md transition-all duration-200
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-sky-600'}`}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
        <div className="md:w-[31%] w-full hidden md:flex justify-center md:justify-end -mt-12 md:mt-0">
          <img
            alt="Newsletter Image"
            src="https://static.vecteezy.com/system/resources/previews/012/066/503/original/postal-envelope-with-notice-3d-render-png.png"
            className="rounded-lg w-48 sm:w-56 md:w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
