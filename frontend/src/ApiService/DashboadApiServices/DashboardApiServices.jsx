import axios from "axios";
import SecureLS from "secure-ls";
import axiosInstance from "../axiosConfig";

const ls = new SecureLS({ encodingType: "aes" });
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const getHeaders = () => {
  const token = ls.get("authToken");
  if (!token) {
    throw new Error("Authentication token not found");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getSupplierMetadata = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/suppliers/metadata`,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching supplier metadata:", error);
    throw error;
  }
};

export const getColourMetadata = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/colours/metadata`,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching colour metadata:", error);
    throw error;
  }
};

export const getMaterialMetadata = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/materials/metadata`,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching material metadata:", error);
    throw error;
  }
};

export const getFurnitureMetadata = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/furniture-families/metadata`,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching furniture metadata:", error);
    throw error;
  }
};

export const getProductsMetadata = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/products/metadata`,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching furniture metadata:", error);
    throw error;
  }
};
export const getProposalMetadata = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/proposals/metadata`,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching furniture metadata:", error);
    throw error;
  }
};


export const getAppartmentMetadata = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/apartment-types/metadata`,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching furniture metadata:", error);
    throw error;
  }
};

