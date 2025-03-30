import React, { useState, useEffect, useRef } from "react";
import { X, ChevronRight, Sofa, FileText, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { getCategoriesByType } from "../../ApiService/CategoryService/CategoryApiService";

import { useNavigate } from "react-router-dom";

const AddFurnitureModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  familyData,
}) => {


  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subFamily: "",
    description: "",
    subFamilies: [], // New state for sub-families
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubFamilyModalOpen, setIsSubFamilyModalOpen] = useState(false); // State for sub-family modal
  const [category, setCategory] = useState([]);

  const firstInputRef = useRef(null);

  const fetchAllCategory = async () => {
    try {
      const categories = await getCategoriesByType("Furniture");
      console.log(categories,"======furniture category===")
      setCategory(categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchAllCategory();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        category: "",
        subFamily: "",
        description: "",
        subFamilies: [],
      });
    } else {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isEditing && familyData) {
      // Find the category name based on the category ID
      const selectedCategory = category.find(
        (cat) => cat.id === familyData.categoryId
      );

      setFormData({
        ...familyData,
        category: selectedCategory ? selectedCategory.id : "", // Use the ID for the dropdown
      });
    }
  }, [isEditing, familyData, category]);
 useEffect(() => {
   if (familyData) {
     setFormData({
       name: familyData.name || "",
       category: familyData.categoryId || "",
       description: familyData.description || "",
       subFamilies: familyData.subFamilies || [],
     });
   }
 }, [familyData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // Create different payload based on whether we're editing or creating
    const furnitureFamilyData = isEditing
      ? {
          name: formData.name,
          categoryId: formData.category,
          description: formData.description,
          // Don't include subFamilies for updates
        }
      : {
          name: formData.name,
          categoryId: formData.category,
          description: formData.description,
          subFamilies: formData.subFamilies,
          removedSubFamilies: [],
        };

    await onSubmit(furnitureFamilyData);
  } catch (error) {
    setError(
      isEditing
        ? "Failed to update furniture family"
        : "Failed to create furniture family"
    );
    console.error("Error in handleSubmit:", error);
  } finally {
    setLoading(false);
  }
};

  const handleAddSubFamily = (subFamily) => {
    setFormData((prevData) => ({
      ...prevData,
      subFamilies: [...prevData.subFamilies, subFamily],
    }));
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
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
                  {isEditing ? "Update Furniture" : "Add Furniture"}
                </h2>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSubFamilyModalOpen(true)}
                    className="px-4 py-2 bg-white text-black rounded-xl hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <span>Add Sub Family</span>
                    <Plus size={20} />
                  </motion.button>
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
            </div>

            {/* Form Container */}
            <div className="overflow-y-auto max-h-[80vh] p-6 bg-white   custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Section */}
                <div>
                  <h3 className="text-xl font-semibold text-black mb-6 flex items-center">
                    <Sofa className="mr-2 text-black" size={24} />
                    Furniture Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="group w-full">
                      <label className="block text-md font-medium text-black mb-2  transition-colors duration-200">
                        Furniture Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., Leather Sofa"
                          ref={firstInputRef}
                          required
                          className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black 
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500 
                   hover:border-blue-400"
                        />
                      </div>
                    </div>

                    <div className="group w-full">
                      <label className="block text-md font-medium text-black mb-2  transition-colors duration-200">
                        Furniture Category
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black 
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500 
                   hover:border-blue-400"
                        >
                          <option value="">Select a category</option>
                          {category &&
                            category.map((cat) => (
                              <option
                                key={cat.id}
                                value={cat.id}
                                className="text-black bg-white"
                              >
                                {cat.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="group w-full">
                  <label className="block text-md font-medium text-black mb-2 transition-colors duration-200">
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter furniture description..."
                      rows="4"
                      className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black 
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500 
                   hover:border-blue-400"
                    />
                  </div>
                </div>

                {/* Sub Families Table */}
                {!isEditing && formData.subFamilies.length > 0 && (
                  <div className="group w-full">
                    <label className="block text-lg font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                      Sub Families
                    </label>
                    <div className="relative">
                      <table className="w-full bg-white border border-slate-200 rounded-xl text-white">
                        <thead>
                          <tr className="border-b border-[#D6D3CF] bg-tbhead">
                            <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                              ID
                            </th>
                            <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                              Name
                            </th>
                            <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                              Type
                            </th>
                            <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                              Description
                            </th>
                            <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.subFamilies.map((subFamily, index) => (
                            <tr key={index}>
                              <td className="p-4">
                                <div className="text-black font-medium">
                                  {subFamily.subFamilyId || index + 1}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-black font-medium">
                                  {subFamily.name}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-black font-medium">
                                  {subFamily.type}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-black font-medium">
                                  {subFamily.description}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-black font-medium">
                                  <button
                                    // onClick={handleDeleteClick(subFamily.subFamilyId)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

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
                    className="px-6 py-2 bg-black text-xl text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center space-x-2"
                    disabled={loading}
                  >
                    <span>
                      {loading ? (
                        <div className="flex items-center">Loading...</div>
                      ) : isEditing ? (
                        "Update Furniture"
                      ) : (
                        "Add Furniture"
                      )}
                    </span>
                    <ChevronRight size={20} />
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Sub Family Modal */}
          <AnimatePresence>
            {isSubFamilyModalOpen && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 custom-scrollbar">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-800 rounded-2xl w-full max-w-[1200px] mx-4 overflow-hidden shadow-2xl custom-scrollbar"
                >
                  {/* Header */}
                  <div className="bg-black p-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-white">
                        Add Sub Family
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsSubFamilyModalOpen(false)}
                        className="text-white p-2 rounded-full transition-colors"
                        aria-label="Close Modal"
                      >
                        <X size={24} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Form Container */}
                  <div className="overflow-y-auto max-h-[80vh] p-6 bg-white custom-scrollbar">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const subFamily = {
                          name: formData.get("name"),
                          type: formData.get("type"),
                          description: formData.get("description"),
                        };
                        handleAddSubFamily(subFamily);
                        setIsSubFamilyModalOpen(false);
                      }}
                      className="space-y-8"
                    >
                      {/* Name and Type in One Row */}
                      <div className="flex space-x-4">
                        <div className="group w-1/2">
                          <label className="block text-md font-medium text-black  mb-2 group-hover:text-blue-400 transition-colors duration-200">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              id="name"
                              name="name"
                              placeholder="e.g., Leather Sofa"
                              required
                              className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black 
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500 
                   hover:border-blue-400"
                            />
                          </div>
                        </div>

                        <div className="group w-1/2">
                          <label className="block text-md font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                            Type <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              id="type"
                              name="type"
                              placeholder="e.g., Sofa"
                              required
                              className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black 
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500 
                   hover:border-blue-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Description in Second Row */}
                      <div className="group w-full">
                        <label className="block text-md font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                          Description
                        </label>
                        <div className="relative">
                          <textarea
                            id="description"
                            name="description"
                            placeholder="Enter sub-family description..."
                            rows="4"
                            className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black 
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500 
                   hover:border-blue-400"
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-4 pt-6 border-t border-slate-700">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsSubFamilyModalOpen(false)}
                          type="button"
                          className="px-6 py-2  bg-black text-xl text-white rounded-xl hover:bg-slate-600 transition-colors"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="px-6 py-2 bg-black text-xl text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center space-x-2"
                        >
                          <span>Add Sub Family</span>
                          <ChevronRight size={20} />
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddFurnitureModal;
