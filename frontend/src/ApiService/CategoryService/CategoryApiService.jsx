import axios from "axios";
import SecureLS from "secure-ls";
import { toast } from "react-toastify";
import axiosInstance from "../axiosConfig";

const ls = new SecureLS({ encodingType: "aes" });
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const getAllCategories = async () =>
  //   pageNumber = 0,
  //   size = 0,
  //   searchName = ""
  {
    try {
      const token = ls.get("authToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      //   const headers = {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/json",
      //     Accept: "application/json",
      //   };

      // const params = {
      //   pageNumber,
      //   size,
      // };

      //   if (searchName) {
      //     params.name = searchName;
      //   }

      const response = await axios.get(`${API_BASE_URL}/api/v1/categories`, {
        // params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        console.error("Unauthorized access:", error);
      }
      console.error("Error fetching furniture families:", error);
      throw error;
    }
  };

  
export const getCategoriesByType = async (type) => {
  try {
    const token = ls.get("authToken");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/v1/categories/type/${type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error(`Error fetching categories by type ${type}:`, error);
    throw error;
  }
};