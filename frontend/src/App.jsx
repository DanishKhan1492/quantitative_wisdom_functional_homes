
import React, { useState, useContext, useEffect } from "react";
import "./App.css";
import ShowSupplierRecord from "./Component/Supplier/ShowSupplierRecord";
import SupplierDetails from "./Component/Supplier/SupplierDetails";
import Sidebar from "./Component/Sidebar/Sidebar";
import Navbar from "./Component/Navbar/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import AppartmentList from "./Component/Apparment/AppartmentList";
import FurnitureList from "./Component/FurnitureManagement/FurnitureList";
import ProductCatalogueList from "./Component/ProductCatalogue/ProductCatalogueList";
import ProductDetails from "./Component/ProductCatalogue/ProductDetails";
import Login from "./Component/Auth/Login";
import ColoursList from "./Component/Colours/ColoursList";
import MaterialsList from "./Component/Materials/MaterialList";
import ProposalList from "./Component/Proposal/ProposalList";
import ProposalDetails from "./Component/Proposal/ProposalDetails";
import ApartmentDetailsPage from "./Component/Apparment/ApartmentDetailsPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubFamiliesList from "./Component/FurnitureManagement/SubFamiliesList";
import Dashboard from "./Component/Dashboard/Dashboard";
import { setupInterceptors } from "./ApiService/axiosConfig";
import SecureLS from "secure-ls";
import { LoadingProvider, LoadingContext } from "./contexts/LoadingContext"; // Corrected path
import ClientList from "./Component/Clients/ClientList";
import LoadingOverlay from "./Component/Loading/LoadingOverlay";
import ClientDetails from "./Component/Clients/ClientDetails";
import Protected from "./Component/Protected/Protected";
import jwtDecode from "jwt-decode";
const ls = new SecureLS({ encodingType: "aes" });

function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}

function AppContent() {
  const { loading, startLoading, stopLoading } = useContext(LoadingContext);

  useEffect(() => {
    setupInterceptors({ startLoading, stopLoading });
  }, [startLoading, stopLoading]);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = ls.get("authToken");
    console.log("Token from local storage:", token);
    if (!token) {
      return false; // No token means not authenticated
    }
    const decodedToken = jwtDecode(token);
    const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds

    if (token && expirationTime) {
      const currentTime = Date.now();
      if (currentTime < expirationTime) {
        return true;
      } else {
        // Token is expired, remove it
        ls.remove("authToken");
       
        return false;
      }
    }
    return false;
  });

  const handleLogin = (token) => {
    ls.set("authToken", token); 
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    ls.remove("authToken");
    setIsAuthenticated(false);
  };

  const AuthenticatedLayout = ({ children }) => (
    <div className="flex bg-gray-100">
      <Sidebar onLogout={handleLogout} />
      <div className="h-screen overflow-y-auto flex-1 bg-white">
        <Navbar />
        <main className="">{children}</main>
      </div>
    </div>
  );
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <>
      
      {loading && <LoadingOverlay />}
      <Routes>
        {/* Public Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <Route
            path="/*"
            element={
              <AuthenticatedLayout>
                <Routes>
                  <Route path="/supplier" element={<Protected logout={handleLogout}><ShowSupplierRecord /></Protected>} />
                  <Route
                    path="/supplier-details/:supplierId"
                    element={<SupplierDetails />}
                  />
                  <Route path="/client" element={<Protected logout={handleLogout}><ClientList /></Protected>} />
                  <Route path="/clients/:id" element={<Protected logout={handleLogout}><ClientDetails /></Protected>} />
                  <Route path="/apartment" element={<Protected logout={handleLogout}><AppartmentList /></Protected>} />
                  <Route path="/dashboard" element={<Protected logout={handleLogout}><Dashboard /></Protected>} />

                  <Route
                    path="/apartment-details/:id"
                    element={<Protected logout={handleLogout}><ApartmentDetailsPage /></Protected>}
                  />
                  <Route
                    path="/furniture-management"
                    element={<Protected logout={handleLogout}><FurnitureList /></Protected>}
                  />
                  <Route
                    path="/furniture-sub-families"
                    element={<Protected logout={handleLogout}><SubFamiliesList /></Protected>}
                  />
                  <Route
                    path="/product-catalogue"
                    element={<Protected logout={handleLogout}><ProductCatalogueList /></Protected>}
                  />
                  <Route
                    path="/product-details/:id"
                    element={<Protected logout={handleLogout}><ProductDetails /></Protected>}
                  />
                  <Route path="/colours" element={<Protected logout={handleLogout}><ColoursList /></Protected>} />
                  <Route path="/material" element={<Protected logout={handleLogout}><MaterialsList /></Protected>} />
                  <Route path="/proposal" element={<Protected logout={handleLogout}><ProposalList /></Protected>} />
                  <Route
                    path="/proposal-details/:id"
                    element={<Protected logout={handleLogout}><ProposalDetails /></Protected>}
                  />
                  {/* Redirect any unknown routes to /supplier */}
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </AuthenticatedLayout>
            }
          />
        ) : (
          <Route path="/*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
      <ToastContainer />
     
    </>
  );
}

export default App;
