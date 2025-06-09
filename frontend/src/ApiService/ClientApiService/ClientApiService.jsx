// src/services/clientService.js

import axios from "axios";
import SecureLS from "secure-ls";
import axiosInstance from "../axiosConfig";
const ls = new SecureLS({ encodingType: "aes" });
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const createClient = async (clientData) => {
  const url = `${API_BASE_URL}/api/v1/clients`;
  try {
    const token = ls.get("authToken");
    const response = await axiosInstance.post(url, clientData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log(response, "---------------");

    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error in createClient:", error.response || error.message);
    throw error;
  }
};

export const getAllClients = async (
  pageNumber = 0,
  size = 10,
  sort = ["createdAt,desc"]
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
      page: pageNumber,
      size: size,
      sort: sort.join(","),
    };

    const response = await axios.get(`${API_BASE_URL}/api/v1/clients`, {
      params,
      headers,
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
      // Optionally, handle token refresh or redirect to login
    }
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const getClientById = async (clientId) => {
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
      `${API_BASE_URL}/api/v1/clients/${clientId}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error fetching client by ID:", error);
    throw error;
  }
};

export const updateClient = async (clientId, clientData) => {
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
      `${API_BASE_URL}/api/v1/clients/${clientId}`,
      clientData,
      { headers }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
      // Optionally, handle token refresh or redirect to login
    }
    console.error("Error updating client:", error);
    throw error;
  }
};

export const deleteClient = async (clientId) => {
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

    const url = `${API_BASE_URL}/api/v1/clients/${clientId}`;
    console.log("Deleting client at URL:", url); // Debugging log
    await axios.delete(url, { headers });

    return;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
      // Optionally, handle token refresh or redirect to login
    }
    console.error("Error deleting client:", error);
    throw error;
  }
};

export const updateClientStatus = async (clientId, status) => {
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

    const url = `${API_BASE_URL}/api/v1/clients/${clientId}/${status}`;
    const response = await axiosInstance.put(url, {}, { headers });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error updating client status:", error);
    throw error;
  }
};



export const getAllActiveClients = async (
  pageNumber = 0,
  size = 10,
  sort = ["createdAt,desc"]
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
      page: pageNumber,
      size: size,
      sort: sort.join(","),
    };

    const response = await axios.get(`${API_BASE_URL}/api/v1/clients/active`, {
      params,
      headers,
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
      // Optionally, handle token refresh or redirect to login
    }
    console.error("Error fetching clients:", error);
    throw error;
  }
};