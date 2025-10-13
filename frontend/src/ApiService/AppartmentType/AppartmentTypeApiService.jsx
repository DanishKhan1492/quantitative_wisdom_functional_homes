import axios from "axios";
import SecureLS from "secure-ls";
import { toast } from "react-toastify";
import axiosInstance from "../axiosConfig";

const ls = new SecureLS({ encodingType: "aes" });
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const createApartmentType = async (apartmentTypeData) => {
  const url = `${API_BASE_URL}/api/v1/apartment-types`;

  try {
    const token = ls.get("authToken");
    const response = await axiosInstance.post(url, apartmentTypeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      toast.success("Apartment type created successfully");
      return response.data;
    }
  } catch (error) {
    toast.error("Failed to create apartment type");
    console.error(
      "Error in createApartmentType:",
      error.response || error.message
    );
    throw error;
  }
};


export const getAllApartmentTypes = async (
  pageNumber = 1, // UI uses 1-indexed page
  size = 10,
  searchName = ""
) => {
  try {
    const token = ls.get("authToken");
    if (!token) throw new Error("Authentication token not found");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // If the backend expects 0-indexed pages, subtract 1:
    const params = {
      page: pageNumber - 1,
      size,
      sort: "createdAt,desc",
    };

    if (searchName) {
      params.name = searchName;
    }

    const response = await axios.get(`${API_BASE_URL}/api/v1/apartment-types`, {
      params,
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching apartment types:", error);
    throw error;
  }
};

export const getApartmentTypeById = async (apartmentTypeId) => {
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
      `${API_BASE_URL}/api/v1/apartment-types/${apartmentTypeId}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error fetching apartment type by ID:", error);
    throw error;
  }
};

export const updateApartmentType = async (
  apartmentTypeId,
  apartmentTypeData
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
      `${API_BASE_URL}/api/v1/apartment-types/${apartmentTypeId}`,
      apartmentTypeData,
      { headers }
    );

    if (response.status === 200) {
      toast.success("Apartment type updated successfully");
      return response.data;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    toast.error(error.message);
    console.error("Error updating apartment type:", error);
    throw error;
  }
};

export const deleteApartmentType = async (apartmentTypeId) => {
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
      `${API_BASE_URL}/api/v1/apartment-types/${apartmentTypeId}`,
      { headers }
    );

    toast.success("Apartment type deleted successfully");
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
      toast.error("Unauthorized access. Please login again.");
    } else {
      console.error("Error deleting apartment type:", error);
      toast.error("Failed to delete apartment type");
    }
    throw error;
  }
};


export const downloadApartmentTypesExcel = async () => {
  try {
    const token = ls.get("authToken");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel MIME type
    };

    // Make the API request to fetch the Excel file
    const response = await axios.get(`${API_BASE_URL}/api/v1/apartment-types/export/excel`, {
      headers,
      responseType: 'blob', // Ensure the response is in binary form (Blob)
    });

    return response.data; // Return the binary data (Excel)
  } catch (error) {
    console.error("Error fetching Excel file:", error);
    throw error;
  }
};