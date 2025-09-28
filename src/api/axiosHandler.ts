import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (for auth token)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or from AuthContext
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (optional: error handling)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let message = "Something went wrong!";

    if (error.response) {
      // Server responded with a status code outside 2xx
      message = (error.response.data as any)?.message || error.response.statusText;
    } else if (error.request) {
      // Request was made but no response
      message = "No response from server. Please check your network.";
      
    } else {
      // Something happened setting up the request
      message = error.message;
    }
    toast.error(message)
    console.error("API Error:", message);
    return Promise.reject({ ...error, message });
  }
);


export default axiosInstance;
