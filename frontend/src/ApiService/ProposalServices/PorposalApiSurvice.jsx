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



export const createProposal = async (proposalData) => {
  const url = `${API_BASE_URL}/api/v1/proposals`;

  try {
    const response = await axiosInstance.post(url, proposalData, {
      headers: getHeaders(),
    });

    toast.success("Proposal created successfully");
    return response.data;
  } catch (error) {
    toast.error("Failed to create proposal");
    console.error("Error in createProposal:", error.response || error.message);
    throw error;
  }
};

export const getAllProposals = async (
  page = 0,
  size = 10,
  sort,
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/proposals`, {
      params: { page, size, sort : "createdAt,desc" },
      headers: getHeaders(),
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error fetching proposals:", error);
    throw error;
  }
};

export const getProposalById = async (proposalId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/proposals/${proposalId}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error fetching proposal:", error);
    throw error;
  }
};

export const updateProposal = async (proposalId, proposalData) => {
  try {
    const response = await axiosInstance.put(
      `${API_BASE_URL}/api/v1/proposals/${proposalId}`,
      proposalData,
      { headers: getHeaders() }
    );
    toast.success("Proposal updated successfully");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update proposal");
    console.error("Error updating proposal:", error);
    throw error;
  }
};

export const deleteProposal = async (proposalId) => {
  try {
    await axiosInstance.delete(
      `${API_BASE_URL}/api/v1/proposals/${proposalId}`,
      { headers: getHeaders() }
    );
    toast.success("Proposal deleted successfully");
  } catch (error) {
    toast.error("Failed to delete proposal");
    console.error("Error deleting proposal:", error);
    throw error;
  }
};

export const finalizeProposal = async (proposalId) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/v1/proposals/${proposalId}/finalize`,
      null,
      { headers: getHeaders() }
    );
    toast.success("Proposal finalized successfully");
    return response.data;
  } catch (error) {
    toast.error("Failed to finalize proposal");
    console.error("Error finalizing proposal:", error);
    throw error;
  }
};

export const approveProposal = async (proposalId) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/v1/proposals/${proposalId}/approve`,
      null,
      { headers: getHeaders() }
    );
    toast.success("Proposal approved successfully");
    return response.data;
  } catch (error) {
    toast.error("Failed to approve proposal");
    console.error("Error approving proposal:", error);
    throw error;
  }
};

export const exportProposalPdf = async (proposalId) => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/v1/proposals/${proposalId}/export/pdf`,
      {
        headers: getHeaders(),
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error exporting PDF:", error);
    throw error;
  }
};

export const exportProposalExcel = async (proposalId) => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/v1/proposals/${proposalId}/export/excel`,
      {
        headers: getHeaders(),
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error exporting Excel:", error);
    throw error;
  }
};
