import React, { useState, useEffect } from "react";
import { X, Package, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const AddMaterialModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing = false,
  materialData = null,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && materialData) {
      setFormData({
        name: materialData.name || "",
        type: materialData.type || "",
        description: materialData.description || "",
      });
    } else {
      setFormData({
        name: "",
        type: "",
        description: "",
      });
    }
  }, [isEditing, materialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
 setFormData({
   name: "",
   type: "",
   description: "",
 });
      onClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to add/update material.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
              {isEditing ? "Update Material" : "Create Material"}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-full transition-colors"
              aria-label="Close Modal"
            >
              <X size={24} />
            </motion.button>
          </div>
        </div>

        {/* Form Container */}
        <div className="overflow-y-auto max-h-[80vh] p-6 bg-slate-800 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Package className="mr-2 text-blue-400" size={24} />
                Material Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group w-full">
                  <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Material Name<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Oak Wood"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                 transition-all duration-300 ease-in-out
                 focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                 hover:border-blue-400"
                    />
                  </div>
                </div>

                <div className="group w-full">
                  <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Material Type<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Wood"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                 transition-all duration-300 ease-in-out
                 focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                 hover:border-blue-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <FileText className="mr-2 text-blue-400" size={24} />
                Description
              </h3>
              <div className="group w-full">
                <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter material description..."
                    rows="4"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                 transition-all duration-300 ease-in-out
                 focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                 hover:border-blue-400 resize-none"
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
                disabled={loading}
              >
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Material"
                  : "Create Material"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddMaterialModal;
