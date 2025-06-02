import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetBlogMutation } from '../ThemeContextProvider/GetDataSlice';
import ClipLoader from 'react-spinners/ClipLoader';
import { Helmet } from 'react-helmet-async';

// API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Blog() {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const [getBlog, { isLoading, isError }] = useGetBlogMutation();
  const { isDarkMode } = useSelector((Store) => Store.ThemeSlice);

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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getBlog(id).unwrap();
        setPost(response);
        // Debug log for thumbnail
        console.log('Blog thumbnail path:', response.thumbnail);
        console.log('Full thumbnail URL:', getMediaUrl(response.thumbnail));
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id, getBlog]);

  const getMetaDescription = (html, maxLength = 160) => {
    if (!html) return '';
    const plainText = html.replace(/<[^>]+>/g, '');
    return plainText.length > maxLength 
      ? `${plainText.substring(0, maxLength)}...` 
      : plainText;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color={isDarkMode ? "#ffffff" : "#000000"} loading={isLoading} size={44} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        <p>There was an error loading the blog post. Please try again later.</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center">
        <p>Blog post not found</p>
      </div>
    );
  }

  const thumbnailUrl = getMediaUrl(post.thumbnail);

  return (
    <div className={`${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-gray-300 brightness-105 text-black'} max-w-4xl mx-auto mt-5 p-4 lg:p-6 rounded-lg shadow-lg`}>
      <Helmet>
        <title>{post.title} | Navikonline</title>
        <meta name="description" content={getMetaDescription(post.description)} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={getMetaDescription(post.description)} />
        <meta property="og:image" content={thumbnailUrl || 'https://navikonline.in/logo.png'} />
        <meta property="og:url" content={`https://navikonline.in/blogs/${id}`} />
        <meta property="og:type" content="article" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={getMetaDescription(post.description)} />
        <meta name="twitter:image" content={thumbnailUrl || 'https://navikonline.in/logo.png'} />

        {/* WhatsApp Specific */}
        <meta property="og:image:secure_url" content={thumbnailUrl || 'https://navikonline.in/logo.png'} />
      </Helmet>

      {/* Featured Image */}
      {post.thumbnail && (
        <div className="relative w-full h-96 mb-6">
          <img 
            src={thumbnailUrl} 
            alt={post.title} 
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              console.error('Error loading image:', e.target.src);
              e.target.onerror = null;
              e.target.src = 'https://navikonline.in/logo.png'; // Fallback image
            }}
          />
        </div>
      )}
      
      {/* Post Title */}
      <h1 className="text-2xl lg:text-3xl font-bold mb-4">{post.title}</h1>
      
      {/* Post Content */}
      <div 
        className={`custom-prose max-w-none ${
          isDarkMode ? 'prose-invert' : 'prose'
        }`} 
        dangerouslySetInnerHTML={{ __html: post.description }} 
      />
    </div>
  );
}

export default Blog;