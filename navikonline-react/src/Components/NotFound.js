import React from 'react';
import { useSelector } from 'react-redux';

const NotFound = () => {
    const { isDarkMode } = useSelector(Store => Store.ThemeSlice);

  return (
    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} flex flex-col items-center justify-center h-screen`}>
      <img 
        src="https://static-00.iconduck.com/assets.00/9-404-error-illustration-1024x454-1e9ol1ls.png" 
        alt="404 Not Found" 
        className=" w-[56%] md:w-[24%] h-auto -mt-36 md:-mt-16 md:-ml-10" 
      />
      <h2 className="text-xl md:text-3xl font-bold mt-4">Page Not Found</h2>
      <p className=" text-sm md:text-lg mt-2">Sorry, the page you're looking for doesn't exist.</p>
    </div>
  );
};

export default NotFound;
