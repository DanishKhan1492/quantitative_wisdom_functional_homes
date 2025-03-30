

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
  const [filterTerm, setFilterTerm] = useState("");
  const [filteredFurnitureList, setFilteredFurnitureList] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [size,setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [furnitureList, setFurnitureList] = useState([]);

  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm]);

  const getAllFurniture = async () => {
    setIsLoading(true)
    try {
      const response = await getAllFurnitureFamilies(
        pageNumber,
        size,
        searchTerm
      );

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

  useEffect(() => {
  if (filterTerm) {
    const lowerCaseFilter = filterTerm.toLowerCase();
    const filtered = furnitureList.filter(
      (furniture) =>
        furniture.categoryName &&
        furniture.categoryName.toLowerCase().includes(lowerCaseFilter)
    );
    setFilteredFurnitureList(filtered);
  } else if(searchTerm){
    const lowerCaseFilter = searchTerm.toLowerCase();
    const filtered = furnitureList.filter(
      (furniture) =>
        furniture.name &&
        furniture.name.toLowerCase().includes(lowerCaseFilter)
    );
    setFilteredFurnitureList(filtered);
  }
  else {
    setFilteredFurnitureList(furnitureList);
  }
}, [filterTerm, furnitureList]);


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

  const renderPageNumbers = () => {
    const pageButtons = [];
    const maxVisiblePages = 5;

    const addPageButton = (page) => {
      pageButtons.push(
        <button
          key={page}
          onClick={() => setPageNumber(page)}
          className={`w-8 h-8 border-2 border-black flex items-center justify-center rounded-full transition-colors ${
            page === pageNumber
              ? "bg-white text-black  font-bold"
              : "bg-black border border-blue-500 text-white hover:bg-slate-700"
          }`}
        >
          {page}
        </button>
      );
    };

    const addEllipsis = (key) => {
      pageButtons.push(
        <span key={`ellipsis-${key}`} className="px-2 text-black">
          ...
        </span>
      );
    };

    if (totalPages <= maxVisiblePages) {
      for (let page = 1; page <= totalPages; page++) {
        addPageButton(page);
      }
    } else {
      // Always show first page
      addPageButton(1);

      let startPage = Math.max(
        2,
        pageNumber - Math.floor((maxVisiblePages - 2) / 2)
      );
      let endPage = Math.min(
        totalPages - 1,
        pageNumber + Math.floor((maxVisiblePages - 2) / 2)
      );

      // Adjust if near the start
      if (pageNumber <= Math.floor(maxVisiblePages / 2)) {
        startPage = 2;
        endPage = maxVisiblePages - 1;
      }
      // Adjust if near the end
      else if (pageNumber > totalPages - Math.floor(maxVisiblePages / 2)) {
        endPage = totalPages - 1;
        startPage = totalPages - (maxVisiblePages - 2);
      }

      if (startPage > 2) {
        addEllipsis("start");
      }

      for (let page = startPage; page <= endPage; page++) {
        addPageButton(page);
      }

      if (endPage < totalPages - 1) {
        addEllipsis("end");
      }

      // Always show last page
      addPageButton(totalPages);
    }

    return pageButtons;
  };

  // Calculate start and end item numbers for display
 const startItem = (pageNumber - 1) * size + 1;
 const endItem = Math.min(pageNumber * size, totalElements);


  return (
    <div
      className="bg-background p-6 h-screen"
      style={{
        overflowY: "auto",
      }}
    >
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl font-bold text-black">Furniture Family</h1>

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
                className="w-full pl-10 pr-4 py-2 bg-white border border-[#D6D3CF] rounded-xl text-[#262525] placeholder-[#262525]/50 focus:outline-none focus:ring-2 focus:ring-[#262525]/30"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
                size={20}
              />
            </motion.div>
            <motion.div
              className="relative flex-1"
              whileHover={{ scale: 1.02 }}
            >
              <input
                type="text"
                placeholder="Filter by category..."
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-[#D6D3CF] rounded-xl text-[#262525] placeholder-[#262525]/50 focus:outline-none focus:ring-2 focus:ring-[#262525]/30"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
                size={20}
              />
            </motion.div>
            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-colors"
                onClick={handleExcelDownload}
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-colors"
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
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D6D3CF] bg-tbhead">
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Name
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Category
                </th>
                {/* <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Sub Family
                </th> */}
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Description
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
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
              ) : filteredFurnitureList && filteredFurnitureList.length > 0 ? (
                filteredFurnitureList.map((furniture) => (
                  <tr
                    key={furniture.familyId}
                    className="border-b border-slate-700 hover:bg-black/10 transition-colors"
                  >
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {furniture.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {furniture.categoryName}
                      </div>
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
                      <div className="text-black font-medium">
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
                          className="text-green-800"
                          onClick={() => handleEditClick(furniture.familyId)}
                        >
                          <Edit size={28} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-800"
                          onClick={() => handleDeleteClick(furniture)}
                        >
                          <Trash2 size={28} />
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
          <span className="text-sm bg-gradient-to-r bg-black border-2 border-blue-500 text-white px-4 py-2 rounded-full shadow-md">
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
              className="appearance-none pl-4 pr-10 py-2 bg-black text-white border-2 border-blue-500 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all duration-300 hover:bg-slate-700"
            >
              {[5, 10, 15, 20, 50, 100].map((option) => (
                <option
                  key={option}
                  value={option}
                  className="bg-black text-white"
                >
                  Show {option} records
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none"
              size={18}
            />
          </div>
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPageNumber(Math.max(0, pageNumber - 1))}
            disabled={pageNumber === 1}
            className="px-4 py-2 bg-black text-white rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-black transition-all hover:bg-slate-600 flex items-center"
          >
            <ChevronLeft size={18} className="mr-1" />
            Previous
          </button>
          <div className="flex gap-2">{renderPageNumbers()}</div>
          <button
            onClick={() => {
              setPageNumber((prev) => prev + 1);
            }}
            disabled={pageNumber === totalPages}
            className="px-4 py-2 bg-black border-2 border-black text-white rounded-xl hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all flex items-center"
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
