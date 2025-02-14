import axiosInstance from "../axiosConfig"; // Corrected path

export const login = async ({ username, password }) => {
  const url = `/api/v1/auth/login`;
  try {
    const response = await axiosInstance.post(url, { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};
