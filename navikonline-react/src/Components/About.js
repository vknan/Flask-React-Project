import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../Constants';

const About = () => {
  const [aboutData, setAboutData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/abouts/?format=json`);
        setAboutData(response.data);
      } catch (error) {
        console.error("Error fetching the about data", error);
      }
    };

    fetchData();
  }, []);

  const { isDarkMode } =useSelector(Store => Store.ThemeSlice);

  return (
    <div className={`bg-gradient-to-r mt-2 ${isDarkMode ?" text-white"  : "text-black"}  px-2 py-10`}>
      <div className="max-w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {aboutData.map((item) => (
          <div key={item.id} className={`${ isDarkMode ? "bg-zinc-800" : "bg-gray-300 brightness-105" }flex flex-col md:flex-row items-start  p-4 rounded-lg shadow-lg`}>
            <div className="md:w-full">
              <h2 className=" text-base md:text-lg font-bold mb-2">{item.name}</h2>
              <p className={` ${isDarkMode ? "text-gray-300" : "text-gray-800"} text-sm md:text-base mb-1`}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
