import { ApiSlice } from './ApiSlice';
import { BASE_URL } from '../Constants';

export const UserApiSlice = ApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login/',
                method: 'POST',
                body: {
                    username: credentials.username,
                    password: credentials.password
                },
                credentials: 'include',
            }),
            invalidatesTags: ['User'],
        }),
        signup: builder.mutation({
            query: (data) => ({
                url: '/auth/register/',
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
            invalidatesTags: ['User'],
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout/',
                method: 'POST',
                credentials: 'include',
            }),
            invalidatesTags: ['User'],
        }),
        profile: builder.query({
            query: () => ({
                url: '/auth/profile/',
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['User'],
        }),
        progress: builder.query({
            query: () => ({
                url: '/auth/progress/',
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['User'],
        }),
    }),
    overrideExisting: false,
});

export const { 
    useLoginMutation, 
    useSignupMutation, 
    useLogoutMutation, 
    useProfileQuery,
    useProgressQuery,
} = UserApiSlice;
