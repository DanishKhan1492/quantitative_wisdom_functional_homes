import React, { useState, useEffect } from "react";
import { X, ChevronRight, Plus, Package, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const AddProposalModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditMode,
  proposalData,
}) => {
  const [formValues, setFormValues] = useState({
    name: "",
    apartmentName: "",
    clientInfo: "",
    quantity: 1,
    price: "",
    status: "",
    discount: 0,
  });

  const handleDiscountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    if (value >= 0 && value <= 100) {
      setFormValues(prev => ({...prev, discount: value}));
    }
  };

  // Calculate prices
  const originalPrice = 999; // Replace with your actual price calculation
  const discountAmount = (originalPrice * formValues.discount) / 100;
  const finalPrice = originalPrice - discountAmount;

  useEffect(() => {
    if (isEditMode && proposalData) {
      setFormValues({
        name: proposalData.name,
        apartmentName: proposalData.apartmentName,
        clientInfo: proposalData.clientInfo,
        quantity: proposalData.quantity,
        price: proposalData.price,
        status: proposalData.status,
      });
    } else {
      setFormValues({
        name: "",
        apartmentName: "",
        clientInfo: "",
        quantity: "",
        price: "",
        status: "",
      });
    }
  }, [isEditMode, proposalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formValues,
      quantity: parseInt(formValues.quantity, 10),
      price: parseFloat(formValues.price),
    });
    setFormValues({
      name: "",
      apartmentName: "",
      clientInfo: "",
      quantity: "",
      price: "",
      status: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  // Reusable InputField Component with Dark Theme
  const InputField = ({
    label,
    id,
    name,
    value,
    onChange,
    type = "text",
    required = false,
    placeholder = "",
  }) => (
    <div className="group w-full">
      <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                     transition-all duration-300 ease-in-out
                     focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                     hover:border-blue-400"
          required={required}
        />
      </div>
    </div>
  );

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setFormValues((prev) => ({
        ...prev,
        quantity: newQuantity,
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center pt-6 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-800 rounded-2xl w-full max-w-6xl mx-4 overflow-hidden shadow-2xl"
      >
        {/* Header Section */}
        <div className="bg-slate-900 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              Furnishing Proposal Creation
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </motion.button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Top Section - Basic Info */}
            <div className="grid grid-cols-3 gap-6">
              <InputField
                label="Proposal Name"
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                required
                placeholder="Enter proposal name"
              />

              <div className="group">
                <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
                  Apartment Type
                </label>
                <div className="relative">
                  <select
                    name="apartmentName"
                    value={formValues.apartmentName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white
                       appearance-none cursor-pointer
                       transition-all duration-300 ease-in-out
                       focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                       hover:border-blue-400"
                  >
                    <option value="">Select type</option>
                    <option value="Studio">Studio</option>
                    <option value="1BR">1 Bedroom</option>
                    <option value="2BR">2 Bedroom</option>
                  </select>
                  <ChevronRight
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transform rotate-90 pointer-events-none"
                  />
                </div>
              </div>

              <InputField
                label="Client Name"
                id="clientInfo"
                name="clientInfo"
                value={formValues.clientInfo}
                onChange={handleChange}
                required
                placeholder="Enter client name"
              />
            </div>

            {/* Products Section */}
            <div className="bg-slate-700/50 rounded-2xl p-6 border border-slate-600">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Package size={20} className="text-blue-400" />
                  Select Products
                </h3>
              </div>
              <div className="flex items-center justify-between gap-4">
                <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                  <option>Furniture Families</option>
                </select>
                <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                  <option>Furniture SubFamilies</option>
                </select>
              </div>

              {/* Products Table */}
              <div className="w-full p-6 mt-4 bg-slate-800 rounded-xl border border-slate-700">
                <div className="mb-4">
                  <InputField
                    label="Search Product"
                    name="searchProduct"
                    value=""
                    onChange={handleChange}
                    placeholder="Search By Name & SKU"
                  />
                </div>
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700">
                        SKU
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="group hover:bg-slate-700/50 transition-all duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-lg bg-slate-700 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-400 to-blue-500"></div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              Modern Sofa
                            </div>
                            <div className="text-sm text-slate-400">
                              Gray leather 3-seater
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-white font-mono bg-slate-700 px-2 py-1 rounded">
                          SKU-MS001
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">
                          <span className="text-sm text-slate-400">AED </span>999
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs font-medium text-green-400 bg-green-500/20 rounded-full">
                          In Stock(7)
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative group">
                          <div className="flex items-center bg-slate-700 border border-slate-600 rounded-full p-1 shadow-sm group-hover:border-blue-400 transition-all duration-300">
                            <button
                              className="w-7 h-7 rounded-full bg-slate-600 text-white hover:bg-blue-500 transition-colors duration-200 flex items-center justify-center"
                              onClick={() => handleQuantityChange(formValues.quantity - 1)}
                              disabled={formValues.quantity <= 1}
                            >
                              <span className="text-sm font-medium">−</span>
                            </button>

                            <input
                              type="number"
                              value={formValues.quantity}
                              readOnly
                              className="w-12 h-7 text-center bg-transparent border-none focus:ring-0 text-white font-medium"
                            />

                            <button
                              className="w-7 h-7 rounded-full bg-slate-600 text-white hover:bg-blue-500 transition-colors duration-200 flex items-center justify-center"
                              onClick={() => handleQuantityChange(formValues.quantity + 1)}
                              disabled={formValues.quantity >= 99}
                            >
                              <span className="text-sm font-medium">+</span>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full 
                             text-white bg-blue-500 hover:bg-blue-600
                             transition-all duration-200"
                        >
                          Add
                        </motion.button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Products */}
            <div className="bg-slate-700/50 rounded-2xl border border-slate-600 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Selected Products
              </h3>
              <div className="space-y-4">
                {/* Selected Product Item */}
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-xl group hover:bg-slate-600 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-slate-600 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-400 to-blue-500"></div>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Modern Sofa</h4>
                      <p className="text-sm text-slate-400">SKU-MS001 • Qty: 1</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-semibold text-white">AED 999</span>
                    <button className="text-slate-400 hover:text-red-400 transition-colors duration-200">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            

         {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-700">
          <div className="flex items-center gap-8">
            <div className="group">
              <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
                Discount (%)
              </label>
              <input
                type="number"
                value={0}
                onChange={handleDiscountChange}
                min="0"
                max="100"
                className="w-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white 
                         transition-all duration-300 ease-in-out
                         focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                         hover:border-blue-400"
              />
            </div>
            <div className="space-y-1">
              <div className="text-sm text-slate-400">
                Original Price: <span className="line-through">AED {originalPrice}</span>
              </div>
              <div className="text-xl font-semibold text-white">
                Final Price: <span className="text-blue-400">AED 500</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
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
            >
              Generate Proposal
            </motion.button>
          </div>
        </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddProposalModal;