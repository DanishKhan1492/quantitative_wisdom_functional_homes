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
    const expirationTime = ls.get("tokenExpiration");

    if (token && expirationTime) {
      const currentTime = Date.now();
      if (currentTime < expirationTime) {
        return true;
      } else {
        // Token is expired, remove it
        ls.remove("authToken");
        ls.remove("tokenExpiration");
        return false;
      }
    }
    return false;
  });

  const handleLogin = (token, expirationTime) => {
    ls.set("authToken", token);
    ls.set("tokenExpiration", expirationTime);
  
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    ls.remove("authToken");
    ls.remove("tokenExpiration");
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
                  <Route path="/supplier" element={<ShowSupplierRecord />} />
                  <Route
                    path="/supplier-details/:supplierId"
                    element={<SupplierDetails />}
                  />
                  <Route path="/client" element={<ClientList />} />
                  <Route path="/clients/:id" element={<ClientDetails />} />
                  <Route path="/apartment" element={<AppartmentList />} />
                  <Route path="/dashboard" element={<Dashboard />} />

                  <Route
                    path="/apartment-details/:id"
                    element={<ApartmentDetailsPage />}
                  />
                  <Route
                    path="/furniture-management"
                    element={<FurnitureList />}
                  />
                  <Route
                    path="/furniture-sub-families"
                    element={<SubFamiliesList />}
                  />
                  <Route
                    path="/product-catalogue"
                    element={<ProductCatalogueList />}
                  />
                  <Route
                    path="/product-details/:id"
                    element={<ProductDetails />}
                  />
                  <Route path="/colours" element={<ColoursList />} />
                  <Route path="/material" element={<MaterialsList />} />
                  <Route path="/proposal" element={<ProposalList />} />
                  <Route
                    path="/proposal-details/:id"
                    element={<ProposalDetails />}
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
