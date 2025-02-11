// src/ApiService/MaterialService/MaterialService.js

import axios from "axios";
import SecureLS from "secure-ls";
import { toast } from "react-toastify";
const ls = new SecureLS({ encodingType: "aes" });
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const getAllMaterials = async (page = 0, size = 10, sort = []) => {
  try {
    const token = ls.get("authToken");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.get(`${API_BASE_URL}/api/v1/materials`, {
      params: { page, size, sort },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return response.data; // Expected to have 'content', 'totalPages', 'totalElements', etc.
  } catch (error) {
    console.error("Error fetching materials:", error);
    throw error;
  }
};

export const createMaterial = async (materialData) => {
  try {
    const token = ls.get("authToken");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/v1/materials`,
      materialData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (response.status === 201) {
      toast.success("Material created successfully");
      return response.data;
    }
  } catch (error) {
    console.error("Error creating material:", error);
    throw error;
  }
};

/**
 * Delete a material by its ID.
 * @param {number} materialId - The ID of the material to delete.
 * @returns {Promise<void>}
 */
export const deleteMaterial = async (materialId) => {
  try {
    const token = ls.get("authToken");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    await axios.delete(`${API_BASE_URL}/api/v1/materials/${materialId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  } catch (error) {
    console.error("Error deleting material:", error);
    throw error;
  }
};

/**
 * Update a material by its ID.
 * @param {number} materialId - The ID of the material to update.
 * @param {Object} materialData - The updated material data.
 * @returns {Promise<Object>} - The updated material data.
 */
export const updateMaterial = async (materialId, materialData) => {
  try {
    const token = ls.get("authToken");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/v1/materials/${materialId}`,
      materialData,
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
    console.error("Error updating material:", error);
    throw error;
  }
};

/**
 * Fetch a single material by its ID.
 * @param {number} materialId - The ID of the material to fetch.
 * @returns {Promise<Object>} - The fetched material data.
 */
export const getMaterialById = async (materialId) => {
  try {
    const token = ls.get("authToken");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/v1/materials/${materialId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching material:", error);
    throw error;
  }
};
