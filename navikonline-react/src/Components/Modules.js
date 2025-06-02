import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useGetModulesQuery, useGetSubModulesQuery } from '../ThemeContextProvider/GetDataSlice';
import ClipLoader from 'react-spinners/ClipLoader';

function Modules() {
  const { id } = useParams();
  const [moduleData, setModuleData] = useState([]);
  const [subModuleData, setSubModuleData] = useState({});
  const [activeModule, setActiveModule] = useState(null);
  const user = useSelector((Store) => Store.auth.user);

  // Convert id to number for comparison
  const courseId = parseInt(id);

  const { 
    data: allModules, 
    isLoading: isModulesLoading, 
    isError: isModulesError, 
    error: modulesError 
  } = useGetModulesQuery();

  const { 
    data: allSubModules, 
    isLoading: isSubModulesLoading, 
    isError: isSubModulesError, 
    error: subModulesError 
  } = useGetSubModulesQuery();

  useEffect(() => {
    if (allModules && allSubModules) {
      // Filter modules for the current course
      const courseModules = allModules.filter(module => module.course_id === courseId);
      console.log('Course ID:', courseId);
      console.log('Filtered Modules for Course:', courseModules);
      console.log('All Submodules:', allSubModules);
      
      setModuleData(courseModules);
      
      // Create a map of submodules by module ID
      const subModulesByModule = {};
      courseModules.forEach(module => {
        // Filter submodules for this module
        const moduleSubModules = allSubModules.filter(sub => {
          // Log the comparison for debugging
          console.log('Comparing submodule:', {
            subModuleId: sub.id,
            subModuleModuleId: sub.module,
            moduleId: module.id,
            subModuleTitle: sub.title,
            isMatch: parseInt(sub.module) === module.id
          });
          return parseInt(sub.module) === module.id;
        });
        
        if (moduleSubModules.length > 0) {
          subModulesByModule[module.id] = moduleSubModules;
          console.log(`Submodules for Module ${module.id}:`, moduleSubModules);
        }
      });
      
      console.log('Final Submodules by Module:', subModulesByModule);
      setSubModuleData(subModulesByModule);
    }
  }, [courseId, allModules, allSubModules]);

  const { isDarkMode } = useSelector((Store) => Store.ThemeSlice);

  const toggleModule = (clickedModule) => {
    console.log('Toggling module:', clickedModule);
    console.log('Available submodules for this module:', subModuleData[clickedModule]);
    setActiveModule(activeModule === clickedModule ? null : clickedModule);
  };

  if (isModulesLoading || isSubModulesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color={isDarkMode ? '#ffffff' : '#000000'} loading={isModulesLoading || isSubModulesLoading} size={44} />
      </div>
    );
  }

  if (isModulesError || isSubModulesError) {
    console.error('Modules Error:', modulesError);
    console.error('SubModules Error:', subModulesError);
    return (
      <div className="text-center text-red-500">
        <p>There was an error loading the modules. Please try again later.</p>
        <p className="text-sm mt-2">Make sure you are logged in and have enrolled in this course.</p>
      </div>
    );
  }

  if (!moduleData.length) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <p>No modules found for this course.</p>
        <p className="text-sm mt-2">Please contact the course instructor if you believe this is an error.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-semibold flex flex-col items-center mt-3`}>
      {moduleData.map((module) => (
        <div key={module.id} className={` ${isDarkMode ? "bg-zinc-900 text-white" : "bg-gray-300 brightness-105 text-black"} w-full max-w-[22rem] md:max-w-md p-3 py-0 my-2 border-2 rounded-md text-start`}>
          <div className='flex justify-between items-center' onClick={() => toggleModule(module.id)} >
            <h1 className="text-base md:text-lg cursor-pointer flex items-center mt-4">
              <span className="ml-2">{module.title}</span>
            </h1>
            {activeModule === module.id ? '▲' : '▼'}
          </div>

          {activeModule === module.id && (
            <div>
              {subModuleData[module.id]?.length > 0 ? (
                subModuleData[module.id].map((sub) => (
                  <Link to={`/dashboard/lessons/${sub.id}`} key={sub.id}>
                    <div className={`${isDarkMode ? "text-sky-500" : "text-sky-600"} ml-2 text-start py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2`}>
                      {sub.title}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-gray-500 ml-2 py-2">
                  No submodules available for this module
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Modules;
