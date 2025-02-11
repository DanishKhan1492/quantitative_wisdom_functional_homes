import axios from "axios";
import SecureLS from "secure-ls";
import { toast } from "react-toastify";

const ls = new SecureLS({ encodingType: "aes" });
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// Create new sub-family
export const createSubFamily = async (familyId, subFamilyData) => {
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

    const response = await axios.post(
      `${API_BASE_URL}/api/v1/furniture-families/${familyId}/sub-families`,
      subFamilyData,
      { headers }
    );

    if (response.status === 200) {
      toast.success("Sub-family created successfully");
      return response.data;
    }
  } catch (error) {
    toast.error("Failed to create sub-family");
    console.error(
      "Error creating sub-family:",
      error.response || error.message
    );
    throw error;
  }
};

// get all sub families

export const getAllSubFamilies = async (
  page = 0,
  size = 10,

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
    const params = { page, size };
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/furniture-families/sub-families`,
      { params, headers }
    );
    return response.data; // Expected response: { data: [...], totalPages, totalElements, pageNumber, size }
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
      toast.error("Unauthorized access. Please login again.");
    }
    console.error("Error fetching sub-family:", error);
    throw error;
  }
};

// export const getAllSubFamilies = async () => {
//   try {
//     const token = ls.get("authToken");
//     if (!token) {
//       throw new Error("Authentication token not found");
//     }

//     const headers = {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     };

//     const response = await axios.get(
//       `${API_BASE_URL}/api/v1/furniture-families/sub-families`,
//       { headers }
//     );

//     return response.data;
//   } catch (error) {
//     if (error.response?.status === 401) {
//       console.error("Unauthorized access:", error);
//       toast.error("Unauthorized access. Please login again.");
//     }
//     console.error("Error fetching sub-family:", error);
//     throw error;
//   }
// };

// Get sub-family by ID
export const getSubFamilyById = async (subFamilyId) => {
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
      `${API_BASE_URL}/api/v1/furniture-families/sub-families/${subFamilyId}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
      toast.error("Unauthorized access. Please login again.");
    }
    console.error("Error fetching sub-family:", error);
    throw error;
  }
};


// Update sub-family
export const updateSubFamily = async (subFamilyId, subFamilyData) => {
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

    const response = await axios.put(
      `${API_BASE_URL}/api/v1/furniture-families/sub-families/${subFamilyId}`,
      subFamilyData,
      { headers }
    );

    if (response.status === 200) {
      toast.success("Sub-family updated successfully");
      return response.data;
    }
  } catch (error) {
    toast.error("Failed to update sub-family");
    console.error("Error updating sub-family:", error);
    throw error;
  }
};

// Delete sub-family
export const deleteSubFamily = async (subFamilyId) => {
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
      `${API_BASE_URL}/api/v1/furniture-families/sub-families/${subFamilyId}`,
      { headers }
    );

    toast.success("Sub-family deleted successfully");
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
      toast.error("Unauthorized access. Please login again.");
    } else {
      console.error("Error deleting sub-family:", error);
      toast.error("Failed to delete sub-family");
    }
    throw error;
  }
};

export const getSubFamilyByFamilyId = async (familyId) => {
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
      `${API_BASE_URL}/api/v1/furniture-families/${familyId}/sub-families`,
      { headers }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
      toast.error("Unauthorized access. Please login again.");
    }
    console.error("Error fetching sub-family:", error);
    throw error;
  }
};