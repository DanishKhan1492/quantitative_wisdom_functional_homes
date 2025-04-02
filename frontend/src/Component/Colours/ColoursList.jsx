import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import AddColourModal from "./AddColourModal";
import DeleteColourModal from "./DeleteColourModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  getAllColours,
  getColourById,
  deleteColour,
  updateColour,
  createColour,
} from "../../ApiService/ColorService/ColorApiService";
import LoadingScreen from "../Loading/Lodder";

const ColoursList = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [colourToDelete, setColourToDelete] = useState(null);
  const [editingColour, setEditingColour] = useState(null);
  const navigate = useNavigate();

  const [colours, setColours] = useState([]);
  const [displayedColours, setDisplayedColours] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Reset pageNumber to first page (0) on search term change
  useEffect(() => {
    setPageNumber(0);
  }, [searchTerm]);

  useEffect(() => {
    fetchColours();
  }, [pageNumber, size, searchTerm]);

useEffect(() => {
  if (filterTerm) {
    const lowerCaseFilter = filterTerm.toLowerCase();
    const filtered = colours.filter(
      (colour) =>
        (colour.description &&
          colour.description.toLowerCase().includes(lowerCaseFilter)) ||
        (colour.code && colour.code.toLowerCase().includes(lowerCaseFilter))
    );
    setDisplayedColours(filtered);
  } else if (searchTerm){
    const lowerCaseFilter = searchTerm.toLowerCase();
    const filtered = colours.filter(
      (colour) =>
        (colour.name &&
          colour.name.toLowerCase().includes(lowerCaseFilter)) 
        
    );
    setDisplayedColours(filtered);
    

    }else{
    setDisplayedColours(colours);
  }
}, [filterTerm, colours]);



  const fetchColours = async () => {
    setLoading(true);
    try {
      const res = await getAllColours(pageNumber, size, searchTerm, "");


      console.log("Fetched Colours:", res);
      const fetchedColours = res.data || [];
      setColours(fetchedColours);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || fetchedColours.length);
    } catch (error) {
      console.error("Error fetching colours:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch colours."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateColour = async (colourData) => {
    if (editingColour) {
      try {
        const updatedColour = await updateColour(
          editingColour.colourId,
          colourData
        );
        fetchColours();
        toast.success("Colour updated successfully");
        setEditingColour(null);
        setIsAddModalOpen(false);
      } catch (error) {
        console.error("Error updating colour:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to update colour."
        );
      }
    } else {
      // Create new colour
      try {
        const createdColour = await createColour(colourData);
        toast.success("Colour created successfully");
        setIsAddModalOpen(false);
        fetchColours(); // Refresh the list to include the new colour
      } catch (error) {
        console.error("Error creating colour:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to create colour."
        );
      }
    }
  };

  // Delete colour handlers
  const handleDeleteClick = (colour) => {
    console.log("Deleting colour:", colour);
    setColourToDelete(colour);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (colourToDelete) {
      console.log("Confirm deleting colour with ID:", colourToDelete.colourId);
      try {
        await deleteColour(colourToDelete.colourId);
        fetchColours();
        setIsDeleteModalOpen(false);
        setColourToDelete(null);
        toast.success("Colour deleted successfully");
      } catch (error) {
        console.error("Error deleting colour:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to delete colour."
        );
      }
    }
  };

  // Edit colour handler
  const handleEditClick = async (colourId) => {
    try {
      const colourData = await getColourById(colourId);
      setEditingColour(colourData);
      setIsAddModalOpen(true);
    } catch (error) {
      console.error("Error fetching colour for editing:", error);
      toast.error("Colour not found");
    }
  };

  const handleViewClick = (colourId) => {
    navigate(`/colour-details/${colourId}`);
  };

  // Pagination button handlers
  const handlePreviousPage = () => {
    if (pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber + 1 < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  // Function to render page number buttons
  const renderPageNumbers = () => {
    const pageButtons = [];
    const maxVisiblePages = 5; // Number of visible page buttons excluding first/last/ellipses

    // Helper function to add a page button
    const addPageButton = (i) => {
      pageButtons.push(
        <button
          key={i}
          onClick={() => setPageNumber(i)}
          className={`w-8 h-8 border-2 border-black flex items-center justify-center rounded-full transition-colors ${
            i === pageNumber
              ? "bg-white text-black  font-bold"
              : "bg-black border border-blue-500 text-white hover:bg-slate-700"
          }`}
        >
          {i + 1}
        </button>
      );
    };

    // Helper function to add ellipsis
    const addEllipsis = (key) => {
      pageButtons.push(
        <span key={`ellipsis-${key}`} className="px-2 text-black">
          ...
        </span>
      );
    };

    if (totalPages <= maxVisiblePages + 2) {
      // +2 for first and last page
      // If we have a small number of pages, show all of them
      for (let i = 0; i < totalPages; i++) {
        addPageButton(i);
      }
    } else {
      // Always show first page
      addPageButton(0);

      // Determine start and end of visible range around current page
      let startPage = Math.max(
        1,
        pageNumber - Math.floor((maxVisiblePages - 2) / 2)
      );
      let endPage = Math.min(totalPages - 2, startPage + maxVisiblePages - 3);

      // Adjust if we're near the end
      if (endPage - startPage < maxVisiblePages - 3) {
        startPage = Math.max(1, endPage - (maxVisiblePages - 3));
      }

      // Show ellipsis if needed before the range
      if (startPage > 1) {
        addEllipsis("start");
      }

      // Show the range of visible pages
      for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
      }

      // Show ellipsis if needed after the range
      if (endPage < totalPages - 2) {
        addEllipsis("end");
      }

      // Always show last page if there are more than one page
      if (totalPages > 1) {
        addPageButton(totalPages - 1);
      }
    }

    return pageButtons;
  };

  return (
    <div className="h-screen bg-background p-6">
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl font-bold text-black">Colours List</h1>

          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            {/* Search and Filter Section */}
            <div className="flex flex-1 gap-4">
              <motion.div
                className="relative flex-1"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="text"
                  placeholder="Search by name or code..."
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
                  placeholder="Filter by description..."
                  value={filterTerm}
                  onChange={(e) => setFilterTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#D6D3CF] rounded-xl text-[#262525] placeholder-[#262525]/50 focus:outline-none focus:ring-2 focus:ring-[#262525]/30"
                />

                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
                  size={20}
                />
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-colors"
                onClick={() => {
                  setEditingColour(null);
                  setIsAddModalOpen(true);
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Colour
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
                  Code
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
              {loading ? (
                <tr>
                  <td colSpan="4">
                    <div className="h-[400px] w-full flex items-center justify-center">
                      <LoadingScreen />
                    </div>
                  </td>
                </tr>
              ) : displayedColours && displayedColours.length > 0 ? (
                displayedColours.map((colour, index) => (
                  <tr
                    key={colour.colourId}
                    className="border-b border-slate-700 hover:bg-black/10 transition-colors"
                  >
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {colour.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-4 h-4 rounded"
                          style={{ backgroundColor: colour.code }}
                        ></span>
                        <span className="text-black font-medium">
                          {colour.code}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {colour.description && colour.description.length > 60
                          ? `${colour.description.slice(0, 60)}...`
                          : colour.description}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-green-800"
                          onClick={() => handleEditClick(colour.colourId)}
                        >
                          <Edit size={28} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-800"
                          onClick={() => handleDeleteClick(colour)}
                        >
                          <Trash2 size={28} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-3 text-center text-gray-500 whitespace-nowrap"
                  >
                    No colours found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-slate-400">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-0">
          {/* Styled "Showing records" display */}
          <span className="text-sm bg-black text-white px-4 py-2 rounded-full shadow-md">
            Showing {pageNumber * size + 1} to{" "}
            {Math.min((pageNumber + 1) * size, totalElements)} of{" "}
            {totalElements} entries
          </span>

          {/* Styled Page Size Selector */}
          <div className="relative">
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPageNumber(0); // reset to first page on page size change
              }}
              className="appearance-none pl-4 pr-10 py-2 bg-black rounded-full text-white text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 hover:bg-white/30"
            >
              {[5, 10, 15, 20, 50, 100].map((option) => (
                <option key={option} value={option} className="bg-slate-800">
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
            onClick={handlePreviousPage}
            disabled={pageNumber === 0}
            className="px-4 py-2 bg-black text-white rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-black transition-all hover:bg-slate-600 flex items-center"
          >
            <ChevronLeft size={18} className="mr-1" />
            Previous
          </button>

          <div className="flex gap-2">{renderPageNumbers()}</div>

          <button
            onClick={handleNextPage}
            disabled={pageNumber === totalPages - 1}
            className="px-4 py-2 bg-black text-white rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-black transition-all hover:bg-slate-600 flex items-center"
          >
            Next
            <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddColourModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingColour(null);
        }}
        onSubmit={handleCreateOrUpdateColour}
        isEditing={!!editingColour}
        colourData={editingColour}
      />
      <DeleteColourModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        colourToDelete= {colours.find((colour) => colour.colourId === colourToDelete?.colourId)}
      />
    </div>
  );
};

export default ColoursList;
