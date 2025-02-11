import React, { useState, useEffect } from "react";
import { Search, Filter, Eye, Edit, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AddApartmentModal from "./AddAppartmentModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import {
  createApartmentType,
  getAllApartmentTypes,
  getApartmentTypeById,
  updateApartmentType,
  deleteApartmentType,
} from "../../ApiService/AppartmentType/AppartmentTypeApiService";
import { toast } from "react-toastify";

const AppartmentList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [apartmentToDelete, setApartmentToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [apartmentToEdit, setApartmentToEdit] = useState(null);

  // Use 1-indexed page number for UI
  const [pageNumber, setPageNumber] = useState(1);
  const [size] = useState(10);
  const [apartments, setApartments] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch apartment types whenever pageNumber or searchTerm changes
  useEffect(() => {
    fetchApartments();
  }, [pageNumber, searchTerm]);

  const fetchApartments = async () => {
    setLoading(true);
    try {
      const data = await getAllApartmentTypes(pageNumber, size, searchTerm);
      // Use fallback defaults in case properties are missing
      setApartments(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(
        data.totalPages || Math.ceil((data.totalElements || 0) / size)
      );
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch apartment types.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApartment = async (newApartment) => {
    try {
      if (isEditMode && apartmentToEdit) {
        await updateApartmentType(apartmentToEdit.apartmentId, {
          ...newApartment,
          categoryId: Number(newApartment.categoryId),
        });
      } else {
        await createApartmentType({
          ...newApartment,
          categoryId: Number(newApartment.categoryId),
        });
      }
      fetchApartments(); // Refresh the list
      setIsModalOpen(false);
      setIsEditMode(false);
      setApartmentToEdit(null);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to save apartment type.");
    }
  };

  const handleDeleteClick = (apartment) => {
    setApartmentToDelete(apartment);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (apartmentToDelete) {
      try {
        await deleteApartmentType(apartmentToDelete.apartmentId);
        fetchApartments(); // Refresh the list
      } catch (err) {
        setError(err.message);
        toast.error("Failed to delete apartment type.");
      } finally {
        setIsDeleteModalOpen(false);
        setApartmentToDelete(null);
      }
    }
  };

  const handleEditClick = async (apartmentId) => {
    try {
      const apartment = await getApartmentTypeById(apartmentId);
      setApartmentToEdit(apartment);
      setIsEditMode(true);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch apartment details.");
    }
  };

  const handleViewClick = async (apartmentId) => {
    navigate(`/apartment-details/${apartmentId}`);
  };

  // Pagination calculations (using 1-indexed pageNumber)
  const startItem = (pageNumber - 1) * size + 1;
  const endItem = Math.min(pageNumber * size, totalElements);

  // Handlers for pagination controls
  const handlePreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Apartment Types</h1>
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            {/* Search and Filter Inputs */}
            <div className="flex flex-1 gap-4">
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
              <motion.div
                className="relative flex-1"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="text"
                  placeholder="Filter by type..."
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
            {/* Add Apartment Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              onClick={() => {
                setIsEditMode(false);
                setApartmentToEdit(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Apartment
            </motion.button>
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
                <th className="p-3 text-left text-slate-300 font-semibold">
                  Name
                </th>
                <th className="p-3 text-left text-slate-300 font-semibold">
                  Category
                </th>
                <th className="p-3 text-left text-slate-300 font-semibold">
                  Bedrooms
                </th>
                <th className="p-3 text-left text-slate-300 font-semibold">
                  Floor Area
                </th>
                <th className="p-3 text-left text-slate-300 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {apartments && apartments.length > 0 ? (
                apartments.map((apartment) => (
                  <tr
                    key={apartment.apartmentId}
                    className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="p-3">
                      <div className="text-white font-medium truncate">
                        {apartment.name}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-white truncate">
                        {apartment.categoryName}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-white">
                        {apartment.numberOfBedrooms}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-white">
                        {apartment.floorAreaMin} - {apartment.floorAreaMax}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-500"
                          onClick={() => handleViewClick(apartment.apartmentId)}
                        >
                          <Eye size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-green-400"
                          onClick={() => handleEditClick(apartment.apartmentId)}
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-400"
                          onClick={() => handleDeleteClick(apartment)}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No apartment types found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-between items-center">
        <span className="text-slate-400 text-sm">
          Showing {startItem} to {endItem} of {totalElements} entries
        </span>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreviousPage}
            disabled={pageNumber === 1}
            className="px-4 py-2 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
          >
            Previous
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextPage}
            disabled={pageNumber >= totalPages}
            className="px-4 py-2 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
          >
            Next
          </motion.button>
        </div>
      </div>

      {/* Modals */}
      <AddApartmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setApartmentToEdit(null);
        }}
        onSubmit={handleCreateApartment}
        isEditMode={isEditMode}
        apartment={apartmentToEdit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AppartmentList;
