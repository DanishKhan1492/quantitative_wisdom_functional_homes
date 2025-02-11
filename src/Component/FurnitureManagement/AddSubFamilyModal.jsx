// AddSubFamilyModal.jsx
import React, { useState, useEffect } from "react";
import { X, ChevronDown, FolderTree, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";


import { getAllFurnitureFamilies} from "../../ApiService/FurnitureFamily/FurnitureFamilyApiServices"
const AddSubFamilyModal = ({
  isOpen,
  onClose,
  onSubmit,
  subFamily,
  onUpdate,
}) => {

    const [subFamilyName, setSubFamilyName] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFamilyId, setSelectedFamilyId] = useState("");

    const [furnitureFamilies,setFurnitureFamilies] = useState([])

  // Fetch families for dropdown
  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const response = await getAllFurnitureFamilies();
        
        setFurnitureFamilies(response.content);
      } catch (error) {
        console.error("Error fetching families:", error);
      }
    };
    fetchFamilies();
  }, []);

  // Initialize form for editing
  useEffect(() => {
    if (subFamily) {
      setSubFamilyName(subFamily.name || "");
      setType(subFamily.type || "");
      setDescription(subFamily.description || "");
      setSelectedFamilyId(subFamily.familyId || "");
    } else {
      // Reset form when not editing
      setSubFamilyName("");
      setType("");
      setDescription("");
      setSelectedFamilyId("");
    }
  }, [subFamily]);

 const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true);
   try {
     if (subFamily) {
       // Update existing sub-family
       const updateData = {
         name: subFamilyName,
         type: type,
         description: description,
         familyId: selectedFamilyId,
       };
       await onUpdate(subFamily.subFamilyId, updateData);
       
     } else {
       // Create new sub-family
       await onSubmit(selectedFamilyId, [
         {
           name: subFamilyName,
           type: type,
           description: description,
         },
       ]);
     }
     onClose();
   } catch (error) {
     toast.error(error.message);
   } finally {
     setLoading(false);
   }
 };


  return (
    <AnimatePresence>
      {isOpen && (
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
                  {subFamily ? "Update Sub Family" : "Add Sub Family"}
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
                    <FolderTree className="mr-2 text-blue-400" size={24} />
                    Family Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="group w-full">
                      <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
                        Furniture Family Name
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="category"
                          name="category"
                          value={selectedFamilyId}
                          onChange={(e) => setSelectedFamilyId(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                 transition-all duration-300 ease-in-out
                 focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                 hover:border-blue-400"
                        >
                          <option value="">Select a Family</option>
                          {furnitureFamilies &&
                            furnitureFamilies.map((family) => (
                              <option
                                key={family.familyId}
                                value={family.familyId}
                              >
                                {family.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="group w-full">
                      <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
                        Sub Family Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="name"
                          name="name"
                          value={subFamilyName}
                          onChange={(e) => setSubFamilyName(e.target.value)}
                          placeholder="e.g., Leather Sofa"
                          required
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                 transition-all duration-300 ease-in-out
                 focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                 hover:border-blue-400"
                        />
                      </div>
                    </div>

                    <div className="group w-full">
                      <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="name"
                          name="name"
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          placeholder="e.g., Leather Sofa"
                          required
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

                <div className="group w-full">
                  <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      id="description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter Sub Family description..."
                      rows="4"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 
                 transition-all duration-300 ease-in-out
                 focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                 hover:border-blue-400 resize-none"
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
                    className="px-6 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center space-x-2"
                    disabled={loading}
                  >
                    <span>
                      {loading
                        ? subFamily
                          ? "Updating..."
                          : "Adding..."
                        : subFamily
                        ? "Update Sub Family"
                        : "Add Sub Family"}
                    </span>
                    <ChevronDown size={20} className="transform rotate-90" />
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


 export default AddSubFamilyModal;
