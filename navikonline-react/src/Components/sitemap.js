import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { useSelector } from 'react-redux';

const Sitemap = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { isDarkMode } = useSelector((store) => store.ThemeSlice);

  const handleModuleClick = (moduleId) => {
    if (!isAuthenticated) {
      alert('You need to be logged in to view the modules.');
      navigate('/login');
    } else {
      navigate(`/modules/${moduleId}`);
    }
  };

  return (
    <div className={`container mx-auto p-6 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-6">Site Map</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Courses Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Courses</h2>
          <ul className="space-y-2 text-lg">
            {[{ id: 2, name: "CSF" }, { id: 3, name: "CSPY" }, { id: 4, name: "CSW" }, { id: 5, name: "CSAI" }].map(course => (
              <li key={course.id}>
                <span
                  onClick={() => handleModuleClick(course.id)}
                  className={`cursor-pointer ${isDarkMode ? 'text-sky-400' : 'text-sky-600'} hover:underline`}
                >
                  {course.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Company</h2>
          <ul className="space-y-2 text-lg">
            {[
              { link: "/terms", text: "Terms & Conditions" },
              { link: "/privacy", text: "Privacy Policy" },
              { link: "/sitemap", text: "Site Map" },
              { link: "/about", text: "About Us" },
              { link: "mailto:info@navikonline.in", text: "Contact Us" },
              { link: "/blogs", text: "Blog" }
            ].map(item => (
              <li key={item.text}>
                <Link
                  to={item.link}
                  className={`hover:underline ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}
                  target={item.link.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer noopener"
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Contact & Social</h2>
          <p className="text-lg mb-2">
            Email:{" "}
            <a
              href="mailto:info@navikonline.in"
              className={`hover:underline ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}
            >
              info@navikonline.in
            </a>
          </p>
          <p className="text-lg mb-4">Phone: +91 9100529687</p>
          <div className="text-lg">
            <h3 className="font-semibold mb-2">Follow Us</h3>
            <a
              href="https://www.linkedin.com/company/navikonline/about/"
              className={`flex items-center space-x-2 hover:underline ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <FontAwesomeIcon icon={faLinkedin} />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
