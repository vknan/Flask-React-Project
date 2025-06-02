import React, { useEffect, useState } from 'react';
import { useLocation, Outlet, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import Sidebar from './Sidebar'; // Import the Sidebar component
import { useDispatch, useSelector } from 'react-redux';
import { login, setUser } from '../ThemeContextProvider/authSlice'; // Import login and setUser actions
import { BASE_URL } from '../Constants';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Get login state from Redux
    const user = useSelector((state) => state.auth.user);
    
    axios.defaults.withCredentials = true;
    
    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/auth/profile/`);
            dispatch(setUser(response.data));
            dispatch(login(response.data));
        } catch (err) {
            setError('Failed to fetch user details.');
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location.state?.userDetails) {
            dispatch(setUser(location.state.userDetails));
            dispatch(login(location.state.userDetails));
            setLoading(false);
        } else if (!user) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [location.state, user, dispatch]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login'); // Redirect to login if not authenticated
        }
    }, [isAuthenticated, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="flex h-screen"> {/* Full height of the viewport */}
            
            <Sidebar /> {/* Add the Sidebar component */}
            <div className="flex-1 p-4 overflow-y-auto"> {/* Main content area */}
                <Outlet /> {/* Render nested routes here */}
            </div>
        </div>
    );
};

export default Dashboard;
