import { BASE_URL } from '../Constants';
import { ApiSlice } from "./ApiSlice";

const GetDataSlice = ApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCourses: builder.query({
            query: () => ({
                url: `${BASE_URL}/api/courses/`,
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
        }),
        getCategories: builder.query({
            query: () => ({
                url: `${BASE_URL}/api/categories/`,
                method: 'GET'
            })
        }),
        getBlogs: builder.query({
            query: () => ({
                url: `${BASE_URL}/api/posts/`,
                method: 'GET'
            })
        }),
        getBlog: builder.mutation({
            query: (id) => ({
                url: `${BASE_URL}/api/posts/${id}`,
                method: 'GET'
            })
        }),
        getLessons: builder.query({
            query: () => ({
                url: `${BASE_URL}/api/lessons/`,
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            }),
            transformResponse: (response) => {
                console.log('Lessons API Response:', response);
                return response;
            }
        }),
        getModules: builder.query({
            query: (courseId) => {
                console.log('Fetching modules for course:', courseId); // Debug log
                return {
                    url: `${BASE_URL}/api/modules/`,
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                    params: {
                        course_id: courseId
                    }
                };
            },
            transformResponse: (response) => {
                console.log('Modules response:', response); // Debug log
                return response;
            }
        }),
        getSubModules: builder.query({
            query: () => ({
                url: `${BASE_URL}/api/submodules/`,
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            }),
            transformResponse: (response) => {
                console.log('Submodules API Response:', response);
                return response;
            }
        }),
        getEnrolledCourses: builder.query({
            query: (userId) => ({
                url: `${BASE_URL}/api/enrolled-courses/${userId}/`,
                method: 'GET'
            })
        }),
        getUserCourseProgress: builder.query({
            query: ({ userId, courseId }) => ({
                url: `${BASE_URL}/api/user-course-progress/${userId}/${courseId}/`,
                method: 'GET'
            })
        }),
        getProgress: builder.query({
            query: (params) => ({
                url: `${BASE_URL}/api/progress/`,
                method: 'GET',
                params: params
            })
        }),
        updateProgress: builder.mutation({
            query: ({ progressId, data }) => ({
                url: `${BASE_URL}/api/progress/${progressId}/`,
                method: 'PUT',
                body: data
            })
        }),
        getLesson: builder.query({
            query: (lessonId) => ({
                url: `${BASE_URL}/api/lessons/${lessonId}/`,
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            }),
            transformResponse: (response) => {
                console.log('Lesson API Response:', response);
                return response;
            }
        })
    })
});

export const {
    useGetCoursesQuery,
    useGetCategoriesQuery,
    useGetBlogsQuery,
    useGetBlogMutation,
    useGetLessonsQuery,
    useGetModulesQuery,
    useGetSubModulesQuery,
    useGetEnrolledCoursesQuery,
    useGetUserCourseProgressQuery,
    useGetProgressQuery,
    useUpdateProgressMutation,
    useGetLessonQuery
} = GetDataSlice;