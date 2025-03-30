import axios from "axios";
import SecureLS from "secure-ls";
import { toast } from "react-toastify";
import axiosInstance from "../axiosConfig";

const ls = new SecureLS({ encodingType: "aes" });
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
export const createFurnitureFamily = async (furnitureFamilyData) => {
  const url = `${API_BASE_URL}/api/v1/furniture-families`;

  try {
    const token = ls.get("authToken");
    const response = await axiosInstance.post(url, furnitureFamilyData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      toast.success("Furniture family created successfully");
      return response.data;
    }

  } catch (error) {
    
    toast.error(response.data.message );
    console.error(
      "Error in createFurnitureFamily:",
      error.response || error.message
    );
    throw error;
  }
};

export const getAllFurnitureFamilies = async (
  pageNumber = 0,
  size = 10,
  searchName = ""
) => {
  try {
    const token = ls.get("authToken");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const params = {
      page: pageNumber - 1,
      size,
      sort: "createdAt,desc",
    };

    if (searchName) {
      params.name = searchName;
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/v1/furniture-families`,
      {
        params,
        headers,
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error fetching furniture families:", error);
    throw error;
  }
};

export const getFurnitureFamilyById = async (furnitureFamilyId) => {
  try {
    const token = ls.get("authToken");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const response = await axios.get(
      `${API_BASE_URL}/api/v1/furniture-families/${furnitureFamilyId}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error fetching furniture family by ID:", error);
    throw error;
  }
};

export const updateFurnitureFamily = async (
  furnitureFamilyId,
  furnitureFamilyData
) => {
  try {
    const token = ls.get("authToken");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const response = await axiosInstance.put(
      `${API_BASE_URL}/api/v1/furniture-families/${furnitureFamilyId}`,
      furnitureFamilyData,
      { headers }
    );
    if(response.status === 200){
      
      toast.success("Furniture family updated successfully");
      return response.data;
    }

  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    toast.error(error.message);
    console.error("Error updating furniture family:", error);
    throw error;
  }
};

export const deleteFurnitureFamily = async (furniture) => {
  try {
    const token = ls.get("authToken");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    await axios.delete(
      `${API_BASE_URL}/api/v1/furniture-families/${furniture.familyId}`,
      { headers }
    );

    toast.success("Furniture family deleted successfully");
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
      toast.error("Unauthorized access. Please login again.");
    } else {
      console.error("Error deleting furniture family:", error);
      toast.error("Failed to delete furniture family");
    }
    throw error;
  }
};
