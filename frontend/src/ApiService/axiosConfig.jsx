import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const setupInterceptors = ({ startLoading, stopLoading }) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      startLoading();
      return config;
    },
    (error) => {
      stopLoading();
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      stopLoading();
      return response;
    },
    (error) => {
      stopLoading();
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
