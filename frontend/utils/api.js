  // src/utils/api.js

  // Get the base URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Helper to build full API URLs
  export const apiUrl = (path) => `${API_BASE_URL}${path}`;

  // Example usage for fetch/axios:
  // fetch(apiUrl('/api/events'))
  // axios.get(apiUrl('/api/events'))

  export default API_BASE_URL;