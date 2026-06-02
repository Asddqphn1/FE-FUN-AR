import { useAuthStore } from '../store/useAuthStore';

// Retrieve base URL from environment variables, fallback to localhost if not set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const { accessToken } = useAuthStore.getState();
  const headers = new Headers(options.headers);

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle common errors (e.g., unauthorized)
  if (response.status === 401) {
    useAuthStore.getState().logout();
    throw new Error('Unauthorized. Please log in again.');
  }

  // If response is not ok, try to extract error message
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      // Ignored
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Ensure VITE_API_URL can be read
export { API_BASE_URL };
