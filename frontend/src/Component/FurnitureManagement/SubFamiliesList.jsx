import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
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

  const [filteredSubFamilyList, setFilteredSubFamilyList] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");


  useEffect(() => {
    fetchSubFamilies();
  }, [page, size,searchTerm]);

  const fetchSubFamilies = async () => {
    setIsLoading(true)
    try {
      const response = await getAllSubFamilies(page, size, searchTerm);
      
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

   useEffect(() => {
    let filtered = subFamilyList
     if (filterTerm) {
       const lowerCaseFilter = filterTerm.toLowerCase();
        filtered = subFamilyList.filter(
         (subFamily) =>
           (subFamily.type &&
             subFamily.type.toLowerCase().includes(lowerCaseFilter)) ||
           (subFamily.description &&
             subFamily.description.toLowerCase().includes(lowerCaseFilter))
       );
       
     } 
     if (searchTerm) {
      console.log("search term here:", searchTerm)
      const lowerCaseFilter = searchTerm.toLowerCase();
       filtered = subFamilyList.filter(
          (subFamily) =>
            subFamily.name &&
            subFamily.name.toLowerCase().includes(lowerCaseFilter)
        ) ||
        (subFamily.familyName && subFamily.familyName.toLowerCase().includes(lowerCaseFilter));
       
     }
     setFilteredSubFamilyList(filtered)
   }, [filterTerm, subFamilyList]);

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


   const renderPageNumbers = () => {
     const pageButtons = [];
     const maxVisiblePages = 5;
     const currentPage = page + 1; // display value
     const total = totalPages; // total pages in 1-indexed form

     const addPageButton = (p) => {
       pageButtons.push(
         <button
           key={p}
           onClick={() => setPage(p - 1)}
           className={`w-8 h-8 flex items-center border-2 border-black justify-center rounded-full transition-colors ${
             p === currentPage
               ? "bg-white text-black  font-bold"
               : "bg-black border border-blue-500 text-white hover:bg-slate-700"
           }`}
         >
           {p}
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

     if (total <= maxVisiblePages) {
       for (let p = 1; p <= total; p++) {
         addPageButton(p);
       }
     } else {
       addPageButton(1);
       let startPage = Math.max(
         2,
         currentPage - Math.floor((maxVisiblePages - 2) / 2)
       );
       let endPage = Math.min(
         total - 1,
         currentPage + Math.floor((maxVisiblePages - 2) / 2)
       );
       if (currentPage <= Math.floor(maxVisiblePages / 2)) {
         startPage = 2;
         endPage = maxVisiblePages - 1;
       } else if (currentPage > total - Math.floor(maxVisiblePages / 2)) {
         endPage = total - 1;
         startPage = total - (maxVisiblePages - 2);
       }
       if (startPage > 2) {
         addEllipsis("start");
       }
       for (let p = startPage; p <= endPage; p++) {
         addPageButton(p);
       }
       if (endPage < total - 1) {
         addEllipsis("end");
       }
       addPageButton(total);
     }
     return pageButtons;
   };

  return (
    <div className="p-6 bg-background h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black flex items-center">
            <FolderTree className="mr-2 text-black" size={24} />
            Furniture Sub-Family
          </h1>
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            {/* Search by Name */}
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

            {/* Filter by Type and Category */}
            <motion.div
              className="relative flex-1"
              whileHover={{ scale: 1.02 }}
            >
              <input
                type="text"
                placeholder="Filter by type or category..."
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-[#D6D3CF] rounded-xl text-[#262525] placeholder-[#262525]/50 focus:outline-none focus:ring-2 focus:ring-[#262525]/30"
              />
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
                size={20}
              />
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-colors"
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
      </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden ">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D6D3CF] bg-tbhead">
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Family Name
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Sub Family Name
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Type
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Description
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Action
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
              ) : filteredSubFamilyList.length > 0 ? (
                filteredSubFamilyList.map((subFamily) => (
                  <tr
                    key={subFamily.subFamilyId}
                    className="border-b border-slate-700 hover:bg-black/10 transition-colors"
                  >
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {subFamily.familyName}
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
                        {subFamily.description.length > 60
                          ? `${subFamily.description.slice(0, 60)}...`
                          : subFamily.description}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-emerald-900 hover:text-emerald-300 transition-colors"
                          onClick={() =>
                            handleEditSubFamily(subFamily.subFamilyId)
                          }
                        >
                          <Edit size={28} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-900 hover:text-red-300 transition-colors"
                          onClick={() =>
                            handleDeleteSubFamily(subFamily.subFamilyId)
                          }
                        >
                          <Trash2 size={28} />
                        </motion.button>
                      </div>
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
          <span className="text-sm bg-gradient-to-r bg-black border-2 border-blue-500 text-white px-4 py-2 rounded-full shadow-md">
            Showing {startItem} to {endItem} of {totalElements} entries
          </span>
          <div className="relative">
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(0); // reset to first page on page size change
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
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={page === 0}
            className="px-4 py-2 bg-black text-white rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-black transition-all hover:bg-slate-600 flex items-center"
          >
            <ChevronLeft size={18} className="mr-1" />
            Previous
          </button>
          <div className="flex gap-2">{renderPageNumbers()}</div>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages - 1}
            className="px-4 py-2 bg-black border-2 border-black text-white rounded-xl hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all flex items-center"
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
