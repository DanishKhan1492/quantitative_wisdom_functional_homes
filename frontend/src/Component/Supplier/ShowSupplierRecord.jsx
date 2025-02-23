

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Lock,
  Unlock,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AddSupplierModal from "./AddSupplierModal";
import DeleteConfirmationModal from "./DeleteModal";
import { toast } from "react-toastify";
import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  downloadSuppliersExcel,
} from "../../ApiService/SupplierService/SupplierApiService";
import Loading from "../../Component/Loading/Lodder"
const ShowSupplierRecord = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSuppliers();
  }, [pageNumber, size, searchTerm]);

  useEffect(() => {
    filterSuppliers();
  }, [filterTerm, suppliers]);

   const fetchSuppliers = async () => {
     setIsLoading(true); 
     try {
       const res = await getAllSuppliers(pageNumber, size, searchTerm);
       setSuppliers(res.data || []);
       setTotalElements(res.totalElements || 0);
       setTotalPages(
         res.totalPages || Math.ceil((res.totalElements || 0) / size)
       );
       setFilteredSuppliers(res.data || []);
     } catch (error) {
       console.error("Error fetching suppliers:", error);
       toast.error("Failed to fetch suppliers.");
     } finally {
       setIsLoading(false);
     }
   };

  const filterSuppliers = () => {
    let filtered = suppliers;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(lowerSearch) ||
          supplier.primaryContactName.toLowerCase().includes(lowerSearch)
      );
    }
    if (filterTerm) {
      const lowerFilter = filterTerm.toLowerCase();
      filtered = filtered.filter(
        (supplier) =>
          (supplier.city &&
            supplier.city.toLowerCase().includes(lowerFilter)) ||
          (supplier.state &&
            supplier.state.toLowerCase().includes(lowerFilter)) ||
          (supplier.country &&
            supplier.country.toLowerCase().includes(lowerFilter))
      );
    }
    setFilteredSuppliers(filtered);
  };

  const handleCreateOrUpdateSupplier = async (supplierData) => {
    if (editingSupplier) {
      try {
        await updateSupplier(editingSupplier.id, supplierData);
        fetchSuppliers();
        toast.success("Supplier updated successfully");
        setEditingSupplier(null);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error updating supplier:", error);
        toast.error("Failed to update supplier");
      }
    } else {
      try {
        const response = await createSupplier(supplierData);
        if (response) {
          fetchSuppliers();
          setIsModalOpen(false);
        }
      } catch (error) {
        console.error("Error creating supplier:", error);
        toast.error("Failed to create supplier");
      }
    }
  };

  const handleDeleteClick = (supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (supplierToDelete) {
      try {
        await deleteSupplier(supplierToDelete.id);
        fetchSuppliers();
        setIsDeleteModalOpen(false);
        setSupplierToDelete(null);
        toast.success("Supplier deleted successfully");
      } catch (error) {
        console.error("Error deleting supplier:", error);
        toast.error("Failed to delete supplier");
      }
    }
  };

  const handleEditClick = async (supplierId) => {
    try {
      const supplierData = await getSupplierById(supplierId);
      setEditingSupplier(supplierData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching supplier for editing:", error);
      toast.error("Failed to fetch supplier details");
    }
  };

  const handleViewClick = (supplierId) => {
    navigate(`/supplier-details/${supplierId}`);
  };

  const handleExcelDownload = async () => {
    try {
      const excelData = await downloadSuppliersExcel();
      const url = URL.createObjectURL(excelData);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "suppliers.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the Excel file:", error);
    }
  };

  // Pagination calculations (using 1-indexed pageNumber)
  const startItem = (pageNumber - 1) * size + 1;
  const endItem = Math.min(pageNumber * size, totalElements);

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      {/* Header & Controls */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl font-bold text-white">
            Suppliers Management
          </h1>
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            {/* Search and Filter Section */}
            <div className="flex flex-1 gap-4">
              <motion.div
                className="relative flex-1"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="text"
                  placeholder="Search suppliers..."
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
                  placeholder="Filter by location..."
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
                className="flex items-center px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                onClick={handleExcelDownload}
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-colors"
                onClick={() => {
                  setEditingSupplier(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Supplier
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-slate-800 rounded-xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-h-60">
            <thead>
              <tr className="bg-slate-700">
                <th className="p-4 text-left text-slate-300 font-semibold">
                  Supplier
                </th>
                <th className="p-4 text-left text-slate-300 font-semibold">
                  Contact
                </th>
                <th className="p-4 text-left text-slate-300 font-semibold">
                  Location
                </th>
                <th className="p-4 text-left text-slate-300 font-semibold">
                  Status
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
              ) : filteredSuppliers && filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="text-white font-medium">
                        {supplier.name}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {supplier.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white">
                        {supplier.primaryContactName}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {supplier.phoneNumber}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white">{supplier.city}</div>
                      <div className="text-slate-400 text-sm">{`${supplier.stateProvince}, ${supplier.country}`}</div>
                    </td>
                    <td className="p-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleStatusToggle(supplier.id)}
                        className={`px-3 py-1 rounded-full flex items-center gap-2 ${
                          supplier.status
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-slate-600/20 text-slate-400"
                        }`}
                      >
                        {supplier.status === true ? (
                          <>
                            <Unlock size={14} />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <Lock size={14} />
                            <span>Inactive</span>
                          </>
                        )}
                      </motion.button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-400"
                          onClick={() => handleViewClick(supplier.id)}
                        >
                          <Eye size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-green-400"
                          onClick={() => handleEditClick(supplier.id)}
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-400"
                          onClick={() => handleDeleteClick(supplier)}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-slate-700">
                  <td
                    colSpan="8"
                    className="p-8 text-center text-slate-400 whitespace-nowrap"
                  >
                    No suppliers found.
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
          <span className="text-sm bg-gradient-to-r bg-slate-800 border-2 border-blue-500  text-blue-300  px-4 py-2 rounded-full shadow-md">
            Showing {startItem} to {endItem} of {totalElements} entries
          </span>

          {/* Styled Page Size Selector */}
          <div className="relative">
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPageNumber(1);
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
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber === 1}
            className="appearance-none px-4 py-2 bg-slate-800 text-white rounded-xl  border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all hover:bg-slate-600 transition-colors flex items-center"
          >
            <ChevronLeft size={18} className="mr-1" />
            Previous
          </button>
          <button
            onClick={() => setPageNumber(pageNumber + 1)}
            disabled={pageNumber >= totalPages}
            className="appearance-none px-4 py-2 bg-slate-800  border-2 border-blue-500 text-white rounded-xl hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all transition-colors flex items-center"
          >
            Next
            <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddSupplierModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSupplier(null);
        }}
        onSubmit={handleCreateOrUpdateSupplier}
        isEditing={!!editingSupplier}
        supplierData={editingSupplier}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ShowSupplierRecord;
