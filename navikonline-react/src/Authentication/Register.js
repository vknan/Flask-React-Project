import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useSignupMutation } from '../ThemeContextProvider/UserApiSlice';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile_number, setMobile] = useState('');
  const [role, setRole] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState(''); // Optional field
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false); // Success state
  const [signup, { isLoading, isError }] = useSignupMutation();

  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) newErrors.username = 'Username is required.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required.';
    if (!password.trim() || password.length < 6) newErrors.password = 'Password must be at least 6 characters long.';
    if (!mobile_number.trim() || !/^\d{10}$/.test(mobile_number)) newErrors.mobile_number = 'Valid 10-digit mobile number is required.';
    if (!role) newErrors.role = 'Role is required.';
    if (!first_name.trim()) newErrors.first_name = 'First name is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const res = await signup({ username, email, password, mobile_number, role, first_name, last_name }).unwrap();
      console.log(res);
      setSuccess(true); // Set success to true
      setUsername('');
      setEmail('');
      setPassword('');
      setMobile('');
      setRole('');
      setFirstName('');
      setLastName('');
      setErrors({}); // Clear errors
    } catch (err) {
      console.log(err);
      // Check if the error response contains data with validation errors
      if (err?.data) {
        setErrors(err.data); // Assign the validation errors to the state
      } else {
        setErrors({ general: 'Something went wrong. Please try again later.' });
      }
    }
  };

  const { isDarkMode } = useSelector(Store => Store.ThemeSlice);

  return (
    <div className="min-h-screen flex items-start mt-10 justify-center p-4">
      <div className={`${isDarkMode ? 'bg-zinc-900 text-gray-400' : 'bg-gray-300 brightness-105 text-black'} p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md`}>
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {success ? ( // Conditional rendering for success message
          <div className="text-center text-green-500 font-bold mb-4">
            Registration Successful!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="username">
                USERNAME
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder='Enter your user name'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete='username'
                className={`w-full px-3 py-2 ${isDarkMode ? "bg-gray-700 text-white" : "bg-slate-100 text-black"} rounded focus:outline-none focus:ring-2 focus:ring-sky-600`}
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="email">
                EMAIL
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder='name@email.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete='email'
                className={`w-full px-3 py-2 ${isDarkMode ? "bg-gray-700 text-white" : "bg-slate-100 text-black"} rounded focus:outline-none focus:ring-2 focus:ring-sky-600`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="password">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder='Create password'
                value={password}
                autoComplete='password'
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 ${isDarkMode ? "bg-gray-700 text-white" : "bg-slate-100 text-black"} rounded focus:outline-none focus:ring-2 focus:ring-sky-600`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="mobile_number">
                MOBILE NUMBER
              </label>
              <input
                type="tel"
                id="mobile_number"
                name="mobile_number"
                autoComplete='mobile_number'
                placeholder='Enter your mobile number'
                value={mobile_number}
                onChange={(e) => setMobile(e.target.value)}
                className={`w-full px-3 py-2 ${isDarkMode ? "bg-gray-700 text-white" : "bg-slate-100 text-black"} rounded focus:outline-none focus:ring-2 focus:ring-sky-600`}
              />
              {errors.mobile_number && <p className="text-red-500 text-xs mt-1">{errors.mobile_number}</p>}

            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="role">
                ROLE
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`w-full px-3 py-2 ${isDarkMode ? "bg-gray-700 text-white" : "bg-slate-100 text-black"} rounded focus:outline-none focus:ring-2 focus:ring-sky-600`}
              >
                <option value="" disabled>Select your role</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" htmlFor="first_name">
                FIRST NAME
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                autoComplete='first_name'
                placeholder='Enter your first name'
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full px-3 py-2 ${isDarkMode ? "bg-gray-700 text-white" : "bg-slate-100 text-black"} rounded focus:outline-none focus:ring-2 focus:ring-sky-600`}
              />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-sm mb-2" htmlFor="last_name">
                LAST NAME (optional)
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                autoComplete='last_name'
                placeholder='Enter your last name'
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full px-3 py-2 ${isDarkMode ? "bg-gray-700 text-white" : "bg-slate-100 text-black"} rounded focus:outline-none focus:ring-2 focus:ring-sky-600`}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-sky-700 hover:brightness-110 rounded-lg text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
            >
              REGISTER
            </button>
          </form>
        )}
        
        <div className="text-center mt-4">
          <p className="">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-500 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
