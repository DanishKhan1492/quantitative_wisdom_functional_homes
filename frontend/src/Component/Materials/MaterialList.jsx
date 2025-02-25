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
import AddEditMaterialModal from "./AddMaterialModal";
import DeleteMaterialModal from "./DeleteMaterialModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAllMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getMaterialById,
} from "../../ApiService/MaterialService/MaterialApiService";
import Loading from "../Loading/Lodder";
const MaterialsList = () => {
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size, setSize] = useState(10); 
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");


   useEffect(() => {
    setPageNumber(0);
  }, [searchTerm, filterTerm, size]);

  useEffect(() => {
    fetchMaterials();
  }, [pageNumber, size, searchTerm, filterTerm]);

  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      // Pass searchTerm and filterTerm to the API function
      const res = await getAllMaterials(pageNumber, size, searchTerm, filterTerm);
      console.log("Fetched Materials:", res);
      const fetchedMaterials = res.content || [];
      setMaterials(fetchedMaterials);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || fetchedMaterials.length);
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch materials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdateMaterial = async (materialData) => {
    if (editingMaterial) {
      // Update existing material
      try {
        const updatedMaterial = await updateMaterial(
          editingMaterial.materialId,
          materialData
        );
        setMaterials(
          materials.map((material) =>
            material.materialId === editingMaterial.materialId
              ? updatedMaterial
              : material
          )
        );
        toast.success("Material updated successfully");
        setEditingMaterial(null);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error updating material:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to update material."
        );
      }
    } else {
      // Create new material
      try {
        await createMaterial(materialData);
        setIsModalOpen(false);
        // Refresh the materials list after creation
        fetchMaterials();
      } catch (error) {
        console.error("Error creating material:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to create material."
        );
      }
    }
  };

  const handleDeleteClick = (material) => {
    console.log("Deleting material:", material);
    setMaterialToDelete(material);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (materialToDelete) {
      console.log(
        "Confirm deleting material with ID:",
        materialToDelete.materialId
      );
      try {
        await deleteMaterial(materialToDelete.materialId);
      
        fetchMaterials();
        setIsDeleteModalOpen(false);
        setMaterialToDelete(null);
        toast.success("Material deleted successfully");
      } catch (error) {
        console.error("Error deleting material:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to delete material."
        );
      }
    }
  };

  const handleEditClick = async (materialId) => {
    try {
      const materialData = await getMaterialById(materialId);
      setEditingMaterial(materialData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching material for editing:", error);
      toast.error("Failed to fetch material details");
    }
  };

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

  // Pagination calculations
  const startItem = pageNumber * size + 1;
  const endItem = Math.min((pageNumber + 1) * size, totalElements);

  return (
    <div className="h-screen bg-background p-6">
      {/* Header and Search/Filter Section */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl font-bold text-black">Materials List</h1>
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            {/* Search Input (by name or type) */}
            <motion.div
              className="relative flex-1"
              whileHover={{ scale: 1.02 }}
            >
              <input
                type="text"
                placeholder="Search by name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-[#D6D3CF] rounded-xl text-[#262525] placeholder-[#262525]/50 focus:outline-none focus:ring-2 focus:ring-[#262525]/30"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
                size={20}
              />
            </motion.div>
            {/* Filter Input (by description) */}
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
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
            </motion.div>
            {/* Action Button */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-colors"
                onClick={() => {
                  setEditingMaterial(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Material
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
              {isLoading ? (
                <tr>
                  <td colSpan="5">
                    <div className="h-[400px] w-full flex items-center justify-center">
                      <Loading />
                    </div>
                  </td>
                </tr>
              ) : materials && materials.length > 0 ? (
                materials.map((material) => (
                  <tr
                    key={material.materialId}
                    className="border-b border-slate-700 hover:bg-black/10 transition-colors"
                  >
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {material.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {material.type}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {material.description.length > 60
                          ? `${material.description.slice(0, 60)}...`
                          : material.description}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-green-400"
                          onClick={() => handleEditClick(material.materialId)}
                        >
                          <Edit size={28} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-400"
                          onClick={() => handleDeleteClick(material)}
                        >
                          <Trash2 size={28} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-black">
                    No materials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-white">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-0">
          {/* Styled "Showing records" display */}
          <span className="text-sm  bg-black  text-white px-4 py-2 rounded-full shadow-md">
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
            onClick={() => setPageNumber(Math.max(0, pageNumber - 1))}
            disabled={pageNumber === 0}
            className="px-4 py-2 bg-black text-white rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-black transition-all hover:bg-slate-600 flex items-center"
          >
            <ChevronLeft size={18} className="mr-1" />
            Previous
          </button>
          <div className="flex gap-2">{renderPageNumbers()}</div>
          <button
            onClick={() => setPageNumber(pageNumber + 1)}
            disabled={pageNumber === totalPages - 1}
            className="px-4 py-2 bg-black border-2 border-black text-white rounded-xl hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all flex items-center"
          >
            Next
            <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddEditMaterialModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMaterial(null);
        }}
        onSubmit={handleCreateOrUpdateMaterial}
        isEditing={!!editingMaterial}
        materialData={editingMaterial}
      />
      <DeleteMaterialModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        materialToDelete={materialToDelete}
      />
    </div>
  );
};

export default MaterialsList;
