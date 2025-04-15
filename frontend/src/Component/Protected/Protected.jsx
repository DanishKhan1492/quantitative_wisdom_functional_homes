import React, { useEffect } from "react";
import SecureLS from "secure-ls";
import jwtDecode from "jwt-decode"

// Initialize SecureLS with AES encoding.
const ls = new SecureLS({ encodingType: "aes" });

const Protected = ({ children, logout }) => {


    console.log("Protected component rendered");
  useEffect(() => {
    // Attempt to retrieve the stored token and its expiration time.
    const authToken = ls.get("authToken");
    const decodedToken = jwtDecode(authToken)
    const tokenExpiration = decodedToken.exp * 1000; // Convert to milliseconds
    console.log("Decoded token:", tokenExpiration);
    // If token or expiration is missing, redirect immediately.
    if (!authToken || !tokenExpiration) {
      window.location.href = "/login";
      return;
    } 

    

    // Parse the expiration time (assumed to be stored as a numeric timestamp).
    const expirationTime = parseInt(tokenExpiration, 10);
    const currentTime = Date.now();
    console.log("Current time:", currentTime);
    console.log("Expiration time:", expirationTime);
    console.log("token expired:", currentTime > expirationTime);

    // If current time is past the expiration time, clear storage and redirect.
    if (currentTime > expirationTime) {
        console.log("Token has expired or is invalid.");
        logout()
     
     
    }
  }, []);

  // If no redirection happens, render the protected children.
  return <>{children}</>;
};

export default Protected;
