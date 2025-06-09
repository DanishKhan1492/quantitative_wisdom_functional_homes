import axios from "axios";
import SecureLS from "secure-ls";
import { toast } from "react-toastify";
import axiosInstance from "../axiosConfig";
const ls = new SecureLS({ encodingType: "aes" });
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// Helper function to get headers with authorization token
const getHeaders = () => {
  const token = ls.get("authToken");
  if (!token) {
    throw new Error("Authentication token not found");
  }
  return {
    Authorization: `Bearer ${token}`
  };
};


export const createProduct = async (formData) => {
  const url = `${API_BASE_URL}/api/v1/products`;

  try {
    const response = await axiosInstance.post(url, formData, {
      headers: {
        ...getHeaders(), // Include authorization token
        "Content-Type": "multipart/form-data", // Ensure proper content type
      },
    });

    toast.success("Product created successfully");
    return response.data;
  } catch (error) {
    toast.error("Failed to create product");
    console.error("Error in createProduct:", error.response || error.message);
    throw error;
  }
};


export const updateProduct = async (productId, formData) => {
  try {
    const response = await axiosInstance.put(
      `${API_BASE_URL}/api/v1/products/${productId}`,
      formData,
      {
        headers: {
          ...getHeaders(), // Include authorization token
          "Content-Type": "multipart/form-data", // Ensure proper content type
        },
      }
    );
    toast.success("Product Updated successfully");
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const getAllProducts = async (
  pageNumber = 0,
  size = 0,
  searchName = "",
  searchSku = ""
) => {
  try {
    const params = {
      page: pageNumber,
      size,
      sort: "createdAt,desc",
    };

    if (searchName) {
      params.name = searchName;
    }

    if (searchSku) {
      params.sku = searchSku;
    }

    const response = await axios.get(`${API_BASE_URL}/api/v1/products`, {
      params,
      headers: getHeaders(),
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error fetching products:", error);
    throw error;
  }
};
export const getAllProductsByFamilyAndSubFamily = async (
  familyId,
  subFamilyId,
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/products/family/${familyId}/subfamily/${subFamilyId}`,
      {
        headers: getHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/products/${productId}`,
      {
        headers: getHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};


export const getProductBySku = async (sku) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/products/sku/${sku}`,
      {
        headers: getHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error fetching product by SKU:", error);
    throw error;
  }
};

export const updateProductImages = async (productId, images) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/products/${productId}/images`,
      { images },
      {
        headers: getHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error updating product images:", error);
    throw error;
  }
};

export const patchProduct = async (productId, status) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/products/${productId}?status=${status}`,
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
    console.error("Error partially updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/v1/products/${productId}`, {
      headers: getHeaders(),
    });

    toast.success("Product deleted successfully");
    return;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error deleting product:", error);
    throw error;
  }
};

