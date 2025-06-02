// import React, { useState, useEffect } from 'react';
// import { ClipLoader } from 'react-spinners';
// import { useSelector } from 'react-redux';
// import { Link, useParams, useLocation } from 'react-router-dom';
// import { useGetCoursesQuery } from '../ThemeContextProvider/GetDataSlice';
// import { Player } from '@lottiefiles/react-lottie-player';
// import axios from 'axios';
// import { BASE_URL } from '../Constants';
// import { toast } from 'react-toastify';

// const Courses = () => {
//   const { data: courses, isLoading, isError } = useGetCoursesQuery();
//   const { isDarkMode } = useSelector((Store) => Store.ThemeSlice);
//   const { keyword } = useParams();
//   const location = useLocation();
//   const [enrollmentStatus, setEnrollmentStatus] = useState({});
//   const [enrollingCourse, setEnrollingCourse] = useState(null);
//   const searchKeyword = keyword ? keyword.toLowerCase() : "";

//   const filteredCourses = courses ? courses.filter((course) => course.title.toLowerCase().includes(searchKeyword)) : [];
//   const isSearchPage = location.pathname.includes("/dashboard/search");

//   useEffect(() => {
//     if (courses) {
//       courses.forEach(course => {
//         fetchEnrollmentStatus(course.id);
//       });
//     }
//   }, [courses]);

//   const fetchEnrollmentStatus = async (courseId) => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/enrollment-status/${courseId}/`);
//       setEnrollmentStatus(prev => ({
//         ...prev,
//         [courseId]: response.data.enrolled
//       }));
//     } catch (error) {
//       console.error('Error fetching enrollment status:', error);
//     }
//   };

//   const handleEnrollment = async (courseId, isEnrolled) => {
//     setEnrollingCourse(courseId);
//     try {
//       const endpoint = isEnrolled ? 'unenroll' : 'enroll';
//       await axios.post(`${BASE_URL}/api/${endpoint}/`, {
//         course_id: courseId
//       });

//       setEnrollmentStatus(prev => ({
//         ...prev,
//         [courseId]: !isEnrolled
//       }));

//       toast.success(isEnrolled ? 'Successfully unenrolled!' : 'Successfully enrolled!');
//     } catch (error) {
//       toast.error('Failed to update enrollment');
//       console.error('Error updating enrollment:', error);
//     } finally {
//       setEnrollingCourse(null);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <ClipLoader color={isDarkMode ? '#ffffff' : '#000000'} loading={isLoading} size={44} />
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="text-center text-red-500 mt-8">
//         <p>Error loading courses. Please try again later.</p>
//       </div>
//     );
//   }

//   return (
//     <div className={`max-w-[90%] lg:max-w-[80%] mx-auto ${isDarkMode ? 'text-white' : 'text-black'} pb-20`}>
//       {isSearchPage ? (
//         <h1 className={`text-center text-2xl font-bold mt-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
//           Search Results for: {keyword}
//         </h1>
//       ) : (
//         <h1 className={`text-xl sm:text-3xl font-semibold pb-4 border-b-[3.2px] border-gray-300 text-center sm:text-left`}>Explore our courses</h1>
//       )}

//       <div className="flex justify-center pt-10">
//         <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mx-4 sm:mx-8 lg:mx-16">
//           {filteredCourses.length > 0 ? (
//             filteredCourses.map((course) => (
//               <div key={course.id} className={`${
//                 isDarkMode ? 'bg-zinc-900' : 'bg-gray-300 brightness-1'
//               } rounded-lg p-4 shadow-md flex flex-col justify-between transform transition-transform duration-300 hover:scale-105`}>
//                 <div className="flex flex-col items-center">
//                   <Player
//                     src={course.lottieicon}
//                     className="w-32 sm:w-36 lg:w-40 h-auto"
//                     loop
//                     autoplay
//                   />
//                   <h3 className="text-base font-bold md:font-semibold mt-2 text-center">{course.title}</h3>
//                   <p className={`${
//                     isDarkMode ? 'text-gray-300' : 'text-gray-700'
//                   } text-sm mt-1 text-center`}>
//                     {course.description}
//                   </p>
//                 </div>

//                 <div className="mt-4 space-y-2">
//                   {enrollmentStatus[course.id] ? (
//                     <>
//                       <Link
//                         to={`/dashboard/modules/${course.id}`}
//                         className="block w-full px-4 py-2 bg-sky-700 text-white rounded-md text-center hover:bg-sky-600 transition-colors"
//                       >
//                         Continue Learning
//                       </Link>
//                       <button
//                         onClick={() => handleEnrollment(course.id, true)}
//                         disabled={enrollingCourse === course.id}
//                         className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
//                       >
//                         {enrollingCourse === course.id ? 'Processing...' : 'Unenroll'}
//                       </button>
//                     </>
//                   ) : (
//                     <button
//                       onClick={() => handleEnrollment(course.id, false)}
//                       disabled={enrollingCourse === course.id}
//                       className="w-full px-4 py-2 bg-sky-700 text-white rounded-md hover:bg-sky-600 transition-colors disabled:opacity-50"
//                     >
//                       {enrollingCourse === course.id ? 'Processing...' : 'Enroll Now'}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center text-lg col-span-full">
//               <p className="text-gray-500">
//                 No courses found. Please go to <Link to="/dashboard/home" className='text-sky-600 font-semibold'>Home page</Link>
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Courses;
