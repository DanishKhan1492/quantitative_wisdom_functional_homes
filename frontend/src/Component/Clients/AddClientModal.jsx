import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const AddClientModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  clientData,
}) => {
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    primaryContactName: "",
    websiteUrl: "",
    streetAddress: "",
    city: "",
    stateProvince: "",
    country: "",
    status: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing && clientData) {
      setNewClient({
        ...clientData,
        status: clientData.status ?? true,
      });
    } else {
      setNewClient({
        name: "",
        email: "",
        phoneNumber: "",
        primaryContactName: "",
        websiteUrl: "",
        streetAddress: "",
        city: "",
        stateProvince: "",
        country: "",
        status: true,
      });
    }
  }, [isEditing, clientData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await onSubmit(newClient);
      setNewClient({
        name: "",
        email: "",
        phoneNumber: "",
        primaryContactName: "",
        websiteUrl: "",
        streetAddress: "",
        city: "",
        stateProvince: "",
        country: "",
        status: true,
      });
      if (result) {
        onClose();
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewClient((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const CheckboxField = ({ label, id, name, checked, onChange }) => (
    <div className="flex items-center group">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-6 w-6 text-black bg-black border-slate-500 rounded focus:ring-blue-500/20"
      />
      <label
        htmlFor={id}
        className="ml-2 block text-lg text-black group-hover:text-blue-400 transition-colors duration-200"
      >
        {label}
      </label>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 custom-scrollbar">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-black rounded-2xl w-full max-w-[1500px] mx-4 overflow-hidden shadow-2xl custom-scrollbar"
      >
        {/* Header */}
        <div className="bg-black p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? "Update Client" : "Create Client"}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white p-2 rounded-full transition-colors"
              aria-label="Close Modal"
            >
              <X size={24} />
            </motion.button>
          </div>
        </div>

        {/* Form Container */}
        <div className="overflow-y-auto max-h-[80vh] p-6 bg-white custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Client Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                Client Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Name<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      name="name"
                      value={newClient.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter client name"
                      className="w-full px-4 py-3 text-xl border border-black rounded-xl text-black placeholder-black transition-all duration-300 ease-in-out focus:border-blue-500 hover:border-blue-400"
                    />
                  </div>
                </div>
                <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={newClient.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter email address"
                      className="w-full px-4 py-3 text-xl border border-black rounded-xl text-black placeholder-black transition-all duration-300 ease-in-out focus:border-blue-500 hover:border-blue-400"
                    />
                  </div>
                </div>
                <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Phone Number<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={newClient.phoneNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 text-xl border border-black rounded-xl text-black placeholder-black transition-all duration-300 ease-in-out focus:border-blue-500 hover:border-blue-400"
                    />
                  </div>
                </div>
                <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Primary Contact Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="primaryContactName"
                      name="primaryContactName"
                      value={newClient.primaryContactName}
                      onChange={handleInputChange}
                      placeholder="Enter primary contact name"
                      className="w-full px-4 py-3 text-xl border border-black rounded-xl text-black placeholder-black transition-all duration-300 ease-in-out focus:border-blue-500 hover:border-blue-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                Address Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Street Address<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      value={newClient.streetAddress}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter street address"
                      className="w-full px-4 py-3 text-xl border border-black rounded-xl text-black placeholder-black transition-all duration-300 ease-in-out focus:border-blue-500 hover:border-blue-400"
                    />
                  </div>
                </div>
                <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    City<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={newClient.city}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter city"
                      className="w-full px-4 py-3 text-xl border border-black rounded-xl text-black placeholder-black transition-all duration-300 ease-in-out focus:border-blue-500 hover:border-blue-400"
                    />
                  </div>
                </div>
                <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    State/Province<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="stateProvince"
                      name="stateProvince"
                      value={newClient.stateProvince}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter state or province"
                      className="w-full px-4 py-3 text-xl border border-black rounded-xl text-black placeholder-black transition-all duration-300 ease-in-out focus:border-blue-500 hover:border-blue-400"
                    />
                  </div>
                </div>
                <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Country<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={newClient.country}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter country"
                      className="w-full px-4 py-3 text-xl border border-black rounded-xl text-black placeholder-black transition-all duration-300 ease-in-out focus:border-blue-500 hover:border-blue-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Other Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                Other Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Website URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      id="websiteUrl"
                      name="websiteUrl"
                      value={newClient.websiteUrl}
                      onChange={handleInputChange}
                      placeholder="Enter website URL"
                      className="w-full px-4 py-3 text-xl border border-black rounded-xl text-black placeholder-black transition-all duration-300 ease-in-out focus:border-blue-500 hover:border-blue-400"
                    />
                  </div>
                </div>

                <div className="flex gap-6 items-center mt-8">
                  <CheckboxField
                    label="Active"
                    id="status"
                    name="status"
                    checked={newClient.status}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-slate-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                type="button"
                className="px-6 py-2 bg-black/30 text-xl text-black rounded-xl transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-2 bg-black text-xl text-white rounded-xl hover:bg-blue-600 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">Loading...</div>
                ) : isEditing ? (
                  "Update Client"
                ) : (
                  "Add Client"
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddClientModal;
