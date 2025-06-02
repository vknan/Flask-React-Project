import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../Constants';

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // Get CSRF token from cookie
    const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    if (csrfToken) {
      headers.set('X-CSRFToken', csrfToken.split('=')[1]);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// A base query that includes logic to refresh tokens if needed
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Try the original request
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 Unauthorized, try to refresh the token
  if (result.error && result.error.status === 401) {
    try {
      // Try refreshing the token
      const refreshResult = await baseQuery({
        url: '/auth/token/refresh/',
        method: 'POST',
        credentials: 'include',
      }, api, extraOptions);

      if (refreshResult.data) {
        // The refresh was successful; retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // If refresh failed, dispatch logout
        api.dispatch({ type: 'auth/logout' });
      }
    } catch (error) {
      // If refresh request fails, dispatch logout
      api.dispatch({ type: 'auth/logout' });
    }
  }
  return result;
};

// Create a base Api slice with no specific endpoints
export const ApiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),  // Empty initially, will be extended by injectEndpoints
  tagTypes: ['User', 'Post', 'Category'],
});
