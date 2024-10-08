import axios from 'axios';

const api = axios.create({
  baseURL: '//34.222.114.62:8080/api',
  // Remove the withCredentials option if not using cookies
  // withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
  // test
}); 



export const register = (data: { username: string; email: string; password: string; role: string; active: boolean }) => 
  api.post('/users/register', data);

export const login = (data: { username: string; password: string }) => 
  api.post('/users/login', data);

// export const getBookingsByUserId = async () => {
//   try {
//     const response = await api.get(`/bookings/user/2`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching bookings:', error);
//     throw error;
//   }
// };
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
