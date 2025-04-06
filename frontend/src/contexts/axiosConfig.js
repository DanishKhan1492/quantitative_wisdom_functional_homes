import axios from "axios";
import SecureLS from "secure-ls";

const ls = new SecureLS({ encodingType: "aes" });

export const setupInterceptors = ({
  startLoading,
  stopLoading,
  handleLogout,
}) => {
  // Remove any existing interceptors to prevent duplicates
  axios.interceptors.request.eject(axios.interceptors.request.handlers[0]);
  axios.interceptors.response.eject(axios.interceptors.response.handlers[0]);

  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      // Optionally start loading on each request
      startLoading();

      // Add authorization token to headers
      const token = ls.get("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      stopLoading();
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => {
      stopLoading();
      return response;
    },
    (error) => {
      stopLoading();

      // Check if error is due to an expired token (401 Unauthorized)
      if (error.response && error.response.status === 401) {
        // Clear auth data and redirect to login
        if (handleLogout) {
          handleLogout(); // Use the provided logout function
        } else {
          // Fallback if handleLogout is not provided
          ls.remove("authToken");
          ls.remove("tokenExpiration");
          window.location.href = "/";
        }
      }

      return Promise.reject(error);
    }
  );
};

// Base API URLs
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// Create axios instance with base URL
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
