import React, { useState, useEffect } from "react";
import {
  
  Eye,
  Edit,
  Trash2,
  Plus,
  FolderTree,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import AddSubFamilyModal from "./AddSubFamilyModal";
import { toast } from "react-toastify";
import {
  getAllSubFamilies,
  getSubFamilyById,
  createSubFamily,
  updateSubFamily,
  deleteSubFamily,
} from "../../ApiService/SubFamily/SubFamilyApiService";
import Loading from "../Loading/Lodder";
const FurnitureSubFamilyList = () => {
  // Modal and selection states
  const [isSubFamilyModalOpen, setIsSubFamilyModalOpen] = useState(false);
  const [subFamilyList, setSubFamilyList] = useState([]);
  const [selectedSubFamily, setSelectedSubFamily] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  // Pagination states
  const [page, setPage] = useState(0);
  const [size,setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
 const [isLoading, setIsLoading] = useState(true);
  // Fetch sub-families on mount and whenever page or size changes
  useEffect(() => {
    fetchSubFamilies();
  }, [page, size]);

  const fetchSubFamilies = async () => {
    setIsLoading(true)
    try {
      const response = await getAllSubFamilies(page, size);
      
      setSubFamilyList(response.data);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching sub-families:", error);
      toast.error("Failed to fetch sub-families");
    }finally{
      setIsLoading(false)
    }
  };

  const handleCreateSubFamily = async (familyId, newSubFamilies) => {

    if (
      !familyId ||
      !Array.isArray(newSubFamilies) ||
      newSubFamilies.length === 0
    ) {
      console.error("Missing or incorrect data for creating sub-family");
      return;
    }
    try {
      await createSubFamily(familyId, newSubFamilies);
      fetchSubFamilies();
      setIsSubFamilyModalOpen(false);
    } catch (error) {
      console.error("Error creating sub-family:", error);
    }
  };

  const handleUpdateSubFamily = async (id, updatedData) => {
    try {
      const response = await updateSubFamily(id, updatedData);
      if (response) {
        setIsSubFamilyModalOpen(false);
        fetchSubFamilies();
      }
    } catch (error) {
      console.error("Error updating sub-family:", error);
    }
  };

  const handleDeleteSubFamily = async (id) => {
    try {
      await deleteSubFamily(id);
      fetchSubFamilies();
    } catch (error) {
      console.error("Error deleting sub-family:", error);
    }
  };

  const handleViewSubFamily = async (id) => {
    try {
      const response = await getSubFamilyById(id);
      setSelectedSubFamily(response);
      setViewMode(true);
      setIsSubFamilyModalOpen(true);
    } catch (error) {
      console.error("Error fetching sub-family details:", error);
    }
  };

  const handleEditSubFamily = async (id) => {
    try {
      const response = await getSubFamilyById(id);
      // Prepare data to match your form fields
      const subFamilyData = {
        subFamilyId: response.subFamilyId,
        name: response.name,
        type: response.type,
        description: response.description,
        familyId: response.familyId,
      };
      setSelectedSubFamily(subFamilyData);
      setViewMode(false);
      setIsSubFamilyModalOpen(true);
    } catch (error) {
      console.error("Error fetching sub-family details:", error);
      toast.error("Failed to fetch sub-family details");
    }
  };

  // Pagination calculations
  const startItem = page * size + 1;
  const endItem = Math.min((page + 1) * size, totalElements);

  // Handlers for pagination buttons
  const handlePreviousPage = () => {
    setPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    if (page + 1 < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="p-6 bg-slate-900 ">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <FolderTree className="mr-2 text-blue-400" size={24} />
            Furniture Sub-Family
          </h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-colors duration-300 shadow-md flex items-center space-x-2"
            onClick={() => {
              setSelectedSubFamily(null);
              setIsSubFamilyModalOpen(true);
            }}
          >
            <Plus size={20} />
            <span>Add Sub Family</span>
          </motion.button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900/50 text-left">
                <th className="p-4 font-semibold text-slate-300">
                  Family Name
                </th>
                <th className="p-4 font-semibold text-slate-300">
                  Sub Family Name
                </th>
                <th className="p-4 font-semibold text-slate-300">Type</th>
                <th className="p-4 font-semibold text-slate-300">
                  Description
                </th>
                <th className="p-4 font-semibold text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5">
                    <div className="h-[400px] w-full flex items-center justify-center">
                      <Loading />
                    </div>
                  </td>
                </tr>
              ) : subFamilyList && subFamilyList.length > 0 ? (
                subFamilyList.map((subFamily) => (
                  <tr
                    key={subFamily.subFamilyId}
                    className="border-t border-slate-700 hover:bg-slate-700/30 transition-colors duration-150"
                  >
                    <td className="p-4 text-slate-300">
                      {subFamily.familyName}
                    </td>
                    <td className="p-4 text-slate-300">{subFamily.name}</td>
                    <td className="p-4 text-slate-300">{subFamily.type}</td>
                    <td className="p-4 text-slate-300">
                      {subFamily.description.length > 60
                        ? `${subFamily.description.slice(0, 60)}...`
                        : subFamily.description}
                    </td>
                    <td className="p-4 flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-emerald-400 hover:text-emerald-300 transition-colors"
                        onClick={() =>
                          handleEditSubFamily(subFamily.subFamilyId)
                        }
                      >
                        <Edit size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        onClick={() =>
                          handleDeleteSubFamily(subFamily.subFamilyId)
                        }
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-t border-slate-700">
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-lg font-medium">
                        No sub-families found
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
    
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-slate-400">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-0">
          {/* Styled "Showing records" display */}
          <span className="text-sm bg-gradient-to-r bg-slate-800 border-2 border-blue-500 text-blue-300 px-4 py-2 rounded-full shadow-md">
            Showing {startItem} to {endItem} of {totalElements} entries
          </span>

          {/* Styled Page Size Selector */}
          <div className="relative">
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPageNumber(0); // reset to first page on page size change
              }}
              className="appearance-none pl-4 pr-10 py-2 bg-slate-800 border-2 border-blue-500 rounded-full text-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all duration-300 hover:bg-slate-700"
            >
              {[5, 10, 15, 20, 50,100].map((option) => (
                <option key={option} value={option} className="bg-slate-800">
                  Show {option} records
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none"
              size={18}
            />
          </div>
        </div>

        {/* Pagination Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={page === 0}
            className="appearance-none px-4 py-2 bg-slate-800 text-white rounded-xl border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all hover:bg-slate-600 flex items-center"
          >
            <ChevronLeft size={18} className="mr-1" />
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages - 1}
            className="appearance-none px-4 py-2 bg-slate-800 border-2 border-blue-500 text-white rounded-xl hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all flex items-center"
          >
            Next
            <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
      </div>

      <AddSubFamilyModal
        isOpen={isSubFamilyModalOpen}
        onClose={() => setIsSubFamilyModalOpen(false)}
        onSubmit={handleCreateSubFamily} // Pass your create handler here
        subFamily={selectedSubFamily}
        onUpdate={handleUpdateSubFamily}
        viewMode={viewMode}
      />
    </div>
  );
};

export default FurnitureSubFamilyList;
