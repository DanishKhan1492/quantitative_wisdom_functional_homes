// src/services/colorService.js

import axios from "axios";
import SecureLS from "secure-ls";
import { toast } from "react-toastify";

const ls = new SecureLS({ encodingType: "aes" });
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const createColour = async (colorData) => {
  const url = `${API_BASE_URL}/api/v1/colours`;
  try {
    const token = ls.get("authToken");
    const response = await axios.post(url, colorData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log(response ,"---------------")
    

    if (response.status === 201){

      return response.data;
    }
  } catch (error) {
    console.error("Error in createColour:", error.response || error.message);
    throw error;
  }
};

export const getAllColours = async (
  pageNumber = 0,
  size = 10,
  searchName = "",
  searchCode = ""
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
    };

    if (searchName) {
      params.name = searchName;
    }

    if (searchCode) {
      params.code = searchCode;
    }

    const response = await axios.get(`${API_BASE_URL}/api/v1/colours`, {
      params,
      headers,
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
      // Optionally, handle token refresh or redirect to login
    }
    console.error("Error fetching colors:", error);
    throw error;
  }
};

export const getColourById = async (colourId) => {
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
      `${API_BASE_URL}/api/v1/colours/${colourId}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
    }
    console.error("Error fetching color by ID:", error);
    throw error;
  }
};

export const updateColour = async (colourId, colorData) => {
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
      `${API_BASE_URL}/api/v1/colours/${colourId}`,
      colorData,
      { headers }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
      // Optionally, handle token refresh or redirect to login
    }
    console.error("Error updating color:", error);
    throw error;
  }
};

export const deleteColour = async (colourId) => {
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

    const url = `${API_BASE_URL}/api/v1/colours/${colourId}`;
    console.log("Deleting color at URL:", url); // Debugging log
    await axios.delete(url, { headers });

    return;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access:", error);
      // Optionally, handle token refresh or redirect to login
    }
    console.error("Error deleting color:", error);
    throw error;
  }
};

// // src/services/colorService.js

// import axios from "axios";
// import SecureLS from "secure-ls";

// const ls = new SecureLS({ encodingType: "aes" });
// const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// export const createColour = async (colorData) => {
//   const url = `${API_BASE_URL}/api/v1/colours`;
//   try {
//     const token = ls.get("authToken");
//     const response = await axios.post(url, colorData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//     });

//     if (response.data && response.data.error) {
//       throw new Error(response.data.message || "Failed to create color.");
//     }

//     return response.data;
//   } catch (error) {
//     console.error("Error in createColour:", error.response || error.message);
//     throw error;
//   }
// };

// export const getAllColours = async (
//   pageNumber = 0,
//   size = 10,
//   searchName = "",
//   searchCode = ""
// ) => {
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

//     const params = {
//       page: pageNumber,
//       size: size,
//     };

//     if (searchName) {
//       params.name = searchName;
//     }

//     if (searchCode) {
//       params.code = searchCode;
//     }

//     const response = await axios.get(`${API_BASE_URL}/api/v1/colours`, {
//       params,
//       headers,
//     });

//     return response.data;
//   } catch (error) {
//     if (error.response?.status === 401) {
//       console.error("Unauthorized access:", error);
//       // Optionally, handle token refresh or redirect to login
//     }
//     console.error("Error fetching colors:", error);
//     throw error;
//   }
// };

// export const getColourById = async (colorId) => {
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
//       `${API_BASE_URL}/api/v1/colours/${colorId}`,
//       {
//         headers,
//       }
//     );

//     return response.data;
//   } catch (error) {
//     if (error.response?.status === 401) {
//       console.error("Unauthorized access:", error);
//       // Optionally, handle token refresh or redirect to login
//     }
//     console.error("Error fetching color by ID:", error);
//     throw error;
//   }
// };

// export const updateColour = async (colorId, colorData) => {
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

//     const response = await axios.put(
//       `${API_BASE_URL}/api/v1/colours/${colorId}`,
//       colorData,
//       { headers }
//     );

//     return response.data;
//   } catch (error) {
//     if (error.response?.status === 401) {
//       console.error("Unauthorized access:", error);
//       // Optionally, handle token refresh or redirect to login
//     }
//     console.error("Error updating color:", error);
//     throw error;
//   }
// };

// export const deleteColour = async (colorId) => {
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

//     await axios.delete(`${API_BASE_URL}/api/v1/colours/${colorId}`, {
//       headers,
//     });

//     return;
//   } catch (error) {
//     if (error.response?.status === 401) {
//       console.error("Unauthorized access:", error);
//       // Optionally, handle token refresh or redirect to login
//     }
//     console.error("Error deleting color:", error);
//     throw error;
//   }
// };
