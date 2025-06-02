import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBook, FaChartLine, FaProjectDiagram, FaMoneyBillWave, FaUsers, FaCog, FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../ThemeContextProvider/ThemeSlice';
import { logout } from '../ThemeContextProvider/authSlice';
import { BASE_URL } from '../Constants';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isDarkMode } = useSelector((store) => store.ThemeSlice);
    const userProfile = useSelector((state) => state.auth.user);

    // Add detailed console logging
    console.log('User Profile Data:', {
        fullProfile: userProfile,
        firstName: userProfile?.first_name,
        customUser: userProfile?.custom_user
    });

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/logout');
        setIsOpen(false);
    };

    const navigationItems = [
        { to: "/dashboard/home", icon: <FaBook />, label: "Home" },
        // { to: "/dashboard/courses", icon: <FaChartLine />, label: "Browse Courses" },
        // { to: "/dashboard/projects", icon: <FaProjectDiagram />, label: "My Projects" },
        // { to: "/dashboard/earnings", icon: <FaMoneyBillWave />, label: "Earnings" },
        // { to: "/dashboard/community", icon: <FaUsers />, label: "Community" },
        // { to: "/dashboard/settings", icon: <FaCog />, label: "Settings" },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button 
                onClick={toggleSidebar} 
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white focus:outline-none"
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div 
                className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out z-50
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 h-full flex flex-col`}
            >
                {/* Updated Sidebar Header */}
                <div className="h-24 flex flex-col items-center justify-center border-b border-gray-700 p-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-3">
                            <img 
                                src={userProfile?.custom_user?.profile_picture ? 
                                    userProfile.custom_user.profile_picture.startsWith('http') ? 
                                        userProfile.custom_user.profile_picture : 
                                        `${BASE_URL}/media/profile_pics/${userProfile.custom_user.profile_picture.split('/').pop()}`
                                    : '/images/default-avatar.svg'} 
                                alt="Profile" 
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                                onError={(e) => {
                                    e.target.src = '/images/default-avatar.svg';
                                    e.target.onerror = null; // Prevent infinite loop
                                }}
                            />
                            <Link to="/dashboard" className="text-xl font-bold" style={{ fontFamily: 'Tenor Sans, sans-serif' }}>
                                Navikonline
                            </Link>
                        </div>
                        <span className="text-sm text-gray-300">
                            {!userProfile ? 'Loading...' : `Welcome, ${userProfile.first_name || 'User'}`}
                        </span>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="mt-6 px-2 flex-grow">
                    {navigationItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center py-3 px-4 rounded-md transition duration-200
                                ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                            `}
                        >
                            <span className="mr-3">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="px-4 py-4 border-t border-gray-700">
                    <Link 
                        to="/blogs" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center py-3 px-4 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200"
                    >
                        Blogs
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center py-3 px-4 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200"
                    >
                        Logout
                    </button>
                    <button 
                        onClick={() => dispatch(toggleTheme())}
                        className="w-full flex items-center justify-center mt-2 py-2 px-4 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition duration-200"
                    >
                        <FaSun className={`mr-2 ${isDarkMode ? 'block' : 'hidden'}`} />
                        <FaMoon className={`mr-2 ${isDarkMode ? 'hidden' : 'block'}`} />
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;