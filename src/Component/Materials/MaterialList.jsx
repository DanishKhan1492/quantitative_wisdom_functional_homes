import { useState, useEffect } from "react";
import { Search, Filter, Edit, Trash2, Plus } from "lucide-react";
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

const MaterialsList = () => {
  // Modal and editing states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const navigate = useNavigate();

  // Pagination and materials list states
  const [materials, setMaterials] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size] = useState(10); // Items per page
  const [totalElements, setTotalElements] = useState(0);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");

  // Reset page to 0 whenever search or filter changes
  useEffect(() => {
    setPageNumber(0);
  }, [searchTerm, filterTerm]);

  // Fetch materials whenever pageNumber, size, searchTerm, or filterTerm changes
  useEffect(() => {
    fetchMaterials();
  }, [pageNumber, size, searchTerm, filterTerm]);

  const fetchMaterials = async () => {
    try {
      // Pass searchTerm as "name" and filterTerm as "description"
      const res = await getAllMaterials(
        pageNumber,
        size
      );
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
        // Refetch the list after deletion
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

  // Pagination calculations
  const startItem = pageNumber * size + 1;
  const endItem = Math.min((pageNumber + 1) * size, totalElements);

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      {/* Header and Search/Filter Section */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Materials List</h1>
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
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
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
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
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
      <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700">
                <th className="p-4  text-left text-slate-300 font-semibold">
                  Name
                </th>
                <th className="p-4 text-left text-slate-300 font-semibold">
                  Type
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
              {materials && materials.length > 0 ? (
                materials.map((material) => (
                  <tr
                    key={material.materialId}
                    className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="text-white font-medium">
                        {material.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white">{material.type}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-white">
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
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-400"
                          onClick={() => handleDeleteClick(material)}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">
                    No materials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center text-slate-400">
        <div>
          Showing {startItem} to {endItem} of {totalElements} entries
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
            disabled={pageNumber + 1 >= totalPages}
          >
            Next
          </motion.button>
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

// import { useState, useEffect } from "react";
// import { Search, Filter, Edit, Trash2, Download, Plus } from "lucide-react";
// import { motion } from "framer-motion";
// import AddEditMaterialModal from "./AddMaterialModal";
// import DeleteMaterialModal from "./DeleteMaterialModal";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   getAllMaterials,
//   createMaterial,
//   updateMaterial,
//   deleteMaterial,
//   getMaterialById,
// } from "../../ApiService/MaterialService/MaterialApiService";

// const MaterialsList = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [materialToDelete, setMaterialToDelete] = useState(null);
//   const [editingMaterial, setEditingMaterial] = useState(null);
//   const navigate = useNavigate();

//   const [materials, setMaterials] = useState([]);
//   const [pageNumber, setPageNumber] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [size] = useState(10); // Items per page
//   const [totalElements, setTotalElements] = useState(0);
//   const [filteredMaterials, setFilteredMaterials] = useState([]);

//   // State variables for search and filter inputs
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterTerm, setFilterTerm] = useState("");

//   useEffect(() => {
//     fetchMaterials();
//   }, [pageNumber, size]);

//   useEffect(() => {
//     filterMaterials();
//   }, [searchTerm, filterTerm, materials]);

//   const fetchMaterials = async () => {
//     try {
//       const res = await getAllMaterials(pageNumber, size);
//       console.log("Fetched Materials:", res); // Debugging log

//       const fetchedMaterials = res.content || [];
//       setMaterials(fetchedMaterials);
//       setTotalPages(res.totalPages || 0);
//       setTotalElements(res.totalElements || fetchedMaterials.length);
//     } catch (error) {
//       console.error("Error fetching materials:", error);
//       toast.error(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to fetch materials."
//       );
//     }
//   };

//   const filterMaterials = () => {
//     let filtered = materials;

//     if (searchTerm) {
//       const lowerCaseSearchTerm = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (material) =>
//           material.name.toLowerCase().includes(lowerCaseSearchTerm) ||
//           material.type.toLowerCase().includes(lowerCaseSearchTerm)
//       );
//     }

//     if (filterTerm) {
//       const lowerCaseFilterTerm = filterTerm.toLowerCase();
//       filtered = filtered.filter(
//         (material) =>
//           material.description &&
//           material.description.toLowerCase().includes(lowerCaseFilterTerm)
//       );
//     }

//     setFilteredMaterials(filtered);
//   };

//   const handlePageClick = (page) => {
//     setPageNumber(page);
//   };

//   const pageNumbers = [...Array(totalPages).keys()];

//   const startItem = pageNumber * size + 1;
//   const endItem = Math.min((pageNumber + 1) * size, totalElements);

//   const handleCreateOrUpdateMaterial = async (materialData) => {
//     if (editingMaterial) {
//       // Update existing material
//       try {
//         const updatedMaterial = await updateMaterial(
//           editingMaterial.materialId,
//           materialData
//         );
//         setMaterials(
//           materials.map((material) =>
//             material.materialId === editingMaterial.materialId
//               ? updatedMaterial
//               : material
//           )
//         );
//         toast.success("Material updated successfully");
//         setEditingMaterial(null);
//         setIsModalOpen(false);
//       } catch (error) {
//         console.error("Error updating material:", error);
//         toast.error(
//           error.response?.data?.message ||
//             error.message ||
//             "Failed to update material."
//         );
//       }
//     } else {
//       // Create new material
//       try {
//         await createMaterial(materialData);

//         setIsModalOpen(false);
//         // Optionally, refresh the materials list
//         fetchMaterials();
//       } catch (error) {
//         console.error("Error creating material:", error);
//         toast.error(
//           error.response?.data?.message ||
//             error.message ||
//             "Failed to create material."
//         );
//       }
//     }
//   };

//   const handleDeleteClick = (material) => {
//     console.log("Deleting material:", material); // Debugging log
//     setMaterialToDelete(material);
//     setIsDeleteModalOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (materialToDelete) {
//       console.log(
//         "Confirm deleting material with ID:",
//         materialToDelete.materialId
//       ); // Debugging log
//       try {
//         await deleteMaterial(materialToDelete.materialId);
//         setMaterials(
//           materials.filter((m) => m.materialId !== materialToDelete.materialId)
//         );
//         setIsDeleteModalOpen(false);
//         setMaterialToDelete(null);
//         toast.success("Material deleted successfully");
//       } catch (error) {
//         console.error("Error deleting material:", error);
//         toast.error(
//           error.response?.data?.message ||
//             error.message ||
//             "Failed to delete material."
//         );
//       }
//     }
//   };

//   const handleEditClick = async (materialId) => {
//     try {
//       const materialData = await getMaterialById(materialId);
//       setEditingMaterial(materialData);
//       setIsModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching material for editing:", error);
//       toast.error("Failed to fetch material details");
//     }
//   };

//   return (
//     <div className="h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
//       <div className="mb-6">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//           <h1 className="text-2xl font-bold text-white">Materials List</h1>

//           <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
//             {/* Search and Filter Section */}
//             <div className="flex flex-1 gap-4">
//               <motion.div
//                 className="relative flex-1"
//                 whileHover={{ scale: 1.02 }}
//               >
//                 <input
//                   type="text"
//                   placeholder="Search by name or type..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <Search
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
//                   size={20}
//                 />
//               </motion.div>

//               <motion.div
//                 className="relative flex-1"
//                 whileHover={{ scale: 1.02 }}
//               >
//                 <input
//                   type="text"
//                   placeholder="Filter by description..."
//                   value={filterTerm}
//                   onChange={(e) => setFilterTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <Filter
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
//                   size={20}
//                 />
//               </motion.div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-4">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
//                 onClick={() => {
//                   setEditingMaterial(null);
//                   setIsModalOpen(true);
//                 }}
//               >
//                 <Plus className="w-5 h-5 mr-2" />
//                 Add Material
//               </motion.button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-slate-700">
//                 <th className="p-4 text-left text-slate-300 font-semibold">
//                   Name
//                 </th>
//                 <th className="p-4 text-left text-slate-300 font-semibold">
//                   Type
//                 </th>
//                 <th className="p-4 text-left text-slate-300 font-semibold">
//                   Description
//                 </th>
//                 <th className="p-4 text-left text-slate-300 font-semibold">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredMaterials.length > 0 ? (
//                 filteredMaterials.map((material) => (
//                   <tr
//                     key={material.materialId}
//                     className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
//                   >
//                     <td className="p-4">
//                       <div className="text-white font-medium">
//                         {material.name}
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <div className="text-white">{material.type}</div>
//                     </td>
//                     <td className="p-4">
//                       <div className="text-white">
//                         {material.description.length > 60
//                           ? `${material.description.slice(0, 60)}...`
//                           : material.description}
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <div className="flex items-center gap-3">
//                         <motion.button
//                           whileHover={{ scale: 1.2 }}
//                           whileTap={{ scale: 0.9 }}
//                           className="text-green-400"
//                           onClick={() => handleEditClick(material.materialId)}
//                         >
//                           <Edit size={18} />
//                         </motion.button>
//                         <motion.button
//                           whileHover={{ scale: 1.2 }}
//                           whileTap={{ scale: 0.9 }}
//                           className="text-red-400"
//                           onClick={() => handleDeleteClick(material)}
//                         >
//                           <Trash2 size={18} />
//                         </motion.button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="p-3 text-center text-gray-500">
//                     No materials found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination */}
//       <div className="mt-6 flex justify-between items-center text-slate-400">
//         <div>
//           Showing {pageNumber * size + 1} to{" "}
//           {Math.min((pageNumber + 1) * size, filteredMaterials.length)} of{" "}
//           {filteredMaterials.length} entries
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
//             disabled={(pageNumber + 1) * size >= filteredMaterials.length}
//           >
//             Next
//           </motion.button>
//         </div>
//       </div>

//       {/* Modals */}
//       <AddEditMaterialModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setEditingMaterial(null);
//         }}
//         onSubmit={handleCreateOrUpdateMaterial}
//         isEditing={!!editingMaterial}
//         materialData={editingMaterial}
//       />
//       <DeleteMaterialModal
//         isOpen={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         onConfirm={handleConfirmDelete}
//         materialToDelete={materialToDelete}
//       />
//     </div>
//   );
// };

// export default MaterialsList;
