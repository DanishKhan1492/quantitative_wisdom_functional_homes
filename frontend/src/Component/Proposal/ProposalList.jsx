import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  FileDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AddProposalModal from "./AddProposalModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const ProposalList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [size] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [proposalToDelete, setProposalToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [proposalToEdit, setProposalToEdit] = useState(null);

  const [proposals, setProposals] = useState([
    {
      id: 1,
      date: "11/11/2022",
      name: "Proposal 1",
      apartmentName: "Sunset Apartments",
      clientInfo: "John Doe",
      quantity: 1,
      price: 1000,
      totalPrice: 5000,
      status: "Draft",
    },
    {
      id: 2,
      date: "11/11/2022",
      name: "Proposal 2",
      apartmentName: "Studio",
      clientInfo: "Albert",
      quantity: 2,
      price: 1600,
      totalPrice: 3000,
      status: "Finalized",
    },
    {
      id: 3,
      date: "11/11/2022",
      name: "Proposal 3",
      apartmentName: "Condo",
      clientInfo: "James",
      quantity: 1,
      price: 700,
      totalPrice: 2100,
      status: "Approved",
    },
  ]);

  const [filteredProposals, setFilteredProposals] = useState(proposals);

  useEffect(() => {
    const filtered = proposals.filter((proposal) => {
      const searchMatch = searchTerm
        .toLowerCase()
        .split(" ")
        .every(
          (term) =>
            proposal.name.toLowerCase().includes(term) ||
            proposal.clientInfo.toLowerCase().includes(term)
        );

      const filterMatch =
        !filterTerm ||
        filterTerm
          .toLowerCase()
          .split(" ")
          .every((term) => proposal.status.toLowerCase().includes(term));

      return searchMatch && filterMatch;
    });

    setFilteredProposals(filtered);
  }, [proposals, searchTerm, filterTerm]);

  const handleViewClick = (proposal) => {
    navigate(`/proposal-details/${proposal.id}`, { state: proposal });
  };

  const handleCreateProposal = (newProposal) => {
    setProposals([
      ...proposals,
      {
        ...newProposal,
        id: proposals.length + 1,
        date: new Date().toLocaleDateString(),
        totalPrice: newProposal.quantity * newProposal.price,
      },
    ]);
    setIsModalOpen(false);
  };

  const handleEditClick = (proposal) => {
    setIsEditMode(true);
    setProposalToEdit(proposal);
    setIsModalOpen(true);
  };

  const handleUpdateProposal = (updatedProposal) => {
    setProposals(
      proposals.map((p) => (p.id === updatedProposal.id ? updatedProposal : p))
    );
    setIsModalOpen(false);
    setIsEditMode(false);
    setProposalToEdit(null);
  };

  const handleDeleteClick = (proposal) => {
    setProposalToDelete(proposal);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (proposalToDelete) {
      setProposals(proposals.filter((p) => p.id !== proposalToDelete.id));
      setIsDeleteModalOpen(false);
      setProposalToDelete(null);
    }
  };

  const paginatedProposals = filteredProposals.slice(
    pageNumber * size,
    (pageNumber + 1) * size
  );

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Proposal Management</h1>

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
                  placeholder="Filter by status..."
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

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                onClick={() => console.log("Export clicked")}
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
                Add Proposal
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700">
                <th className="p-4 text-left text-slate-300 font-semibold">
                  Proposal Details
                </th>
                <th className="p-4 text-left text-slate-300 font-semibold">
                  Apartment
                </th>
                <th className="p-4 text-left text-slate-300 font-semibold">
                  Client Info
                </th>
                <th className="p-4 text-left text-slate-300 font-semibold">
                  Price Details
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
              {paginatedProposals.map((proposal) => (
                <tr
                  key={proposal.id}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="text-white font-medium">
                      {proposal.name}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {proposal.date}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-white">{proposal.apartmentName}</div>
                    <div className="text-slate-400 text-sm">
                      Quantity: {proposal.quantity}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-white">{proposal.clientInfo}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white">
                      AED {proposal.price.toFixed(2)}
                    </div>
                    <div className="text-slate-400 text-sm">
                      Total: AED {proposal.totalPrice.toFixed(2)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        proposal.status === "Approved"
                          ? "bg-green-500/20 text-green-400"
                          : proposal.status === "Draft"
                          ? "bg-yellow-400/20 text-yellow-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {proposal.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-blue-500"
                        onClick={() => handleViewClick(proposal)}
                      >
                        <Eye size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-green-400"
                        onClick={() => handleEditClick(proposal)}
                        disabled={proposal.status === "Approved"}
                      >
                        <Edit size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-400"
                        onClick={() => handleDeleteClick(proposal)}
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center text-slate-400">
        <div>
          Showing {pageNumber * size + 1} to{" "}
          {Math.min((pageNumber + 1) * size, filteredProposals.length)} of{" "}
          {filteredProposals.length} entries
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
            onClick={() => setPageNumber(Math.max(0, pageNumber - 1))}
            disabled={pageNumber === 0}
          >
            Previous
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
            onClick={() => setPageNumber(pageNumber + 1)}
            disabled={(pageNumber + 1) * size >= filteredProposals.length}
          >
            Next
          </motion.button>
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
