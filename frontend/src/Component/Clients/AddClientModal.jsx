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
  // Updated client object based on your JSON schema
  const [client, setClient] = useState({
    name: "",
    email: "",
    secondaryEmail: "",
    phone: "",
    secondaryPhone: "",
    address: "",
    status: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing && clientData) {
      setClient({
        ...clientData,
        status: clientData.status !== undefined ? clientData.status : true,
      });
    } else {
      setClient({
        name: "",
        email: "",
        secondaryEmail: "",
        phone: "",
        secondaryPhone: "",
        address: "",
        status: true,
      });
    }
  }, [isEditing, clientData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClient((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await onSubmit(client);
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

  // Reusable Checkbox field component
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

        {/* Form */}
        <div className="overflow-y-auto max-h-[80vh] p-6 bg-white custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Client Information */}
            <div>
              <h3 className="text-xl font-semibold text-black mb-6">
                Client Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={client.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter client name"
                    className="w-full px-4 py-3 text-xl border border-black rounded-xl text-black placeholder-black transition-all duration-300 ease-in-out focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
                <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={client.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 text-xl border border-black rounded-xl text-black placeholder-black transition-all duration-300 ease-in-out focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
                <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2">
                    Secondary Email
                  </label>
                  <input
                    type="email"
                    name="secondaryEmail"
                    value={client.secondaryEmail}
                    onChange={handleInputChange}
                    placeholder="Enter secondary email"
                    className="w-full px-4 py-3 text-xl border border-black rounded-xl text-black placeholder-black transition-all duration-300 ease-in-out focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
                <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={client.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 text-xl border border-black rounded-xl text-black placeholder-black transition-all duration-300 ease-in-out focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
                <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2">
                    Secondary Phone
                  </label>
                  <input
                    type="text"
                    name="secondaryPhone"
                    value={client.secondaryPhone}
                    onChange={handleInputChange}
                    placeholder="Enter secondary phone number"
                    className="w-full px-4 py-3 text-xl border border-black rounded-xl text-black placeholder-black transition-all duration-300 ease-in-out focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
                <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={client.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter address"
                    className="w-full px-4 py-3 text-xl border border-black rounded-xl text-black placeholder-black transition-all duration-300 ease-in-out focus:border-blue-500 hover:border-blue-400"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Other Information */}
            <div>
              <h3 className="text-xl font-semibold text-black mb-6">
                Other Information
              </h3>
              <div className="flex items-center">
                <CheckboxField
                  label="Active"
                  id="status"
                  name="status"
                  checked={client.status}
                  onChange={handleInputChange}
                />
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
                {isLoading
                  ? "Loading..."
                  : isEditing
                  ? "Update Client"
                  : "Add Client"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddClientModal;
