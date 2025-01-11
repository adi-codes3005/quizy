import axios from 'axios';

const BASE_URL = 'http://localhost:5001'; // Your backend API base URL

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    return response.data; // Return the response data (e.g., token)
  } catch (error) {
    console.error('Error during login:', error);
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, { username, email, password });
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error during registration:', error);
    throw error.response ? error.response.data : new Error('Network error');
  }
};