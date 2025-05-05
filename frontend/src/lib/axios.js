import axios from "axios"; // Import the Axios library for making HTTP requests

// Create an Axios instance with default configuration
export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5073/api" : "/api", 
  // Set the base URL for API requests based on the environment (development or production)
  withCredentials: true, // Include credentials (cookies) with requests
});