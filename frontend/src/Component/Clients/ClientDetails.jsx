import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Edit,
  Trash2,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  getClientById,
  deleteClient,
  updateClient, // Ensure this API exists and is exported from your ClientApiService
} from "../../ApiService/ClientApiService/ClientApiService";
import { toast } from "react-toastify";
import AddClientModal from "./AddClientModal"; // Adjust path if needed
import DeleteClientModal from "./DeleteClientModal"; // Adjust path if needed

const ClientDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal state variables
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await getClientById(id);
        setClient(data);
      } catch (error) {
        console.error("Error fetching client details:", error);
        toast.error("Failed to fetch client details");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  // Open the edit modal
  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  // Update client via update API
  const handleUpdateClient = async (updatedData) => {
    try {
      const updatedClient = await updateClient(client.clientId, updatedData);
      setClient(updatedClient);
      toast.success("Client updated successfully");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Failed to update client");
    }
  };

  // Open delete confirmation modal
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  // Confirm deletion and call delete API
  const handleConfirmDelete = async () => {
    try {
      await deleteClient(client.clientId);
      toast.success("Client deleted successfully");
      setIsDeleteModalOpen(false);
      navigate("/client");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
        <div className="text-white">Client not found.</div>
      </div>
    );
  }

  // Reusable component for displaying an info card
  const InfoCard = ({ icon: Icon, title, value }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-black rounded-xl p-4 flex items-start gap-3"
    >
      <div className="bg-white p-2 rounded-lg">
        <Icon className="text-black" size={20} />
      </div>
      <div>
        <h3 className="text-white text-sm">{title}</h3>
        <p className="text-white font-medium mt-1">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="h-full bg-background p-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center text-black transition-colors"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Clients
          </motion.button>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-slate-600 transition-colors"
              onClick={handleEdit}
            >
              <Edit size={18} className="mr-2" />
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
              onClick={handleDeleteClick}
            >
              <Trash2 size={18} className="mr-2" />
              Delete
            </motion.button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 to-stone-900 p-6 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-black">
                    {client.name.charAt(0)}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white text-center">
                  {client.name}
                </h1>
                <p className="text-white mt-2">
                  {client.address.split("\n")[0]}
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <InfoCard
                    icon={Mail}
                    title="Primary Email"
                    value={client.email}
                  />
                  <InfoCard icon={Phone} title="Phone" value={client.phone} />
                  {client.secondaryPhone && (
                    <InfoCard
                      icon={Phone}
                      title="Secondary Phone"
                      value={client.secondaryPhone}
                    />
                  )}
                  <InfoCard
                    icon={MapPin}
                    title="Address"
                    value={client.address}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-black mb-2">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={Mail}
                  title="Primary Email"
                  value={client.email}
                />
                {client.secondaryEmail && (
                  <InfoCard
                    icon={Mail}
                    title="Secondary Email"
                    value={client.secondaryEmail}
                  />
                )}
                <InfoCard icon={Phone} title="Phone" value={client.phone} />
                {client.secondaryPhone && (
                  <InfoCard
                    icon={Phone}
                    title="Secondary Phone"
                    value={client.secondaryPhone}
                  />
                )}
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-black mb-4">
                Status Information
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-black rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Account Status</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        client.status
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      {client.status ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal for updating client */}
      {isEditModalOpen && (
        <AddClientModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateClient}
          isEditing={true}
          clientData={client}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteClientModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          clientToDelete={client}
        />
      )}
    </div>
  );
};

export default ClientDetails;

// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Edit,
//   Trash2,
//   ArrowLeft,
//   Mail,
//   Phone,
//   MapPin,
//   Globe,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import {
//   getClientById,
//   deleteClient,
// } from "../../ApiService/ClientApiService/ClientApiService";
// import { toast } from "react-toastify";

// const ClientDetails = () => {
//   const navigate = useNavigate();
//   const { id } = useParams(); // Get client ID from URL parameters
//   const [client, setClient] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchClient = async () => {
//         console.log(id, "clientId"); // Debugging log
//       try {
//         const data = await getClientById(id);
//         setClient(data);
//       } catch (error) {
//         console.error("Error fetching client details:", error);
//         toast.error("Failed to fetch client details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClient();
//   }, [id]);

//   const handleEdit = () => {
//     // Pass the clientId to the edit page via state or URL parameter as needed
//     navigate(`/clients`, { state: { editClientId: client.id } });
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteClient(client.id);
//       toast.success("Client deleted successfully");
//       navigate("/clients");
//     } catch (error) {
//       console.error("Error deleting client:", error);
//       toast.error("Failed to delete client");
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!client) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
//         <div className="text-white">Client not found.</div>
//       </div>
//     );
//   }

//   // Reusable component for displaying an info card
//   const InfoCard = ({ icon: Icon, title, value }) => (
//     <motion.div
//       whileHover={{ scale: 1.02 }}
//       className="bg-black rounded-xl p-4 flex items-start gap-3"
//     >
//       <div className="bg-white p-2 rounded-lg">
//         <Icon className="text-black" size={20} />
//       </div>
//       <div>
//         <h3 className="text-white text-sm">{title}</h3>
//         <p className="text-white font-medium mt-1">{value}</p>
//       </div>
//     </motion.div>
//   );

//   return (
//     <div className="h-full bg-background p-6">
//       <div className="w-full mx-auto">
//         {/* Header */}
//         <div className="mb-6 flex justify-between items-center">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="flex items-center text-black transition-colors"
//             onClick={() => navigate(-1)}
//           >
//             <ArrowLeft size={20} className="mr-2" />
//             Back to Clients
//           </motion.button>

//           <div className="flex gap-3">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-slate-600 transition-colors"
//               onClick={handleEdit}
//             >
//               <Edit size={18} className="mr-2" />
//               Edit
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="flex items-center px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
//               onClick={handleDelete}
//             >
//               <Trash2 size={18} className="mr-2" />
//               Delete
//             </motion.button>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Profile Section */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl shadow-xl overflow-hidden">
//               <div className="bg-gradient-to-r from-slate-900 to-stone-900 p-6 flex flex-col items-center">
//                 <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4">
//                   <span className="text-4xl font-bold text-black">
//                     {client.name.charAt(0)}
//                   </span>
//                 </div>
//                 <h1 className="text-2xl font-bold text-white text-center">
//                   {client.name}
//                 </h1>
//                 <p className="text-white mt-2">
//                   {client.address.split("\n")[0]}
//                 </p>
//               </div>
//               <div className="p-6">
//                 <div className="space-y-4">
//                   <InfoCard
//                     icon={Mail}
//                     title="Primary Email"
//                     value={client.email}
//                   />
//                   <InfoCard icon={Phone} title="Phone" value={client.phone} />
//                   {client.secondaryPhone && (
//                     <InfoCard
//                       icon={Phone}
//                       title="Secondary Phone"
//                       value={client.secondaryPhone}
//                     />
//                   )}
//                   <InfoCard
//                     icon={MapPin}
//                     title="Address"
//                     value={client.address}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Details Section */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Basic Information */}
//             <div className="bg-white rounded-xl shadow-xl p-6">
//               <h2 className="text-xl font-semibold text-black mb-2">
//                 Basic Information
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <InfoCard
//                   icon={Mail}
//                   title="Primary Email"
//                   value={client.email}
//                 />
//                 {client.secondaryEmail && (
//                   <InfoCard
//                     icon={Mail}
//                     title="Secondary Email"
//                     value={client.secondaryEmail}
//                   />
//                 )}
//                 <InfoCard icon={Phone} title="Phone" value={client.phone} />
//                 {client.secondaryPhone && (
//                   <InfoCard
//                     icon={Phone}
//                     title="Secondary Phone"
//                     value={client.secondaryPhone}
//                   />
//                 )}
//               </div>
//             </div>

//             {/* Status Card */}
//             <div className="bg-white rounded-xl shadow-xl p-6">
//               <h2 className="text-xl font-semibold text-black mb-4">
//                 Status Information
//               </h2>
//               <div className="grid grid-cols-1 gap-4">
//                 <div className="bg-black rounded-xl p-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-white">Account Status</span>
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm ${
//                         client.status
//                           ? "bg-black text-white"
//                           : "bg-white text-black"
//                       }`}
//                     >
//                       {client.status ? "Active" : "Inactive"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClientDetails;
