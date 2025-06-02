import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LessonProgress from './LessonProgress';
import { BASE_URL } from '../Constants';
import ClipLoader from 'react-spinners/ClipLoader';
import DOMPurify from 'dompurify';

const LessonView = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const { isDarkMode } = useSelector((Store) => Store.ThemeSlice);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/lessons/${lessonId}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        console.log('Lesson data:', response.data);
        setLesson(response.data);
      } catch (err) {
        setError('Failed to load lesson');
        console.error('Error fetching lesson:', err);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color={isDarkMode ? '#ffffff' : '#000000'} loading={loading} size={44} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8">
        <p>{error}</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <p>Lesson not found.</p>
      </div>
    );
  }

  const sanitizedContent = DOMPurify.sanitize(lesson.description);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className={`${isDarkMode ? "bg-zinc-900 text-white" : "bg-white"} rounded-lg shadow-md p-6`}>
            <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
            
            {/* Lesson Content with enhanced styling */}
            <div 
              className={`prose ${isDarkMode ? "prose-invert" : ""} max-w-none`}
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {/* Lesson metadata */}
            <div className="mt-6 pt-4 border-t border-gray-400">
              <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                Duration: {lesson.duration || 'Not specified'}
              </p>
              <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                Created: {new Date(lesson.created).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Progress Tracking */}
          <LessonProgress 
            lessonId={lesson.id} 
            courseId={lesson.submodule?.module?.course}
          />

          {/* Navigation */}
          <div className={`${isDarkMode ? "bg-zinc-900 text-white" : "bg-white"} rounded-lg shadow-md p-4 mt-4`}>
            <h3 className="text-lg font-semibold mb-4">Lesson Navigation</h3>
            <div className="space-y-2">
              <button
                onClick={() => window.history.back()}
                className={`w-full px-4 py-2 ${
                  isDarkMode 
                    ? "bg-zinc-800 text-white hover:bg-zinc-700" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } rounded-md transition-colors`}
              >
                Back to Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonView; 