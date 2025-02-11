import { useState, useEffect } from "react";
import { Search, Filter, Edit, Trash2, Plus } from "lucide-react";
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

const ColoursList = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [colourToDelete, setColourToDelete] = useState(null);
  const [editingColour, setEditingColour] = useState(null);
  const navigate = useNavigate();

  // States for the list and pagination
  const [colours, setColours] = useState([]);
  const [displayedColours, setDisplayedColours] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // States for search & filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");

  // Reset page number to 0 when the search term changes
  useEffect(() => {
    setPageNumber(0);
  }, [searchTerm]);

  // Fetch colours when pageNumber, size, or searchTerm changes
  useEffect(() => {
    fetchColours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, size, searchTerm]);

  // Apply client-side filtering for description only (if filterTerm is provided)
  useEffect(() => {
    if (filterTerm) {
      const filtered = colours.filter(
        (colour) =>
          colour.description &&
          colour.description.toLowerCase().includes(filterTerm.toLowerCase())
      );
      setDisplayedColours(filtered);
    } else {
      setDisplayedColours(colours);
    }
  }, [filterTerm, colours]);

  // Fetch colours from the server
  const fetchColours = async () => {
    try {
      // Pass searchTerm for name/code filtering; adjust parameters as needed
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
    }
  };

  // Create or update colour (invoked from the modal)
  const handleCreateOrUpdateColour = async (colourData) => {
    if (editingColour) {
      // Update existing colour
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
      console.log("Confirm deleting colour with ID:", colourToDelete.id);
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

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Colours List</h1>

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
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
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
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
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
      <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
          <div
          className="max-h-[calc(100vh-280px)] overflow-y-auto"
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700">
                <th className="p-4 text-left text-slate-300 font-semibold">
                  Name
                </th>
                <th className="p-4 text-left text-slate-300 font-semibold">
                  Code
                </th>
                <th className="p-4 text-left text-slate-300 font-semibold">
                  Description
                </th>
                <th className="p-4 text-left text-slate-300 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedColours && displayedColours.length > 0 ? (
                displayedColours.map((colour) => (
                  <tr
                    key={colour.id}
                    className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="text-white font-medium">
                        {colour.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-4 h-4 rounded"
                          style={{ backgroundColor: colour.code }}
                        ></span>
                        <span className="text-white">{colour.code}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white">
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
                          className="text-green-400"
                          onClick={() => handleEditClick(colour.colourId)}
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-400"
                          onClick={() => handleDeleteClick(colour)}
                        >
                          <Trash2 size={18} />
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
      </div>
      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center text-slate-400">
        <div>
          Showing {pageNumber * size + 1} to{" "}
          {pageNumber * size + displayedColours.length} of {totalElements}{" "}
          entries
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
            onClick={handlePreviousPage}
            disabled={pageNumber === 0}
          >
            Previous
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
            onClick={handleNextPage}
            disabled={pageNumber + 1 >= totalPages}
          >
            Next
          </motion.button>
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
      />
    </div>
  );
};

export default ColoursList;
