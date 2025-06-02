import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Link, useNavigate } from 'react-router-dom'; 
import { useSelector } from 'react-redux';

const Footer = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const { isDarkMode } = useSelector((Store) => Store.ThemeSlice);

  const handleModuleClick = (moduleId) => {
    if (!isAuthenticated) {
      alert('You need to be logged in to view the modules.');
      navigate('/login');
    } else {
      navigate(`/modules/${moduleId}`);
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-gray-300 brightness-105 text-black'} pb-4`}>
      <div className="max-w-[80%] mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col items-center w-full md:w-1/3 mb-6 md:mb-0">
          <a
            href="https://navikonline.in"
            target="_blank"
            rel="noreferrer noopener"
            className="footer-link flex flex-col items-center w-full"
          >
            <img
              src="https://www.navikonline.in/logo.png"
              alt="NavikOnline Logo"
              className="w-12 rounded-md h-auto mb-4"
            />
            <h1 className={`${isDarkMode ? 'text-sky-500 hover:text-sky-400' : 'text-sky-600 hover:text-sky-500'} font-semibold text-center`}>
              navikonline.in
            </h1>
          </a>
        </div>

        <div className="flex flex-wrap w-[104%] md:w-2/3 justify-between text-xs md:text-base">
          <div className="mb-6 md:mb-0">
            <h3 className="font-semibold mb-4">Courses</h3>
            <ul className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
              <li>
                <span onClick={() => handleModuleClick(2)} className="cursor-pointer">CSF</span>
              </li>
              <li>
                <span onClick={() => handleModuleClick(3)} className="cursor-pointer">CSPY</span>
              </li>
              <li>
                <span onClick={() => handleModuleClick(4)} className="cursor-pointer">CSW</span>
              </li>
              <li>
                <span onClick={() => handleModuleClick(5)} className="cursor-pointer">CSAI</span>
              </li>
            </ul>
          </div>

          <div className="mb-6 md:mb-0">
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
              <li>
                <Link to='/terms'>Terms & Conditions</Link>
              </li>
              <li>
                <Link to='/privacy'>Privacy Policy</Link>
              </li>
              {/* <li>
                <Link to={'/sitemap'}>Site Map</Link>
              </li> */}
              <li>
                <Link to={'/about'}>About Us</Link>
              </li>
              <li>
                <a href="mailto:info@navikonline.in">Contact Us</a>
              </li>
              <li>
                <Link to={'/blogs'}>Blog</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              <a href="mailto:info@navikonline.in" className="hover:text-sky-500">info@navikonline.in</a>
            </p>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>+91 9100529687</p>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {/* <a href="#" className="hover:text-gray-600"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="#" className="hover:text-gray-600"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#" className="hover:text-gray-600"><FontAwesomeIcon icon={faFacebook} /></a> */}
              <a href="https://www.linkedin.com/company/navikonline/about/" className="hover:text-gray-600"><FontAwesomeIcon icon={faLinkedin} /></a>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex flex-col lg:flex-row lg:justify-center text-xs mt-7 ${isDarkMode ? 'text-gray-500' : 'text-gray-700'} border-gray-700 text-center lg:text-left`}>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-1">
          © 2021-2025 <p><a className="text-sky-600 hover:text-sky-500 ml-1" href='https://www.navikonline.in/'>NavikOnline</a>, All Rights Reserved. </p>
          <span className="ml-1">
            Built by <a href="https://rajeshbudidiportfolio.vercel.app/" target="_blank" rel="noreferrer noopener" className="text-sky-600 hover:text-sky-500">RajeshBudidi</a> 
            &nbsp;and&nbsp; 
            <a href="https://github.com/vknan/" target="_blank" rel="noreferrer noopener" className="text-sky-600 hover:text-sky-500">VijayNarsingoju</a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Footer;