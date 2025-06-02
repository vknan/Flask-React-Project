import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSun, faMoon, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../ThemeContextProvider/ThemeSlice';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((store) => store.ThemeSlice);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.length > 0) {
      navigate(`dashboard/search/${searchQuery}`);
    } else {
      navigate('/dashboard/home');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isAuthenticated) {
    return (
      <nav className={`${isDarkMode ? 'bg-zinc-900' : 'bg-gray-100'} p-4 pl-20 lg:pl-72 z-40`}>
        <div className="container mx-auto">
          <form onSubmit={handleSearchSubmit} className="flex max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search for courses"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${isDarkMode ? 'bg-gray-800 text-white border-0' : 'bg-white text-black border-2 border-gray-300'} w-full px-4 py-2 rounded-l-md focus:outline-none`}
            />
            <button 
              type="submit" 
              className="bg-sky-700 text-white px-4 py-2 rounded-r-md hover:cursor-pointer hover:bg-sky-600"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`${isDarkMode ? 'bg-zinc-900 shadow-xl' : 'bg-gray-100 border-b-[1px] border-gray-300'} p-4 relative`}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Tenor+Sans&display=swap');`}
      </style>
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/">
          <div 
            className={`${isDarkMode ? 'text-sky-500' : 'text-sky-600 brightness-90'} text-lg md:text-xl font-bold`}
            style={{ fontFamily: 'Tenor Sans, sans-serif' }}
          >
            Navikonline
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700"
          onClick={toggleMobileMenu}
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} size="lg" />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/blogs">
            <button className={`${isDarkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-800'} hover:underline`}>
              Blogs
            </button>
          </Link>
          <Link to="/login">
            <button className={`${isDarkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-800'} hover:underline`}>
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className={`${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-sky-700 text-white hover:bg-sky-600'} px-4 py-2 rounded-md`}>
              Join for Free
            </button>
          </Link>
          <button 
            onClick={() => dispatch(toggleTheme())} 
            className={`p-2 px-3 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
          >
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 py-2 bg-white shadow-lg rounded-b-lg z-50">
            <div className="flex flex-col space-y-2 px-4">
              <Link to="/blogs" onClick={toggleMobileMenu}>
                <button className="w-full text-left py-2 text-gray-800 hover:text-sky-600">
                  Blogs
                </button>
              </Link>
              <Link to="/login" onClick={toggleMobileMenu}>
                <button className="w-full text-left py-2 text-gray-800 hover:text-sky-600">
                  Login
                </button>
              </Link>
              <Link to="/register" onClick={toggleMobileMenu}>
                <button className="w-full text-left py-2 text-sky-600 font-semibold hover:text-sky-700">
                  Join for Free
                </button>
              </Link>
              <button 
                onClick={() => {
                  dispatch(toggleTheme());
                  toggleMobileMenu();
                }}
                className="w-full flex items-center py-2 text-gray-800 hover:text-sky-600"
              >
                <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className="mr-2" />
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
