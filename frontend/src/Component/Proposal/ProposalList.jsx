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
  exportProposalExcel,
} from "../../ApiService/ProposalServices/PorposalApiSurvice";
import { toast } from "react-toastify";

const ProposalList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [proposalToDelete, setProposalToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [proposalToEdit, setProposalToEdit] = useState(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await getAllProposals(
          pageNumber,
          size,
          searchTerm, // Send search term to API
          filterTerm // Send filter term to API
        );
        console.log(response,"=======proposal=========")
        setProposals(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error("Error fetching proposals:", error);
        toast.error("Failed to load proposals");
      }
    };
    fetchProposals();
  }, [pageNumber, size, searchTerm, filterTerm]);
  const paginatedProposals = proposals.slice(
    pageNumber * size,
    (pageNumber + 1) * size
  );


  const handleCreateProposal = async (newProposal) => {
    try {
      const createdProposal = await createProposal(newProposal);
      setProposals([createdProposal, ...proposals]);
     // toast.success("Proposal created successfully");
      setIsModalOpen(false);
    } catch (error) {
      //toast.error("Failed to create proposal");
      console.error("Error creating proposal:", error);
    }
  };

  const handleUpdateProposal = async (updatedProposal) => {
    try {
      const response = await updateProposal(
        updatedProposal.proposalId,
        updatedProposal
      );
      setProposals(
        proposals.map((p) =>
          p.proposalId === response.proposalId ? response : p
        )
      );
      toast.success("Proposal updated successfully");
      setIsModalOpen(false);
      setIsEditMode(false);
      setProposalToEdit(null);
    } catch (error) {
      toast.error("Failed to update proposal");
      console.error("Error updating proposal:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (proposalToDelete) {
      try {
        await deleteProposal(proposalToDelete.proposalId);
        setProposals(
          proposals.filter((p) => p.proposalId !== proposalToDelete.proposalId)
        );
        toast.success("Proposal deleted successfully");
        setIsDeleteModalOpen(false);
        setProposalToDelete(null);
      } catch (error) {
        toast.error("Failed to delete proposal");
        console.error("Error deleting proposal:", error);
      }
    }
  };

  const handleViewClick = async(proposal) => {
    const result = await getProposalById(proposal);
    if (result) {
      navigate(`/proposal-details/${proposal}`, { state: result });
    }
    
  };

  const handleEditClick = (proposal) => {
    setIsEditMode(true);
    setProposalToEdit(proposal);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (proposal) => {
    setProposalToDelete(proposal);
    setIsDeleteModalOpen(true);
  };

  const renderPageNumbers = () => {
    const pageButtons = [];
    const maxVisiblePages = 5;

    const addPageButton = (page) => {
      pageButtons.push(
        <button
          key={page}
          onClick={() => setPageNumber(page - 1)} // Changed to page-1
          className={`w-8 h-8 flex border-2 border-black items-center justify-center rounded-full transition-colors ${
            page - 1 === pageNumber // Now checks 0-based pageNumber
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
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Proposal Details
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Apartment
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Client Info
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Price Details
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Status
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {proposals
                .slice(pageNumber * size, (pageNumber + 1) * size)
                .map((proposal) => (
                  <tr key={proposal.proposalId}>
                    {/* Table Cells */}
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {proposal.name}
                      </div>
                      <div className="text-black font-medium">
                        {new Date(proposal.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    {/* Other table cells */}
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {proposal.apartmentType?.name || "N/A"}
                      </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="p-4">
                                          <div className="flex items-center gap-3">
                                            <motion.button
                                              whileHover={{ scale: 1.2 }}
                                              whileTap={{ scale: 0.9 }}
                                              className="text-blue-800"
                                              onClick={() => handleViewClick(proposal.id)}
                                            >
                                              <Eye size={28} />
                                            </motion.button>
                                            <motion.button
                                              whileHover={{ scale: 1.2 }}
                                              whileTap={{ scale: 0.9 }}
                                              className="text-green-800"
                                              onClick={() => handleEditClick(supplier.id)}
                                            >
                                              <Edit size={28} />
                                            </motion.button>
                                            <motion.button
                                              whileHover={{ scale: 1.2 }}
                                              whileTap={{ scale: 0.9 }}
                                              className="text-red-800"
                                              onClick={() => handleDeleteClick(supplier)}
                                            >
                                              <Trash2 size={28} />
                                            </motion.button>
                                          </div>
                                        </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-slate-400">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-0">
          {/* Styled "Showing records" display */}
          <span className="text-sm bg-gradient-to-r bg-black border-2 text-white px-4 py-2 rounded-full shadow-md">
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
              className="appearance-none pl-4 pr-10 py-2 bg-black  rounded-full text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all duration-300 hover:bg-slate-700"
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
        <div className="flex item-center space-x-2">
          <button
            onClick={() => setPageNumber(Math.max(0, pageNumber - 1))}
            disabled={pageNumber === 0} // Corrected disabled condition
            className="px-4 py-2 bg-black text-white rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-black transition-all hover:bg-slate-600 flex items-center"
          >
            <ChevronLeft size={18} className="mr-1" />
            Previous
          </button>
          <div className="flex gap-2">{renderPageNumbers()}</div>
          <button
            onClick={() => setPageNumber(pageNumber + 1)}
            disabled={pageNumber === totalPages - 1} // Corrected disabled condition
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
// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   Filter,
//   Eye,
//   Edit,
//   Trash2,
//   Download,
//   Plus,
//   FileDown,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import AddProposalModal from "./AddProposalModal";
// import DeleteConfirmationModal from "./DeleteConfirmationModal";

// const ProposalList = () => {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterTerm, setFilterTerm] = useState("");
//   const [pageNumber, setPageNumber] = useState(0);
//   const [size] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [proposalToDelete, setProposalToDelete] = useState(null);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [proposalToEdit, setProposalToEdit] = useState(null);

//   const [proposals, setProposals] = useState([
//     {
//       id: 1,
//       date: "11/11/2022",
//       name: "Proposal 1",
//       apartmentName: "Sunset Apartments",
//       clientInfo: "John Doe",
//       quantity: 1,
//       price: 1000,
//       totalPrice: 5000,
//       status: "Draft",
//     },
//     {
//       id: 2,
//       date: "11/11/2022",
//       name: "Proposal 2",
//       apartmentName: "Studio",
//       clientInfo: "Albert",
//       quantity: 2,
//       price: 1600,
//       totalPrice: 3000,
//       status: "Finalized",
//     },
//     {
//       id: 3,
//       date: "11/11/2022",
//       name: "Proposal 3",
//       apartmentName: "Condo",
//       clientInfo: "James",
//       quantity: 1,
//       price: 700,
//       totalPrice: 2100,
//       status: "Approved",
//     },
//   ]);

//   const [filteredProposals, setFilteredProposals] = useState(proposals);

//   useEffect(() => {
//     const filtered = proposals.filter((proposal) => {
//       const searchMatch = searchTerm
//         .toLowerCase()
//         .split(" ")
//         .every(
//           (term) =>
//             proposal.name.toLowerCase().includes(term) ||
//             proposal.clientInfo.toLowerCase().includes(term)
//         );

//       const filterMatch =
//         !filterTerm ||
//         filterTerm
//           .toLowerCase()
//           .split(" ")
//           .every((term) => proposal.status.toLowerCase().includes(term));

//       return searchMatch && filterMatch;
//     });

//     setFilteredProposals(filtered);
//   }, [proposals, searchTerm, filterTerm]);

//   const handleViewClick = (proposal) => {
//     navigate(`/proposal-details/${proposal.id}`, { state: proposal });
//   };

//   const handleCreateProposal = (newProposal) => {
//     setProposals([
//       ...proposals,
//       {
//         ...newProposal,
//         id: proposals.length + 1,
//         date: new Date().toLocaleDateString(),
//         totalPrice: newProposal.quantity * newProposal.price,
//       },
//     ]);
//     setIsModalOpen(false);
//   };

//   const handleEditClick = (proposal) => {
//     setIsEditMode(true);
//     setProposalToEdit(proposal);
//     setIsModalOpen(true);
//   };

//   const handleUpdateProposal = (updatedProposal) => {
//     setProposals(
//       proposals.map((p) => (p.id === updatedProposal.id ? updatedProposal : p))
//     );
//     setIsModalOpen(false);
//     setIsEditMode(false);
//     setProposalToEdit(null);
//   };

//   const handleDeleteClick = (proposal) => {
//     setProposalToDelete(proposal);
//     setIsDeleteModalOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (proposalToDelete) {
//       setProposals(proposals.filter((p) => p.id !== proposalToDelete.id));
//       setIsDeleteModalOpen(false);
//       setProposalToDelete(null);
//     }
//   };

//   const paginatedProposals = filteredProposals.slice(
//     pageNumber * size,
//     (pageNumber + 1) * size
//   );

//    const renderPageNumbers = () => {
//      const pageButtons = [];
//      const maxVisiblePages = 5;

//      const addPageButton = (page) => {
//        pageButtons.push(
//          <button
//            key={page}
//            onClick={() => setPageNumber(page - 1)} // Changed to page-1
//            className={`w-8 h-8 flex border-2 border-black items-center justify-center rounded-full transition-colors ${
//              page - 1 === pageNumber // Now checks 0-based pageNumber
//                ? "bg-white text-black  font-bold"
//                : "bg-black border border-blue-500 text-white hover:bg-slate-700"
//            }`}
//          >
//            {page}
//          </button>
//        );
//      };

//      const addEllipsis = (key) => {
//        pageButtons.push(
//          <span key={`ellipsis-${key}`} className="px-2 text-black">
//            ...
//          </span>
//        );
//      };

//      if (totalPages <= maxVisiblePages) {
//        for (let page = 1; page <= totalPages; page++) {
//          addPageButton(page);
//        }
//      } else {
//        // Always show first page
//        addPageButton(1);

//        let startPage = Math.max(
//          2,
//          pageNumber - Math.floor((maxVisiblePages - 2) / 2)
//        );
//        let endPage = Math.min(
//          totalPages - 1,
//          pageNumber + Math.floor((maxVisiblePages - 2) / 2)
//        );

//        // Adjust if near the start
//        if (pageNumber <= Math.floor(maxVisiblePages / 2)) {
//          startPage = 2;
//          endPage = maxVisiblePages - 1;
//        }
//        // Adjust if near the end
//        else if (pageNumber > totalPages - Math.floor(maxVisiblePages / 2)) {
//          endPage = totalPages - 1;
//          startPage = totalPages - (maxVisiblePages - 2);
//        }

//        if (startPage > 2) {
//          addEllipsis("start");
//        }

//        for (let page = startPage; page <= endPage; page++) {
//          addPageButton(page);
//        }

//        if (endPage < totalPages - 1) {
//          addEllipsis("end");
//        }

//        // Always show last page
//        addPageButton(totalPages);
//      }

//      return pageButtons;
//    };

//   return (
//     <div className="h-screen bg-background p-6">
//       <div className="mb-6">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//           <h1 className="text-2xl font-bold text-black">Proposal Management</h1>

//           <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
//             <div className="flex flex-1 gap-4">
//               <motion.div
//                 className="relative flex-1"
//                 whileHover={{ scale: 1.02 }}
//               >
//                 <input
//                   type="text"
//                   placeholder="Search proposals..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 bg-white border border-[#D6D3CF] rounded-xl text-[#262525] placeholder-[#262525]/50 focus:outline-none focus:ring-2 focus:ring-[#262525]/30"
//                 />
//                 <Search
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
//                   size={20}
//                 />
//               </motion.div>

//               <motion.div
//                 className="relative flex-1"
//                 whileHover={{ scale: 1.02 }}
//               >
//                 <input
//                   type="text"
//                   placeholder="Filter by status..."
//                   value={filterTerm}
//                   onChange={(e) => setFilterTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 bg-white border border-[#D6D3CF] rounded-xl text-[#262525] placeholder-[#262525]/50 focus:outline-none focus:ring-2 focus:ring-[#262525]/30"
//                 />
//                 <Filter
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
//                   size={20}
//                 />
//               </motion.div>
//             </div>

//             <div className="flex gap-4">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-colors"
//                 onClick={() => console.log("Export clicked")}
//               >
//                 <Download className="w-5 h-5 mr-2" />
//                 Export
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-colors"
//                 onClick={() => setIsModalOpen(true)}
//               >
//                 <Plus className="w-5 h-5 mr-2" />
//                 Add Proposal
//               </motion.button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-[#D6D3CF] bg-tbhead">
//                 <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
//                   Proposal Details
//                 </th>
//                 <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
//                   Apartment
//                 </th>
//                 <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
//                   Client Info
//                 </th>
//                 <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
//                   Price Details
//                 </th>
//                 <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
//                   Status
//                 </th>
//                 <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedProposals.map((proposal) => (
//                 <tr
//                   key={proposal.id}
//                   className="border-b border-slate-700 hover:bg-black/10 transition-colors"
//                 >
//                   <td className="p-4">
//                     <div className="text-black font-medium">
//                       {proposal.name}
//                     </div>
//                     <div className="text-black font-medium">
//                       {proposal.date}
//                     </div>
//                   </td>
//                   <td className="p-4">
//                     <div className="text-black font-medium">
//                       {proposal.apartmentName}
//                     </div>
//                     <div className="text-black font-medium">
//                       Quantity: {proposal.quantity}
//                     </div>
//                   </td>
//                   <td className="p-4">
//                     <div className="text-black font-medium">
//                       {proposal.clientInfo}
//                     </div>
//                   </td>
//                   <td className="p-4">
//                     <div className="text-black font-medium">
//                       AED {proposal.price.toFixed(2)}
//                     </div>
//                     <div className="text-black font-medium">
//                       Total: AED {proposal.totalPrice.toFixed(2)}
//                     </div>
//                   </td>
//                   <td className="p-4">
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm ${
//                         proposal.status === "Approved"
//                           ? "bg-green-700 text-white"
//                           : proposal.status === "Draft"
//                           ? "bg-yellow-700 text-white"
//                           : "bg-blue-700 text-white"
//                       }`}
//                     >
//                       {proposal.status}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <div className="flex items-center gap-3">
//                       <motion.button
//                         whileHover={{ scale: 1.2 }}
//                         whileTap={{ scale: 0.9 }}
//                         className="text-blue-500"
//                         onClick={() => handleViewClick(proposal)}
//                       >
//                         <Eye size={28} />
//                       </motion.button>
//                       <motion.button
//                         whileHover={{ scale: 1.2 }}
//                         whileTap={{ scale: 0.9 }}
//                         className="text-green-400"
//                         onClick={() => handleEditClick(proposal)}
//                         disabled={proposal.status === "Approved"}
//                       >
//                         <Edit size={28} />
//                       </motion.button>
//                       <motion.button
//                         whileHover={{ scale: 1.2 }}
//                         whileTap={{ scale: 0.9 }}
//                         className="text-red-400"
//                         onClick={() => handleDeleteClick(proposal)}
//                       >
//                         <Trash2 size={28} />
//                       </motion.button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-slate-400">
//         <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-0">
//           {/* Styled "Showing records" display */}
//           <span className="text-sm bg-gradient-to-r bg-black border-2  text-white px-4 py-2 rounded-full shadow-md">
//             Showing {pageNumber * size + 1} to
//             {Math.min((pageNumber + 1) * size, filteredProposals.length)} of
//             {filteredProposals.length} entries
//           </span>

//           {/* Styled Page Size Selector */}
//           <div className="relative">
//             <select
//               value={size}
//               onChange={(e) => {
//                 setSize(Number(e.target.value));
//                 setPageNumber(0); // reset to first page on page size change
//               }}
//               className="appearance-none pl-4 pr-10 py-2 bg-black  rounded-full text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all duration-300 hover:bg-slate-700"
//             >
//               {[5, 10, 15, 20, 50, 100].map((option) => (
//                 <option
//                   key={option}
//                   value={option}
//                   className="bg-black text-white"
//                 >
//                   Show {option} records
//                 </option>
//               ))}
//             </select>
//             <ChevronDown
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none"
//               size={18}
//             />
//           </div>
//         </div>

//         {/* Pagination Buttons */}
//         <div className="flex item-center space-x-2">
//           <button
//             onClick={() => setPageNumber(Math.max(0, pageNumber - 1))}
//             disabled={pageNumber === 0} // Corrected disabled condition
//             className="px-4 py-2 bg-black text-white rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-black transition-all hover:bg-slate-600 flex items-center"
//           >
//             <ChevronLeft size={18} className="mr-1" />
//             Previous
//           </button>
//           <div className="flex gap-2">{renderPageNumbers()}</div>
//           <button
//             onClick={() => setPageNumber(pageNumber + 1)}
//             disabled={pageNumber === totalPages - 1} // Corrected disabled condition
//             className="px-4 py-2 bg-black border-2 border-black text-white rounded-xl hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all flex items-center"
//           >
//             Next
//             <ChevronRight size={18} className="ml-1" />
//           </button>
//         </div>
//       </div>
//       {/* <div className="mt-6 flex justify-between items-center text-slate-400">
//         <div>
//           Showing {pageNumber * size + 1} to{" "}
//           {Math.min((pageNumber + 1) * size, filteredProposals.length)} of{" "}
//           {filteredProposals.length} entries
//         </div>
//         <div className="flex gap-2">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="px-4 py-2 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
//             onClick={() => setPageNumber(Math.max(0, pageNumber - 1))}
//             disabled={pageNumber === 0}
//           >
//             Previous
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="px-4 py-2 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
//             onClick={() => setPageNumber(pageNumber + 1)}
//             disabled={(pageNumber + 1) * size >= filteredProposals.length}
//           >
//             Next
//           </motion.button>
//         </div>
//       </div> */}

//       <AddProposalModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setIsEditMode(false);
//           setProposalToEdit(null);
//         }}
//         onSubmit={isEditMode ? handleUpdateProposal : handleCreateProposal}
//         isEditMode={isEditMode}
//         proposalData={proposalToEdit}
//       />

//       <DeleteConfirmationModal
//         isOpen={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         onConfirm={handleConfirmDelete}
//       />
//     </div>
//   );
// };

// export default ProposalList;
