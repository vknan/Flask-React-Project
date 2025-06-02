import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetBlogsQuery, useGetCategoriesQuery } from '../ThemeContextProvider/GetDataSlice';
import ClipLoader from 'react-spinners/ClipLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import BlogMeta from './BlogMeta';

// API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Blogs() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const navigate = useNavigate();

  const { data: posts, isLoading: postsLoading, isError: postsError } = useGetBlogsQuery();
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useGetCategoriesQuery();
  const { isDarkMode } = useSelector((Store) => Store.ThemeSlice);

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentPage(1);
  }, [selectedCategory]);

  const handleCategoryChange = (category, categoryId) => {
    setSelectedCategory(category);
    setSelectedCategoryId(categoryId);
  };

  const handleOpen = (id) => {
    navigate(`/blogs/${id}`);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  // Filter posts by category_id
  const filteredPosts = selectedCategory === 'All' 
    ? posts || [] 
    : (posts || []).filter((post) => {
        // Check if post has a category_id and if it matches the selected category_id
        return post?.category_id === selectedCategoryId;
      });

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredPosts.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(Math.ceil(filteredPosts.length / postsPerPage));
  };

  // Get category list with 'All' option
  const categoryList = categories ? [
    { name: 'All', id: null },
    ...categories.map(cat => ({ name: cat.name, id: cat.id }))
  ] : [{ name: 'All', id: null }];

  // Calculate total pages
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const isLoading = postsLoading || categoriesLoading;
  const isError = postsError || categoriesError;

  // Debug logs
  console.log('Selected Category:', selectedCategory);
  console.log('Selected Category ID:', selectedCategoryId);
  console.log('Posts:', posts);
  console.log('Categories:', categories);
  console.log('Filtered Posts:', filteredPosts);

  // Helper function to get the full media URL
  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    
    // Remove any leading slashes from the path
    const cleanPath = path.replace(/^\/+/, '');
    
    // If the path doesn't include 'post/thumbnail', add it
    if (!cleanPath.includes('post/thumbnail')) {
      return `${API_BASE_URL}/media/post/thumbnail/${cleanPath}`;
    }
    
    return `${API_BASE_URL}/media/${cleanPath}`;
  };

  // Debug logs for thumbnail URLs
  useEffect(() => {
    if (posts) {
      posts.forEach(post => {
        console.log('Post ID:', post.id);
        console.log('Original thumbnail path:', post.thumbnail);
        console.log('Full thumbnail URL:', getMediaUrl(post.thumbnail));
      });
    }
  }, [posts]);

  return (
    <div className="s-container flex flex-col md:flex-row justify-center pb-12 mt-5">
      <BlogMeta 
        title="Blog Posts | Navikonline"
        description="Discover our latest articles and tutorials"
        imageUrl="https://navikonline.in/logo.png"
        url="https://navikonline.in/blogs"
      />
      {isLoading ? (
        <div className="flex justify-center items-center h-screen w-full">
          <ClipLoader color={isDarkMode ? "#ffffff" : "#000000"} loading={isLoading} size={44} />
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center h-screen w-full">
          <p className="text-red-500">An error occurred while loading the blogs. Please try again later.</p>
        </div>
      ) : (
        <>
          <div className={`filter-sidebar p-1 px-4 md:p-4 ml-6 mx-5 md:mx-0 md:w-[20%] mb-4 md:mb-0 md:h-screen ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-gray-300 brightness-105 text-black'} rounded-md`}>
            <div className='flex justify-between mx-2 md:mx-0'>
              <h2 className="text-[16.29px] md:text-lg font-bold mt-2 md:mb-3">Filter by Category</h2>
              <button onClick={toggleMenu} className='md:hidden'>
                {isMenuOpen 
                  ? <FontAwesomeIcon icon={faTimes} className="w-6 h-5 py-[8px]" />
                  : <FontAwesomeIcon icon={faBars} className="w-6 h-5 py-[8px]" />
                }
              </button>
            </div>
            
            <ul className={`md:block ${isMenuOpen ? 'block' : 'hidden'}`}>
              {categoryList.map((category) => (
                <li key={category.id || 'all'} className="mb-2">
                  <button
                    className={`category-button w-full text-left p-[5px] md:p-2 rounded text-[15px] md:text-base ${
                      selectedCategory === category.name
                        ? 'bg-sky-700 text-white'
                        : `${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-slate-200 text-black'}`
                    } hover:bg-sky-700 hover:text-white`}
                    onClick={() => handleCategoryChange(category.name, category.id)}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="ml-2 blog-posts px-4 md:w-[78%]">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  No posts found in this category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentPosts.map((post) => (
                  <div
                    key={post.id}
                    className={`blog-post h-fit ${isDarkMode ? 'text-white bg-zinc-900' : 'text-black bg-gray-300 brightness-105'} shadow-md rounded-md p-4 md:p-6 transition-transform transform hover:-translate-y-2 hover:cursor-pointer`}
                    onClick={() => handleOpen(post.id)}
                  >
                    <div className="relative w-full h-48">
                      <img 
                        src={getMediaUrl(post.thumbnail)} 
                        alt={post.title} 
                        className="w-full h-48 object-cover rounded-t-md"
                        onError={(e) => {
                          console.error('Error loading image:', e.target.src);
                          e.target.onerror = null;
                          e.target.src = 'https://navikonline.in/logo.png'; // Fallback image
                        }}
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-md font-bold mt-4">{post.title.replace(/<[^>]+>/g, '').substring(0, 110)}...</h3>
                    <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{post.description.replace(/<[^>]+>/g, '').substring(0, 193)}...</p>
                    <button className="read-more-button mt-2 text-sky-500 hover:text-sky-400 font-semibold">Read More</button>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination controls */}
            {filteredPosts.length > postsPerPage && (
              <div className={`flex justify-center items-center mt-8 space-x-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                <button 
                  onClick={goToFirstPage} 
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sky-700 hover:text-white'}`}
                >
                  <FontAwesomeIcon icon={faAnglesLeft} />
                </button>
                
                <button 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sky-700 hover:text-white'}`}
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 rounded-md ${
                      currentPage === number 
                        ? 'bg-sky-700 text-white' 
                        : `${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                <button 
                  onClick={nextPage} 
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sky-700 hover:text-white'}`}
                >
                  <FontAwesomeIcon icon={faAngleRight} />
                </button>
                
                <button 
                  onClick={goToLastPage} 
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sky-700 hover:text-white'}`}
                >
                  <FontAwesomeIcon icon={faAnglesRight} />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Blogs;