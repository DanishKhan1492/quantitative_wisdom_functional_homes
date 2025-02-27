import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Lock,
  Unlock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AddClientModal from "./AddClientModal";
// import DeleteConfirmationModal from "./DeleteModal";

const ShowClientRecord = () => {
  // Modal and client editing states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [editingClient, setEditingClient] = useState(null);

  // Data and filtering states
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");

  // Pagination states
  const [pageNumber, setPageNumber] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  // Dummy client data
  const dummyClientsData = [
    {
      id: 1,
      name: "Client One",
      email: "client1@example.com",
      primaryContactName: "Alice Smith",
      phoneNumber: "111-222-3333",
      city: "New York",
      stateProvince: "NY",
      country: "USA",
      status: true,
    },
    {
      id: 2,
      name: "Client Two",
      email: "client2@example.com",
      primaryContactName: "Bob Johnson",
      phoneNumber: "444-555-6666",
      city: "Los Angeles",
      stateProvince: "CA",
      country: "USA",
      status: false,
    },
    {
      id: 3,
      name: "Client Three",
      email: "client3@example.com",
      primaryContactName: "Charlie Brown",
      phoneNumber: "777-888-9999",
      city: "Chicago",
      stateProvince: "IL",
      country: "USA",
      status: true,
    },
    // Add more dummy clients if needed
  ];

  // Simulate fetching clients (using dummy data)
  const fetchClients = () => {
    setIsLoading(true);
    setTimeout(() => {
      setClients(dummyClientsData);
      setFilteredClients(dummyClientsData);
      setTotalElements(dummyClientsData.length);
      setTotalPages(Math.ceil(dummyClientsData.length / size));
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchClients();
  }, [pageNumber, size]);

  useEffect(() => {
    filterClients();
  }, [filterTerm, clients, searchTerm]);

  const filterClients = () => {
    let filtered = clients;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(lowerSearch) ||
          client.primaryContactName.toLowerCase().includes(lowerSearch)
      );
    }
    if (filterTerm) {
      const lowerFilter = filterTerm.toLowerCase();
      filtered = filtered.filter(
        (client) =>
          (client.city && client.city.toLowerCase().includes(lowerFilter)) ||
          (client.stateProvince &&
            client.stateProvince.toLowerCase().includes(lowerFilter)) ||
          (client.country && client.country.toLowerCase().includes(lowerFilter))
      );
    }
    setFilteredClients(filtered);
  };

  const handleCreateOrUpdateClient = (clientData) => {
    if (editingClient) {
      // Update existing client
      const updatedClients = clients.map((client) =>
        client.id === editingClient.id ? { ...client, ...clientData } : client
      );
      setClients(updatedClients);
      toast.success("Client updated successfully");
      setEditingClient(null);
      setIsModalOpen(false);
    } else {
      // Create new client (assign a unique id using Date.now())
      const newClient = { ...clientData, id: Date.now(), status: true };
      setClients([newClient, ...clients]);
      toast.success("Client added successfully");
      setIsModalOpen(false);
    }
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      const updatedClients = clients.filter(
        (client) => client.id !== clientToDelete.id
      );
      setClients(updatedClients);
      toast.success("Client deleted successfully");
      setIsDeleteModalOpen(false);
      setClientToDelete(null);
    }
  };

  const handleEditClick = (clientId) => {
    const clientData = clients.find((client) => client.id === clientId);
    if (clientData) {
      setEditingClient(clientData);
      setIsModalOpen(true);
    } else {
      toast.error("Client not found");
    }
  };

  const handleViewClick = (clientId) => {
    // Implement view logic (e.g., navigate to a client details page)
  };

  const handleStatusToggle = (clientId) => {
    const updatedClients = clients.map((client) =>
      client.id === clientId ? { ...client, status: !client.status } : client
    );
    setClients(updatedClients);
    toast.success("Client status updated");
  };

  // Render pagination page numbers
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

  // Pagination calculations (1-indexed)
  const startItem = (pageNumber - 1) * size + 1;
  const endItem = Math.min(pageNumber * size, totalElements);

  return (
    <div className="bg-background p-6 min-h-screen">
      {/* Header & Controls */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl font-bold text-black">Clients Management</h1>
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            {/* Search and Filter Section */}
            <div className="flex flex-1 gap-4">
              <motion.div
                className="relative flex-1"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="text"
                  placeholder="Search clients..."
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
                  placeholder="Filter by location..."
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
                className="flex items-center px-6 py-2 bg-black text-white rounded-xl hover:bg-slate-600 transition-colors"
                onClick={() => toast.info("Export not available in dummy data")}
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-colors"
                onClick={() => {
                  setEditingClient(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Client
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-h-60">
            <thead>
              <tr className="border-b border-[#D6D3CF] bg-tbhead">
                <th className="p-4 text-left text-black font-semibold">
                  Client
                </th>
                <th className="p-4 text-left text-black font-semibold">
                  Contact
                </th>
                <th className="p-4 text-left text-black font-semibold">
                  Location
                </th>
                <th className="p-4 text-left text-black font-semibold">
                  Status
                </th>
                <th className="p-4 text-left text-black font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5">
                    <div className="h-[400px] w-full flex items-center justify-center">
                      <p>Loading...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredClients && filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-slate-700 hover:bg-black/10 transition-colors"
                  >
                    <td className="px-4">
                      <div className="text-black font-medium">
                        {client.name}
                      </div>
                      <div className="text-black font-medium">
                        {client.email}
                      </div>
                    </td>
                    <td className="px-3">
                      <div className="text-black font-medium">
                        {client.primaryContactName}
                      </div>
                      <div className="text-black text-sm">
                        {client.phoneNumber}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-black font-medium">
                        {client.city}
                      </div>
                      <div className="text-black text-sm">
                        {client.stateProvince}, {client.country}
                      </div>
                    </td>
                    <td className="p-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleStatusToggle(client.id)}
                        className={`px-3 py-1 rounded-full flex items-center gap-2 ${
                          client.status
                            ? "bg-blue-500/20 text-black"
                            : "bg-slate-600/20 text-black"
                        }`}
                      >
                        {client.status ? (
                          <>
                            <Unlock size={24} />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <Lock size={24} />
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
                          className="text-blue-800"
                          onClick={() => handleViewClick(client.id)}
                        >
                          <Eye size={28} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-green-800"
                          onClick={() => handleEditClick(client.id)}
                        >
                          <Edit size={28} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-800"
                          onClick={() => handleDeleteClick(client)}
                        >
                          <Trash2 size={28} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-black">
                  <td
                    colSpan="5"
                    className="p-8 text-center text-slate-400 whitespace-nowrap"
                  >
                    No clients found.
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
                <option
                  key={option}
                  value={option}
                  className="bg-slate-800 hover:bg-white/30"
                >
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
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber === 1}
            className="px-4 py-2 bg-black text-white rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-black transition-all hover:bg-slate-600 flex items-center"
          >
            <ChevronLeft size={18} className="mr-1 text-white" />
            Previous
          </button>
          <div className="flex gap-2">{renderPageNumbers()}</div>
          <button
            onClick={() => setPageNumber(Math.min(totalPages, pageNumber + 1))}
            disabled={pageNumber >= totalPages}
            className="px-4 py-2 bg-black border-2 border-black text-white rounded-xl hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all flex items-center"
          >
            Next
            <ChevronRight size={18} className="ml-1 text-white" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        onSubmit={handleCreateOrUpdateClient}
        isEditing={!!editingClient}
        clientData={editingClient}
      />
      {/* <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      /> */}
    </div>
  );
};

export default ShowClientRecord;
