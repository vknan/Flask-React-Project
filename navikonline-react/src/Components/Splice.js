import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player'; 
import { useSelector } from 'react-redux';
import { Typewriter } from 'react-simple-typewriter';
import { useNavigate } from 'react-router-dom';

function Splice() {
  const { isDarkMode } = useSelector(Store => Store.ThemeSlice);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className={`flex flex-col lg:flex-row justify-between mx-auto mb-16 bg-gradient-to-r ${isDarkMode ? 'from-sky-900 via-cyan-700 to-sky-900' : 'from-cyan-700 via-sky-800 to-cyan-700' } items-center text-white px-4 sm:px-8 md:px-12 py-8 md:py-10 max-w-[100%] lg:max-w-[80%] shadow-xl relative rounded-lg mt-4 md:mt-8`}>
      <div className="text-left lg:w-1/2 w-full mb-8 lg:mb-0">
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 mt-4 md:mt-8 lg:mt-12 min-h-[60px] sm:min-h-[80px] lg:min-h-[100px]">
          <Typewriter
            words={['Learn Anytime, Anywhere!']}
            loop={false}
            cursor
            cursorStyle="|"
            typeSpeed={90}
            deleteSpeed={70}
            delaySpeed={1100}
          />
        </h1>
        <p className="text-base sm:text-lg lg:text-xl lg:mb-6 font-normal text-gray-200 mt-2 max-w-[90%] sm:max-w-[80%]">
          Kickstart, change, or elevate your career with over 4 specialized courses.
        </p>
        <button 
          onClick={handleGetStarted} 
          className="mt-6 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition duration-300 w-full sm:w-auto"
        >
          Get Started
        </button>
      </div>
      <div className="lg:w-3/5 w-full flex justify-center lg:justify-end mt-4 lg:mt-0">
        <Player 
          src="https://lottie.host/ea77eb96-9627-4ee4-bfd0-5bb299f341c3/TzCE7HFC48.json" 
          className="w-full sm:w-[70%] lg:w-[79%] h-auto transition-transform transform hover:scale-105 hover:cursor-pointer duration-300" 
          loop 
          autoplay
        />
      </div>
    </div>
  );
}

export default Splice;