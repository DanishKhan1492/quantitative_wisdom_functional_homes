import axios from "axios";
import SecureLS from "secure-ls";
import { toast } from "react-toastify";
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

export const createSupplier = async (supplierData) => {
  const url = `${API_BASE_URL}/api/v1/suppliers`;
  
  try {
    const token = ls.get("authToken");
    const response = await axiosInstance.post(url, supplierData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
   

    if(response.status === 201){

      toast.success("Supplier created successfully");
       return response.data;
    }

    throw new Error("Failed to create supplier.");
  } catch (error) {
    toast.error("Failed to create supplier");
    console.error("Error in createSupplier:", error.response || error.message);
    throw error;
  }
};


export const getAllSuppliers = async (
  pageNumber = 1, // UI is 1-indexed
  size = 10,
  searchName = "",
  searchPrimaryContactName = ""
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

    // Use "page" (0-indexed for backend) instead of pageNumber
    const params = {
      page: pageNumber - 1,
      size,
      sort: "createdAt,desc",
    };

    if (searchName) {
      params.name = searchName;
    }
    if (searchPrimaryContactName) {
      params.primaryContactName = searchPrimaryContactName;
    }

    const response = await axios.get(`${API_BASE_URL}/api/v1/suppliers`, {
      params,
      headers,
    });
    return response.data; // Expected: { content: [...], totalElements, totalPages, ... }
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};

export const getSupplierById = async (supplierId) => {
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
      `${API_BASE_URL}/api/v1/suppliers/${supplierId}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error fetching supplier by ID:", error);
    throw error;
  }
};

export const updateSupplier = async (supplierId, supplierData) => {
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
      `${API_BASE_URL}/api/v1/suppliers/${supplierId}`,
      supplierData,
      { headers }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error updating supplier:", error);
    throw error;
  }
};

export const deleteSupplier = async (supplierId) => {
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

    await axios.delete(`${API_BASE_URL}/api/v1/suppliers/${supplierId}`, {
      headers,
    });

    return;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error deleting supplier:", error);
    throw error;
  }
};

export const downloadSuppliersExcel = async () => {
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
    const response = await axios.get(`${API_BASE_URL}/api/v1/suppliers/export/excel`, {
      headers,
      responseType: 'blob', // Ensure the response is in binary form (Blob)
    });

    return response.data; // Return the binary data (Excel)
  } catch (error) {
    console.error("Error fetching Excel file:", error);
    throw error;
  }
};

export const patchSupplier = async (supplierId, status) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/suppliers/${supplierId}?status=${status}`,
      {}, // Empty body since status is passed as query parameter
      {
        headers: getHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error partially updating supplier:", error);
    throw error;
  }
};