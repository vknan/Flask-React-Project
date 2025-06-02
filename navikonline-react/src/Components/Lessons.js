import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetLessonsQuery } from '../ThemeContextProvider/GetDataSlice';
import ClipLoader from 'react-spinners/ClipLoader';
import DOMPurify from 'dompurify';

function Lessons() {
  const { id } = useParams();
  const [lessonData, setLessonData] = useState([]);
  const user = useSelector((Store) => Store.auth.user);
  const { isDarkMode } = useSelector((Store) => Store.ThemeSlice);

  const submoduleId = parseInt(id);

  const { 
    data: allLessons, 
    isLoading: isLessonsLoading, 
    isError: isLessonsError, 
    error: lessonsError 
  } = useGetLessonsQuery();

  useEffect(() => {
    if (allLessons) {
      const submoduleLessons = allLessons.filter(lesson => lesson.submodule_id === submoduleId);
      console.log('Submodule ID:', submoduleId);
      console.log('All Lessons:', allLessons);
      console.log('Filtered Lessons for Submodule:', submoduleLessons);
      
      setLessonData(submoduleLessons);
    }
  }, [submoduleId, allLessons]);

  // Configure DOMPurify to allow iframes
  const sanitizeConfig = {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  };

  if (isLessonsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color={isDarkMode ? '#ffffff' : '#000000'} loading={isLessonsLoading} size={44} />
      </div>
    );
  }

  if (isLessonsError) {
    console.error('Lessons Error:', lessonsError);
    return (
      <div className="text-center text-red-500">
        <p>There was an error loading the lessons. Please try again later.</p>
        <p className="text-sm mt-2">Make sure you are logged in and have enrolled in this course.</p>
      </div>
    );
  }

  if (!lessonData.length) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <p>No lessons found for this submodule.</p>
        <p className="text-sm mt-2">Please contact the course instructor if you believe this is an error.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-semibold flex flex-col items-center mt-3`}>
      <div className={`${
        isDarkMode 
          ? "bg-zinc-900 text-white" 
          : "bg-white text-black"
      } w-full max-w-4xl p-6 my-2 border-2 rounded-md shadow-lg`}>
        <h1 className="text-2xl font-bold mb-6">Lessons</h1>
        {lessonData.map((lesson) => (
          <div key={lesson.id} className="mb-6">
            <div className={`${
              isDarkMode 
                ? "bg-zinc-800 hover:bg-zinc-700" 
                : "bg-gray-50 hover:bg-gray-100"
            } rounded-lg p-4 transition-colors duration-200`}>
              <h2 className="text-xl font-semibold mb-3">{lesson.title}</h2>
              <div 
                className={`prose ${
                  isDarkMode 
                    ? "prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white" 
                    : "prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900"
                } max-w-none`}
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(lesson.description, sanitizeConfig) 
                }}
              />
              {/* Add custom styles for iframes */}
              <style>
                {`
                  .prose iframe {
                    width: 100%;
                    aspect-ratio: 16/9;
                    margin: 1rem 0;
                    border-radius: 0.5rem;
                  }
                `}
              </style>
              {lesson.duration && (
                <p className={`${
                  isDarkMode 
                    ? "text-gray-400" 
                    : "text-gray-600"
                } text-sm mt-4`}>
                  Duration: {lesson.duration}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lessons;
