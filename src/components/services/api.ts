import axios from 'axios';

const api = axios.create({
  baseURL: 'http://34.222.87.166:8080/api',
  // Remove the withCredentials option if not using cookies
  // withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data: { username: string; email: string; password: string; role: string; active: boolean }) => 
  api.post('/users/register', data);

export const login = (data: { username: string; password: string }) => 
  api.post('/users/login', data);

export const getBookingsByUserId = async () => {
  try {
    const response = await api.get(`/bookings/user/2`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};
// Function to get the list of movies
export const getMovies = () => 
  api.get('/movies');

// Function to get shows by movie ID
export const getShowsByMovieId = async (movieId: number) => {
  try {
    const response = await api.get(`/shows/by-movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching shows:', error);
    throw error;
  }
};

export default api;
