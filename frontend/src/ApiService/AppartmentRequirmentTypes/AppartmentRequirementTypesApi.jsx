import axios from "axios";
import SecureLS from "secure-ls";
import { toast } from "react-toastify";
import axiosInstance from "../axiosConfig";

const ls = new SecureLS({ encodingType: "aes" });
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;


export const createApartmentRequirement = async (requirementData) => {
  const url = `${API_BASE_URL}/api/v1/apartment-type-requirements`;

  try {
    const token = ls.get("authToken");
    const response = await axios.post(url, requirementData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 201) {
      toast.success("Apartment requirement created successfully");
      return response.data;
    }
  } catch (error) {
    toast.error("Failed to create apartment requirement");
    console.error(
      "Error in createApartmentRequirement:",
      error.response || error.message
    );
    throw error;
  }
};


export const getAllApartmentRequirements = async () => {
  try {
    const token = ls.get("authToken");
    if (!token) throw new Error("Authentication token not found");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const response = await axios.get(
      `${API_BASE_URL}/api/v1/apartment-type-requirements`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching apartment requirements:", error);
    throw error;
  }
};


export const getApartmentRequirementById = async (id) => {
  try {
    const token = ls.get("authToken");
    if (!token) throw new Error("Authentication token not found");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const response = await axios.get(
      `${API_BASE_URL}/api/v1/apartment-type-requirements/${id}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching apartment requirement by ID:", error);
    throw error;
  }
};


export const updateApartmentRequirement = async (id, requirementData) => {
  try {
    const token = ls.get("authToken");
    if (!token) throw new Error("Authentication token not found");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const response = await axiosInstance.put(
      `${API_BASE_URL}/api/v1/apartment-type-requirements/${id}`,
      requirementData,
      { headers }
    );
    if (response.status === 200) {
      toast.success("Apartment requirement updated successfully");
      return response.data;
    }
  } catch (error) {
    console.error("Error updating apartment requirement:", error);
    toast.error("Failed to update apartment requirement");
    throw error;
  }
};


export const deleteApartmentRequirement = async (id) => {
  try {
    const token = ls.get("authToken");
    if (!token) throw new Error("Authentication token not found");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    await axios.delete(
      `${API_BASE_URL}/api/v1/apartment-type-requirements/${id}`,
      {
        headers,
      }
    );
    toast.success("Apartment requirement deleted successfully");
  } catch (error) {
    console.error("Error deleting apartment requirement:", error);
    toast.error("Failed to delete apartment requirement");
    throw error;
  }
};
