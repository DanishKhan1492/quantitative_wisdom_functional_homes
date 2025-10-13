import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
  downloadApartmentTypesExcel
} from "../../ApiService/AppartmentType/AppartmentTypeApiService";
import { toast } from "react-toastify";
import LoadingScreen from "../Loading/Lodder";

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
  const [size, setSize] = useState(10);
  const [apartments, setApartments] = useState([]);
  const [displayedApartments, setDisplayedApartments] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch from API when page, search term, or size changes.
  useEffect(() => {
    fetchApartments();
  }, [pageNumber, searchTerm, size]);

  const fetchApartments = async () => {
    setLoading(true);
    try {
      // Convert pageNumber to 0-based for API call if needed.
      const data = await getAllApartmentTypes(pageNumber, size, searchTerm);
      const fetched = data.content || [];
      setApartments(fetched);
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

  // Client-side filtering by category using filterTerm.
  useEffect(() => {
    if (filterTerm) {
      const lowerCaseFilter = filterTerm.toLowerCase();
      const filtered = apartments.filter(
        (apartment) =>
          apartment.categoryName &&
          apartment.categoryName.toLowerCase().includes(lowerCaseFilter)
      );
      setDisplayedApartments(filtered);
    } else if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const filtered = apartments.filter(
        (apartment) =>
          apartment.name && apartment.name.toLowerCase().includes(lowerCaseSearch)
      );
      setDisplayedApartments(filtered);
    } else {
      setDisplayedApartments(apartments);
    }
  }, [filterTerm, apartments]);

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
      fetchApartments();
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

  const startItem = (pageNumber - 1) * size + 1;
  const endItem = Math.min(pageNumber * size, totalElements);

  const handlePreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const renderPageNumbers = () => {
    const pageButtons = [];
    const maxVisiblePages = 5;

    const addPageButton = (page) => {
      pageButtons.push(
        <button
          key={page}
          onClick={() => setPageNumber(page)}
          className={`w-8 h-8 flex border-2 border-black items-center justify-center rounded-full transition-colors ${
            page === pageNumber
              ? "bg-white text-black font-bold"
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
          ....
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

      if (pageNumber <= Math.floor(maxVisiblePages / 2)) {
        startPage = 2;
        endPage = maxVisiblePages - 1;
      } else if (pageNumber > totalPages - Math.floor(maxVisiblePages / 2)) {
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


  
const handleExcelDownload = async () => {
    try {
      const excelData = await downloadApartmentTypesExcel();
      const url = URL.createObjectURL(excelData);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Apartment.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the Excel file:", error);
    }
  };
  
  return (
    <div className="h-screen bg-background p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl font-bold text-black">Apartment Types</h1>
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
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#D6D3CF] rounded-xl text-[#262525] placeholder-[#262525]/50 focus:outline-none focus:ring-2 focus:ring-[#262525]/30"
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
                  placeholder="Filter by category..."
                  value={filterTerm}
                  onChange={(e) => setFilterTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#D6D3CF] rounded-xl text-[#262525] placeholder-[#262525]/50 focus:outline-none focus:ring-2 focus:ring-[#262525]/30"
                />
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
              </motion.div>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-6 py-2 bg-black text-white rounded-xl hover:bg-slate-600 transition-colors"
                onClick={handleExcelDownload}
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </motion.button>
            {/* Add Apartment Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-colors"
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
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Bedrooms
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Floor Area
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">
                    <div className="h-[400px] w-full flex items-center justify-center">
                      <LoadingScreen />
                    </div>
                  </td>
                </tr>
              ) : displayedApartments && displayedApartments.length > 0 ? (
                displayedApartments.map((apartment) => (
                  <tr
                    key={apartment.apartmentId}
                    className="border-b border-slate-700 hover:bg-black/10 transition-colors"
                  >
                    <td className="p-4">
                      <div className="text-black font-medium truncate">
                        {apartment.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-black font-medium truncate">
                        {apartment.categoryName}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {apartment.numberOfBedrooms}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {apartment.floorAreaMin} - {apartment.floorAreaMax}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-800"
                          onClick={() => handleViewClick(apartment.apartmentId)}
                        >
                          <Eye size={28} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-green-800"
                          onClick={() => handleEditClick(apartment.apartmentId)}
                        >
                          <Edit size={28} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-800"
                          onClick={() => handleDeleteClick(apartment)}
                        >
                          <Trash2 size={28} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-black">
                    No apartment types found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-white">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-0">
          <span className="text-sm bg-black text-white px-4 py-2 rounded-full shadow-md">
            Showing {startItem} to {endItem} of {totalElements} entries
          </span>
          <div className="relative">
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPageNumber(1);
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
              size={20}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={pageNumber === 1}
            className="px-4 py-2 bg-black text-white rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-black transition-all hover:bg-slate-600 flex items-center"
          >
            <ChevronLeft size={18} className="mr-1 text-white" />
            Previous
          </button>
          <div className="flex gap-2">{renderPageNumbers()}</div>
          <button
            onClick={handleNextPage}
            disabled={pageNumber >= totalPages}
            className="px-4 py-2 bg-black border-2 border-black text-white rounded-xl hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all flex items-center"
          >
            Next
            <ChevronRight size={18} className="ml-1 text-white" />
          </button>
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
        apartmentToDelete= {apartments.find(
          (apartment) => apartment.apartmentId === apartmentToDelete?.apartmentId
        )}
      />
    </div>
  );
};

export default AppartmentList;