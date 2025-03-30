import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AddProposalModal from "./AddProposalModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import {
  getAllProposals,
  createProposal,
  updateProposal,
  deleteProposal,
  getProposalById,
  exportProposalPdf,
} from "../../ApiService/ProposalServices/PorposalApiSurvice";
import { toast } from "react-toastify";
import ProposalStatusCell from "./ProposalStatusCell";

const ProposalList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0); // 0-indexed
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [proposalToDelete, setProposalToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [proposalToEdit, setProposalToEdit] = useState(null);

  // State to track which proposal rows are expanded
  const [expandedRows, setExpandedRows] = useState([]);
  // State to store related products for each proposal by id
  const [relatedProductsData, setRelatedProductsData] = useState({});

  const fetchProposals = async () => {
    try {
      const response = await getAllProposals(
        pageNumber,
        size,
        searchTerm,
        filterTerm
      );
      console.log(response, "=======proposal=========");
      setProposals(response.content); // Already paginated
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      toast.error("Failed to load proposals");
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [pageNumber, size, searchTerm, filterTerm]);

  const handleCreateProposal = async (newProposal) => {
    try {
      const createdProposal = await createProposal(newProposal);
      // Prepend the newly created proposal (optional)
      setProposals([createdProposal, ...proposals]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating proposal:", error);
    }
  };

  const handleUpdateProposal = async (updatedProposal) => {
    try {
      await updateProposal(proposalToEdit.id, updatedProposal);
      fetchProposals();
      setIsModalOpen(false);
      setIsEditMode(false);
      setProposalToEdit(null);
    } catch (error) {
      console.error("Error updating proposal:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (proposalToDelete) {
      try {
        await deleteProposal(proposalToDelete.id);
        setProposals(proposals.filter((p) => p.id !== proposalToDelete.id));
        setIsDeleteModalOpen(false);
        setProposalToDelete(null);
      } catch (error) {
        toast.error("Failed to delete proposal");
        console.error("Error deleting proposal:", error);
      }
    }
  };

  const handleViewClick = async (e, proposalId) => {
    e.stopPropagation();
    const result = await getProposalById(proposalId);
    if (result) {
      navigate(`/proposal-details/${proposalId}`, { state: result });
    }
  };

  const handleEditClick = async (e, proposal) => {
    e.stopPropagation();
    const result = await getProposalById(proposal.id);
    console.log(result, "+++++++++ result-------");
    setProposalToEdit(result);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e, proposal) => {
    e.stopPropagation();
    setProposalToDelete(proposal);
    setIsDeleteModalOpen(true);
  };

  const handleExportPdf = async (e, proposalId) => {
    e.stopPropagation();
    try {
      const data = await exportProposalPdf(proposalId);
      const fileURL = window.URL.createObjectURL(new Blob([data]));
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", `proposal_${proposalId}.pdf`);
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
    } catch (error) {
      toast.error("Error exporting PDF");
      console.error("PDF export error:", error);
    }
  };

  // Dummy async function to simulate fetching related products for a proposal
  const fetchRelatedProducts = async (proposalId) => {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            productName: `Product A for proposal ${proposalId}`,
            description: "Description for Product A",
          },
          {
            id: 2,
            productName: `Product B for proposal ${proposalId}`,
            description: "Description for Product B",
          },
        ]);
      }, 500);
    });
  };

const toggleRowExpand = (proposalId) => {
  setExpandedRows((prev) =>
    prev.includes(proposalId)
      ? prev.filter((id) => id !== proposalId)
      : [...prev, proposalId]
  );
};

  const renderPageNumbers = () => {
    const pageButtons = [];
    const maxVisiblePages = 5;

    const addPageButton = (page) => {
      pageButtons.push(
        <button
          key={page}
          onClick={() => setPageNumber(page - 1)}
          className={`w-8 h-8 flex border-2 border-black items-center justify-center rounded-full transition-colors ${
            page - 1 === pageNumber
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
          ...
        </span>
      );
    };

    if (totalPages <= maxVisiblePages) {
      for (let page = 1; page <= totalPages; page++) {
        addPageButton(page);
      }
    } else {
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
      addPageButton(totalPages);
    }
    return pageButtons;
  };

  const handleProposalStatusChange = (proposalId, newStatus) => {
    setProposals(
      proposals.map((p) =>
        p.id === proposalId ? { ...p, status: newStatus } : p
      )
    );
  };

  return (
    <div className="h-screen bg-background p-6">
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl font-bold text-black">Proposal Management</h1>
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            <div className="flex flex-1 gap-4">
              <motion.div
                className="relative flex-1"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="text"
                  placeholder="Search proposals..."
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
                  placeholder="Filter by status..."
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
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-colors"
                onClick={() => console.log("Export clicked")}
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
                Add Proposal
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D6D3CF] bg-tbhead">
                <th className="p-4 text-left text-black font-semibold">
                  Proposal Details
                </th>
                <th className="p-4 text-left text-black font-semibold">
                  Apartment
                </th>
                <th className="p-4 text-left text-black font-semibold">
                  Client Info
                </th>
                <th className="p-4 text-left text-black font-semibold">
                  Price Details
                </th>
                <th className="p-4 text-left text-black font-semibold">
                  Status
                </th>
                <th className="p-4 text-left text-black font-semibold">Date</th>
                <th className="p-4 text-left text-black font-semibold">
                  Download
                </th>
                <th className="p-4 text-left text-black font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal) => (
                // Main proposal row with an onClick to toggle expansion
                <React.Fragment key={proposal.id}>
                  <tr
                    onClick={() => toggleRowExpand(proposal.id)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{
                            rotate: expandedRows.includes(proposal.id)
                              ? 180
                              : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-6 h-6 text-black font-bold" />
                        </motion.div>
                        <span className="text-black font-medium">
                          {proposal.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {proposal.apartmentName || "N/A"}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {proposal.clientName}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-black font-medium">
                        AED {proposal.totalPrice.toFixed(1)}
                      </div>
                    </td>
                    <td className="p-4">
                      <ProposalStatusCell
                        proposal={proposal}
                        onStatusChange={handleProposalStatusChange}
                      />
                    </td>
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {new Date(proposal.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {/* Excel Button (disabled) */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-600 rounded-xl cursor-not-allowed"
                        >
                          <FileText size={16} />
                          Excel
                        </motion.button>
                        {/* PDF Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => handleExportPdf(e, proposal.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-600 rounded-xl"
                        >
                          <FileText size={16} />
                          PDF
                        </motion.button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleViewClick(e, proposal.id)}
                          className="text-blue-800"
                        >
                          <Eye size={28} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleEditClick(e, proposal)}
                          className="text-green-800"
                        >
                          <Edit size={28} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleDeleteClick(e, proposal)}
                          className="text-red-800"
                        >
                          <Trash2 size={28} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                  {/* Expanded row for related products */}
                  {expandedRows.includes(proposal.id) && (
                    <tr className="bg-gray-50">
                      <td colSpan="8" className="p-4">
                        <div className="text-lg font-semibold mb-3">
                          Related Products
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[600px]">
                            <thead>
                              <tr className="bg-gray-200">
                                <th className="p-3 text-left text-sm font-semibold">
                                  Product Name
                                </th>
                                <th className="p-3 text-left text-sm font-semibold">
                                  SKU
                                </th>
                                <th className="p-3 text-left text-sm font-semibold">
                                  Quantity
                                </th>
                                <th className="p-3 text-left text-sm font-semibold">
                                  Total Price
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {proposal.proposalProducts.map((product) => (
                                <tr
                                  key={product.id}
                                  className="border-b border-gray-200"
                                >
                                  <td className="p-3">{product.name}</td>
                                  <td className="p-3">{product.sku}</td>
                                  <td className="p-3">{product.quantity}</td>
                                  <td className="p-3">
                                    AED {product.totalPrice.toFixed(1)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-slate-400">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-0">
          <span className="text-sm bg-gradient-to-r bg-black border-2 text-white px-4 py-2 rounded-full shadow-md">
            Showing {pageNumber * size + 1} to{" "}
            {Math.min((pageNumber + 1) * size, totalElements)} of{" "}
            {totalElements} entries
          </span>
          <div className="relative">
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPageNumber(0);
              }}
              className="appearance-none pl-4 pr-10 py-2 bg-black rounded-full text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all duration-300 hover:bg-slate-700"
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
        <div className="flex item-center space-x-2">
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
      <AddProposalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setProposalToEdit(null);
        }}
        onSubmit={isEditMode ? handleUpdateProposal : handleCreateProposal}
        isEditMode={isEditMode}
        proposalData={proposalToEdit}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ProposalList;
