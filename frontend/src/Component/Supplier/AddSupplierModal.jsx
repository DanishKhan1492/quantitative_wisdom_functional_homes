import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const AddSupplierModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  supplierData,
}) => {
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    businessRegistrationNumber: "",
    primaryContactName: "",
    primaryContactPosition: "",
    secondaryContactNumber: "",
    websiteUrl: "",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    stateProvince: "",
    country: "",
    paymentTerms: "",
    assemblyServices: false,
    deliveryTimeWeeks: "",
    taxNumber: "",
    supplierDiscount: "",
    status: true,
  });
   const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing && supplierData) {
      setNewSupplier({
        ...supplierData,
        assemblyServices: supplierData.assemblyServices || false,
        status: supplierData.status ?? true,
      });
    } else {
      setNewSupplier({
        name: "",
        email: "",
        phoneNumber: "",
        businessRegistrationNumber: "",
        primaryContactName: "",
        primaryContactPosition: "",
        secondaryContactNumber: "",
        websiteUrl: "",
        streetAddress1: "",
        streetAddress2: "",
        city: "",
        stateProvince: "",
        country: "",
        paymentTerms: "",
        assemblyServices: false,
        deliveryTimeWeeks: "",
        taxNumber: "",
        supplierDiscount: "",
        status: true,
      });
    }
  }, [isEditing, supplierData]);

  

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    const result = await onSubmit(newSupplier);
   
    setNewSupplier({
       name: "",
       email: "",
       phoneNumber: "",
       businessRegistrationNumber: "",
       primaryContactName: "",
       primaryContactPosition: "",
       secondaryContactNumber: "",
       websiteUrl: "",
       streetAddress1: "",
       streetAddress2: "",
       city:  "",
       stateProvince: "",
       country: "",
       paymentTerms: "",
       assemblyServices: false,
       deliveryTimeWeeks: "",
       taxNumber: "",
       supplierDiscount: "",
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
    setNewSupplier((prev) => ({
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
        className="h-4 w-4 text-blue-500 bg-slate-700 border-slate-500 rounded focus:ring-blue-500/20"
      />
      <label
        htmlFor={id}
        className="ml-2 block text-sm text-slate-300 group-hover:text-blue-400 transition-colors duration-200"
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
        className="bg-slate-800 rounded-2xl w-full max-w-6xl mx-4 overflow-hidden shadow-2xl custom-scrollbar"
      >
        {/* Header */}
        <div className="bg-slate-900 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? "Update Supplier" : "Create Supplier"}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-full transition-colors custom-scrollbar"
              aria-label="Close Modal"
            >
              <X size={24} />
            </motion.button>
          </div>
        </div>

        {/* Form Container */}
        <div className="overflow-y-auto max-h-[80vh] p-6 bg-slate-800  custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Supplier Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                Supplier Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               
                <div className="group w-full">
                <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
     Name<span className="text-red-500">*</span>
    </label>
    <div className="relative">
                <input
        label="Name"
        id="name"
        name="name"
        value={newSupplier.name}
        onChange={handleInputChange}
        required
        placeholder="Enter supplier name"
         className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                   transition-all duration-300 ease-in-out
                   focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   hover:border-blue-400"
      />
      </div>
      </div>
      <div className="group w-full">
                <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
     Business Registration Number<span className="text-red-500">*</span>
    </label>
    <div className="relative">
              
       <input
                  label="Business Registration Number"
                  id="businessRegistrationNumber"
                  name="businessRegistrationNumber"
                  value={newSupplier.businessRegistrationNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter registration number"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                   transition-all duration-300 ease-in-out
                   focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   hover:border-blue-400"
                />
      </div>
      </div>
      <div className="group w-full">
                <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
     Tax Number<span className="text-red-500">*</span>
    </label>
    <div className="relative">
              
       <input
                 label="Tax Number"
                  id="taxNumber"
                  name="taxNumber"
                  value={newSupplier.taxNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter tax number"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                   transition-all duration-300 ease-in-out
                   focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   hover:border-blue-400"
                />
      </div>
      </div>
      
               
               
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group w-full">
                <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
    Email<span className="text-red-500">*</span>
    </label>
    <div className="relative">
              
       <input
                  label="Email"
                  id="email"
                  name="email"
                  value={newSupplier.email} 
                  onChange={handleInputChange}
                  type="email"
                  required
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                   transition-all duration-300 ease-in-out
                   focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   hover:border-blue-400"
                />
      </div>
      </div>
             
                 <div className="group w-full">
        <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
          Phone Number<span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={newSupplier.phoneNumber}
            onChange={handleInputChange}
            required
            placeholder="Enter phone number"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                       transition-all duration-300 ease-in-out
                       focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                       hover:border-blue-400"
          />
        </div>
      </div>

      <div className="group w-full">
        <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
          Secondary Contact Number
        </label>
        <div className="relative">
          <input
            type="text"
            id="secondaryContactNumber"
            name="secondaryContactNumber"
            value={newSupplier.secondaryContactNumber}
            onChange={handleInputChange}
            placeholder="Enter secondary contact"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                       transition-all duration-300 ease-in-out
                       focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                       hover:border-blue-400"
          />
        </div>
      </div>

      <div className="group w-full">
        <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
          Primary Contact Name
        </label>
        <div className="relative">
          <input
            type="text"
            id="primaryContactName"
            name="primaryContactName"
            value={newSupplier.primaryContactName}
            onChange={handleInputChange}
            placeholder="Enter primary contact name"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                       transition-all duration-300 ease-in-out
                       focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                       hover:border-blue-400"
          />
        </div>
      </div>

      <div className="group w-full">
        <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
          Primary Contact Position
        </label>
        <div className="relative">
          <input
            type="text"
            id="primaryContactPosition"
            name="primaryContactPosition"
            value={newSupplier.primaryContactPosition}
            onChange={handleInputChange}
            placeholder="Enter contact position"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                       transition-all duration-300 ease-in-out
                       focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                       hover:border-blue-400"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group w-full">
    <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
      Street Address 1<span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <input
        type="text"
        id="streetAddress1"
        name="streetAddress1"
        value={newSupplier.streetAddress1}
        onChange={handleInputChange}
        required
        placeholder="Enter street address"
        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                   transition-all duration-300 ease-in-out
                   focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   hover:border-blue-400"
      />
    </div>
  </div>

  <div className="group w-full">
    <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
      Street Address 2
    </label>
    <div className="relative">
      <input
        type="text"
        id="streetAddress2"
        name="streetAddress2"
        value={newSupplier.streetAddress2}
        onChange={handleInputChange}
        placeholder="Enter additional address"
        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                   transition-all duration-300 ease-in-out
                   focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   hover:border-blue-400"
      />
    </div>
  </div>

  <div className="group w-full">
    <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
      City<span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <input
        type="text"
        id="city"
        name="city"
        value={newSupplier.city}
        onChange={handleInputChange}
        required
        placeholder="Enter city"
        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                   transition-all duration-300 ease-in-out
                   focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   hover:border-blue-400"
      />
    </div>
  </div>

  <div className="group w-full">
    <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
      State/Province<span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <input
        type="text"
        id="stateProvince"
        name="stateProvince"
        value={newSupplier.stateProvince}
        onChange={handleInputChange}
        required
        placeholder="Enter state/province"
        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                   transition-all duration-300 ease-in-out
                   focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   hover:border-blue-400"
      />
    </div>
  </div>

  <div className="group w-full">
    <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
      Country<span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <input
        type="text"
        id="country"
        name="country"
        value={newSupplier.country}
        onChange={handleInputChange}
        required
        placeholder="Enter country"
        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                   transition-all duration-300 ease-in-out
                   focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   hover:border-blue-400"
      />
    </div>
  </div>
              </div>
            </div>

            {/* Payment Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                Payment Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group w-full">
    <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
      Payment Terms<span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <input
        type="text"
        id="paymentTerms"
        name="paymentTerms"
        value={newSupplier.paymentTerms}
        onChange={handleInputChange}
        required
        placeholder="Enter payment terms"
        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                   transition-all duration-300 ease-in-out
                   focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   hover:border-blue-400"
      />
    </div>
  </div>

  <div className="group w-full">
    <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
      Supplier Discount (%)
    </label>
    <div className="relative">
      <input
        type="number"
        id="supplierDiscount"
        name="supplierDiscount"
        value={newSupplier.supplierDiscount}
        onChange={handleInputChange}
        placeholder="Enter discount percentage"
        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                   transition-all duration-300 ease-in-out
                   focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   hover:border-blue-400"
      />
    </div>
  </div>

  <div className="group w-full">
    <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
      Delivery Time (weeks)
    </label>
    <div className="relative">
      <input
        type="number"
        id="deliveryTimeWeeks"
        name="deliveryTimeWeeks"
        value={newSupplier.deliveryTimeWeeks}
        onChange={handleInputChange}
        placeholder="Enter delivery time"
        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                   transition-all duration-300 ease-in-out
                   focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   hover:border-blue-400"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="group w-full">
  <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
    Website URL
  </label>
  <div className="relative">
    <input
      type="url"
      id="websiteUrl"
      name="websiteUrl"
      value={newSupplier.websiteUrl}
      onChange={handleInputChange}
      placeholder="Enter website URL"
      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                 transition-all duration-300 ease-in-out
                 focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                 hover:border-blue-400"
    />
  </div>
</div>

                <div className="flex gap-6 items-center mt-8">
                  <CheckboxField
                    label="Assembly Service"
                    id="assemblyServices"
                    name="assemblyServices"
                    checked={newSupplier.assemblyServices}
                    onChange={handleInputChange}
                  />
                  <CheckboxField
                    label="Active"
                    id="status"
                    name="status"
                    checked={newSupplier.status}
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
                className="px-6 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
               disabled={isLoading}
              >
               {isLoading ? (
    <div className="flex items-center">
      Loading...
    </div>
  ) : (
    isEditing ? "Update Supplier" : "Add Supplier"
  )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddSupplierModal;