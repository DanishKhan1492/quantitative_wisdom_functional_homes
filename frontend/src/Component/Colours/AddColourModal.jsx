import React, { useState, useEffect } from "react";
import { X, Palette, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const AddColourModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing = false,
  colourData = null,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && colourData) {
      setFormData({
        name: colourData.name || "",
        code: colourData.code || "",
        description: colourData.description || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        description: "",
      });
    }
  }, [isEditing, colourData]);

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
        code: "",
        description: "",
      });
      onClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to add/update colour.";
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
        className="bg-slate-800 rounded-2xl w-full max-w-[1500px] mx-4 overflow-hidden shadow-2xl custom-scrollbar"
      >
        {/* Header */}
        <div className="bg-black p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? "Update Colour" : "Create Colour"}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white hover:text-white p-2 rounded-full transition-colors"
              aria-label="Close Modal"
            >
              <X size={24} />
            </motion.button>
          </div>
        </div>

        {/* Form Container */}
        <div className="overflow-y-auto max-h-[80vh] p-6 bg-white custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-black mb-6 flex items-center">
                <Palette className="mr-2 text-black" size={24} />
                Colour Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Colour Name<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Royal Blue"
                      className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black 
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500 
                   hover:border-blue-400"
                    />
                  </div>
                </div>

                {/* =============== */}
                <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Colour Code<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      placeholder="e.g., #1E90FF"
                      className="w-full px-4 py-3 pr-16 text-xl border border-black rounded-xl text-black placeholder-black 
         transition-all duration-300 ease-in-out
         focus:border-blue-500 
         hover:border-blue-400"
                    />
                    {/* Color Preview Square */}
                    <div
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-24 h-12 rounded border-2 border-gray-300 shadow-sm"
                      style={{
                        backgroundColor: formData.code || "#ffffff",
                        display: formData.code ? "block" : "none",
                      }}
                    ></div>
                  </div>
                </div>

                {/* <div className="group w-full">
                  <label className="block text-sm font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Colour Code<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                     
                      placeholder="e.g., #1E90FF"
                      className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black 
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500 
                   hover:border-blue-400"
                    />
                  </div>
                </div> */}
              </div>
            </div>

            {/* Description Section */}
            <div>
              <h3 className="text-xl font-semibold text-black mb-6 flex items-center">
                <FileText className="mr-2 text-black" size={24} />
                Description
              </h3>
              <div className="group w-full">
                <label className="block text-sm font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter colour description..."
                    rows="4"
                    className="w-full px-4 py-3 text-xl border border-black rounded-xl text-black placeholder-black 
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500 
                   hover:border-blue-400"
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
                className="px-6 py-2 bg-black/30 text-xl text-black rounded-xl   transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-2 bg-black text-xl text-white rounded-xl hover:bg-blue-600 transition-colors"
                disabled={loading}
              >
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Colour"
                  : "Create Colour"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddColourModal;