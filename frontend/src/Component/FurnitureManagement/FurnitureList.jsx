import React, { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  Download,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import AddFurnitureModal from "./AddFurnitureModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import AddSubFamilyModal from "./AddSubFamilyModal";
import {
  getAllFurnitureFamilies,
  getFurnitureFamilyById,
  createFurnitureFamily,
  updateFurnitureFamily,
  deleteFurnitureFamily,
} from "../../ApiService/FurnitureFamily/FurnitureFamilyApiServices";
import Loading from "../Loading/Lodder";
const FurnitureList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [furnitureToDelete, setFurnitureToDelete] = useState(null);
  const [isSubFamilyModalOpen, setIsSubFamilyModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");


  const [pageNumber, setPageNumber] = useState(0);
  const [size,setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [furnitureList, setFurnitureList] = useState([]);

  useEffect(() => {
    setPageNumber(0);
  }, [searchTerm]);

  const getAllFurniture = async () => {
    setIsLoading(true)
    try {
      const response = await getAllFurnitureFamilies(
        pageNumber,
        size,
        searchTerm
      );

      console.log(response, "==== API Response ====");

      // Use the API response values directly:
      setFurnitureList(response.content);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching furniture families:", error);
    }finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    getAllFurniture();
  }, [pageNumber, size, searchTerm]);

  const handleDeleteClick = (furniture) => {
    setFurnitureToDelete(furniture);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (furnitureToDelete) {
      try {
        await deleteFurnitureFamily(furnitureToDelete);

        getAllFurniture();
        setIsDeleteModalOpen(false);
        setFurnitureToDelete(null);
      } catch (error) {
        console.error("Error deleting furniture family:", error);
      }
    }
  };

  // Edit handling
  const handleEditClick = async (familyId) => {
    try {
      const familyData = await getFurnitureFamilyById(familyId);
      setEditingFamily(familyData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching supplier for editing:", error);
    }
  };

  const handleExcelDownload = () => {
    console.log("Downloading excel...");
  };

  const handleCreateOrUpdateFurnitureFamily = async (furnitureFamilyData) => {
    if (editingFamily) {
      try {
        const updateData = {
          name: furnitureFamilyData.name,
          categoryId: furnitureFamilyData.categoryId,
          description: furnitureFamilyData.description,
        };

     
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(2000);

        await updateFurnitureFamily(editingFamily.familyId, updateData);
        getAllFurniture();
        setIsModalOpen(false);
        setEditingFamily(null);
      } catch (error) {
        console.error("Error updating furniture family:", error);
      }
    } else {
      try {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(2000);
        const response = await createFurnitureFamily(furnitureFamilyData);
        if (response) {
          getAllFurniture();
          setIsModalOpen(false);
        }
      } catch (error) {
        console.error("Error creating furniture family:", error);
      }
    }
  };

  // Calculate start and end item numbers for display
  const startItem = pageNumber * size + 1;
  const endItem = Math.min((pageNumber + 1) * size, totalElements);

  return (
    <div
      className="bg-gradient-to-b from-slate-900 to-slate-800 p-6"
      style={{
        overflowY: "auto",
      }}
    >
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Furniture List</h1>

          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            {/* Search Section */}
            <motion.div
              className="relative flex-1"
              whileHover={{ scale: 1.02 }}
            >
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
            </motion.div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                onClick={handleExcelDownload}
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Furniture
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700">
                <th className="p-4 text-left text-slate-300 font-semibold">
                  Name
                </th>
                <th className="p-4 text-left text-slate-300 font-semibold">
                  Category
                </th>
                {/* <th className="p-4 text-left text-slate-300 font-semibold">
                  Sub Family
                </th> */}
                <th className="p-4 text-left text-slate-300 font-semibold">
                  Description
                </th>
                <th className="p-4 text-left text-slate-300 font-semibold">
                  Actions
                </th>
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
              ) : furnitureList && furnitureList.length > 0 ? (
                furnitureList.map((furniture) => (
                  <tr
                    key={furniture.familyId}
                    className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="text-white font-medium">
                        {furniture.name}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {furniture.date}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white">{furniture.categoryName}</div>
                    </td>
                    {/* <td className="p-4">
                      <div className="text-white">
                        {furniture.subFamilies &&
                        furniture.subFamilies.length > 0
                          ? furniture.subFamilies.map((sub, index) => (
                              <span key={sub.subFamilyId}>
                                {sub.name}
                                {index !== furniture.subFamilies.length - 1 &&
                                  ", "}
                              </span>
                            ))
                          : "N/A"}
                      </div>
                    </td> */}
                    <td className="p-4">
                      <div className="text-white">
                        {furniture.description.length > 60
                          ? `${furniture.description.slice(0, 60)}...`
                          : furniture.description}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-green-400"
                          onClick={() => handleEditClick(furniture.familyId)}
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-400"
                          onClick={() => handleDeleteClick(furniture)}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-slate-700">
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No furniture families found
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
            onClick={() => setPageNumber(Math.max(0, pageNumber - 1))}
            disabled={pageNumber === 0}
            className="appearance-none px-4 py-2 bg-slate-800 text-white rounded-xl border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all hover:bg-slate-600 flex items-center"
          >
            <ChevronLeft size={18} className="mr-1" />
            Previous
          </button>
          <button
            onClick={() => setPageNumber((prev) => prev + 1)}
            disabled={pageNumber === totalPages - 1}
            className="appearance-none px-4 py-2 bg-slate-800 border-2 border-blue-500 text-white rounded-xl hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all flex items-center"
          >
            Next
            <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddFurnitureModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFamily(null);
        }}
        onSubmit={handleCreateOrUpdateFurnitureFamily}
        isEditing={!!editingFamily}
        familyData={editingFamily}
      />
      <AddSubFamilyModal
        isOpen={isSubFamilyModalOpen}
        onClose={() => setIsSubFamilyModalOpen(false)}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        furnitureToDelete={furnitureToDelete}
      />
    </div>
  );
};

export default FurnitureList;
