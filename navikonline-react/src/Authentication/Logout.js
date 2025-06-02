import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLogoutMutation } from '../ThemeContextProvider/UserApiSlice';
import { logout } from '../ThemeContextProvider/authSlice';

const Logout = () => {
  const [performLogout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // First dispatch logout to clear local state
        dispatch(logout());
        // Then try to call the backend logout endpoint
        await performLogout().unwrap();
        // Finally navigate to login
        navigate('/login');
      } catch (err) {
        console.error('Failed to logout:', err);
        // Even if the backend call fails, we still want to clear local state and redirect
        dispatch(logout());
        navigate('/login');
      }
    };

    handleLogout();
  }, [performLogout, dispatch, navigate]);

  return <div>Logging out...</div>;
};

export default Logout;