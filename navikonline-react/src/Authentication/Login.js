import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { useLoginMutation, useProfileQuery } from '../ThemeContextProvider/UserApiSlice';
import { login } from '../ThemeContextProvider/authSlice';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const [performLogin, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch user profile after login
  const { data: profile, error: profileError, isLoading: isProfileLoading } = useProfileQuery(null, {
    skip: !isUserLoggedIn,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const loginResponse = await performLogin({ username, password }).unwrap();
      console.log('Login response:', loginResponse);
      setIsUserLoggedIn(true);
    } catch (err) {
      console.error('Error during login:', err);
      if (err?.data?.message) {
        setError(err.data.message);
      } else if (err?.data?.detail) {
        setError(err.data.detail);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  // Effect to navigate once profile is successfully fetched
  useEffect(() => {
    if (profile) {
      dispatch(login(profile));
      navigate('/dashboard', { state: { userDetails: profile } });
    }
  }, [profile, navigate, dispatch]);

  const { isDarkMode } = useSelector((store) => store.ThemeSlice);

  return (
    <div className="min-h-screen flex items-start mt-10 justify-center p-4">
      <div className={`${isDarkMode ? 'bg-zinc-900 text-gray-400' : 'bg-gray-300 brightness-105 text-black'} p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md`}>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-2" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              value={username}
              placeholder="Enter your user name"
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-3 py-2 ${isDarkMode ? "bg-gray-700 text-white" : "bg-slate-100 text-black"} rounded focus:outline-none focus:ring-2 focus:ring-sky-600`}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm mb-2" htmlFor="password">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 ${isDarkMode ? "bg-gray-700 text-white" : "bg-slate-100 text-black"} rounded focus:outline-none focus:ring-2 focus:ring-sky-600`}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-sky-700 hover:brightness-110 rounded-lg text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
          >
            {isLoading || isProfileLoading ? <ClipLoader size={20} color="#fff" /> : 'LOGIN'}
          </button>
        </form>
        {(profileError || error) && <p className="text-red-500 mt-4 text-center">{error}</p>}
        <div className="text-center mt-4">
          <p>
            New here?{' '}
            <Link to="/register" className="text-sky-500 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
