

import React, { useState, useEffect } from "react";
import {
  X,
  ChevronRight,
  Plus,
  Package,
  Trash2,
  ChevronDown,
  Info,
  FolderX,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  createApartmentRequirement,
  getAllApartmentRequirements,
  deleteApartmentRequirement,
} from "../../ApiService/AppartmentRequirmentTypes/AppartmentRequirementTypesApi";
import { getAllFurnitureFamilies } from "../../ApiService/FurnitureFamily/FurnitureFamilyApiServices";
import {getSubFamilyByFamilyId} from "../../ApiService/SubFamily/SubFamilyApiService";
import { getAllApartmentTypes } from "../../ApiService/AppartmentType/AppartmentTypeApiService";
import { toast } from "react-toastify";
const AddProposalModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditMode,
  proposalData,
}) => {
 const [activeTab, setActiveTab] = useState("proposal");
 const [formValues, setFormValues] = useState({
   name: "",
   apartmentName: "",
   clientInfo: "",
   quantity: 0,
   price: "",
   status: "",
   discount: 0,
   familyId: 0,
   subFamilyId: 0,
 });

 // Requirement form state and list
 const [reqFormValues, setReqFormValues] = useState({
   apartmentTypeId: "",
   familyId: "",
   subFamilyId: "",
   quantity: "",
 });
 const [requirements, setRequirements] = useState([]);
 const [apartmenttype, setApartmentType] = useState([])
 const [families,setFamilies] = useState([])
 const [subFamilies, setSubFamilies] = useState([]);


 const getAllFamily = async () =>{
  const response = await getAllFurnitureFamilies();
setFamilies(response.content);
 }

const fetchSubFamilies = async (familyId) => {
    try {
      const response = await getSubFamilyByFamilyId(familyId);
      console.log(response,"=========")
      setSubFamilies(response);
    } catch (error) {
      console.error("Error fetching subfamilies:", error);
    }
  };

const fetchAllApertments = async() =>{
  const res = await getAllApartmentTypes();
  
  
  setApartmentType(res.content)
}



 useEffect(() => {
   getAllFamily();
   fetchAllApertments();
 }, []);

useEffect(() => {
  if (reqFormValues.familyId) {
    fetchSubFamilies(reqFormValues.familyId);
  } else {
    setSubFamilies([]);
  }
}, [reqFormValues.familyId]);



 const handleDiscountChange = (e) => {
   const value = parseFloat(e.target.value) || 0;
   if (value >= 0 && value <= 100) {
     setFormValues((prev) => ({ ...prev, discount: value }));
   }
 };

 // Calculate prices
 const originalPrice = 999;
 const discountAmount = (originalPrice * formValues.discount) / 100;
 const finalPrice = originalPrice - discountAmount;

 useEffect(() => {
   if (isEditMode && proposalData) {
     setFormValues({
       name: proposalData.name,
       apartmentName: proposalData.apartmentName,
       clientInfo: proposalData.clientInfo,
       quantity: proposalData.quantity,
       price: proposalData.price,
       status: proposalData.status,
       familyId: proposalData.familyId || 0,
       subFamilyId: proposalData.subFamilyId || 0,
     });
   } else {
     setFormValues({
       name: "",
       apartmentName: "",
       clientInfo: "",
       quantity: "",
       price: "",
       status: "",
       familyId: 0,
       subFamilyId: 0,
     });
   }
 }, [isEditMode, proposalData]);

 const handleChange = (e) => {
   const { name, value } = e.target;
   setFormValues((prevData) => ({ ...prevData, [name]: value }));
 };

 const handleSubmit = (e) => {
   e.preventDefault();
   onSubmit({
     ...formValues,
     quantity: parseInt(formValues.quantity, 10),
     price: parseFloat(formValues.price),
   });
   setFormValues({
     name: "",
     apartmentName: "",
     clientInfo: "",
     quantity: 1,
     price: "",
     status: "",
     familyId: 0,
     subFamilyId: 0,
   });
   onClose();
 };

 const handleQuantityChange = (newQuantity) => {
   if (newQuantity >= 1 && newQuantity <= 99) {
     setFormValues((prev) => ({
       ...prev,
       quantity: newQuantity,
     }));
   }
 };

 // ---------------------- Requirements API Integration ---------------------- //
 const loadRequirements = async () => {
   try {
     const data = await getAllApartmentRequirements();
     console.log(data,"====requirement========")
     setRequirements(data.content);
   } catch (error) {
     console.error("Error loading apartment requirements:", error);
   }
 };

 useEffect(() => {
   if (activeTab === "requirements") {
     loadRequirements();
   }
 }, [activeTab]);

 const handleReqChange = (e) => {
   const { name, value } = e.target;
   setReqFormValues({
     ...reqFormValues,
     [name]: name === "quantity" ? Number(value) : Number(value) || "", 
   });
 };


const handleSaveRequirement = async (e) => {
  e.preventDefault();
  try {
    const requestData = {
      apartmentTypeId: Number(reqFormValues.apartmentTypeId),
      familyId: Number(reqFormValues.familyId),
      subFamilyId: Number(reqFormValues.subFamilyId),
      quantity: Number(reqFormValues.quantity),
    };

    await createApartmentRequirement(requestData);

    // Reset form fields after successful submission
    setReqFormValues({
      apartmentTypeId: "",
      familyId: "",
      subFamilyId: "",
      quantity: "",
    });

    // Refresh requirements list without closing modal
    loadRequirements();

   
  } catch (error) {
    console.error("Error saving requirement:", error);
    toast.error("Failed to create apartment requirement");
  }
};
 

 if (!isOpen) return null;




  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center pt-6 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl   w-full max-w-[1500px] mx-4 shadow-2xl"
      >
        {/* Header Section */}
        <div className="bg-black p-6">
          <div className="flex items-center justify-between">
            {/* Main content container */}
            <div className="flex-1">
              {/* Title and tabs in single row */}
              <div className="flex items-center gap-8">
                {/* Title */}
                <h2 className="text-2xl font-bold text-white whitespace-nowrap">
                  {isEditMode ? "Update Proposal" : "Create New Proposal :"}
                </h2>

                {/* Tabs container */}
                <div className="flex gap-6">
                  <div
                    onClick={() => setActiveTab("proposal")}
                    className={`
                  relative px-6 py-3 text-xl font-medium cursor-pointer
                  border-b-2 transition-all duration-200
                  ${
                    activeTab === "proposal"
                      ? "text-white border-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 "
                      : "text-white border-transparent hover:text-slate-300 hover:border-slate-600"
                  }
                `}
                  >
                    Proposal Details
                  </div>
                  <div
                    onClick={() => setActiveTab("requirements")}
                    className={`
                  relative px-6 py-3 text-xl font-medium cursor-pointer
                  border-b-2 transition-all duration-200
                  ${
                    activeTab === "requirements"
                      ? "text-white border-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 "
                      : "text-white border-transparent hover:text-slate-300 hover:border-slate-600"
                  }
                `}
                  >
                    Apartment Requirement Type
                  </div>
                </div>
              </div>
            </div>

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white hover:text-white p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </motion.button>
          </div>
        </div>

        {/* Form Container with Reduced Height and Custom Thick Scrollbar */}
        <div className="p-6 h-[700px] overflow-y-auto  proposal_scrollbar">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <div className="flex-1">
              {activeTab === "proposal" ? (
                // Proposal Tab Content
                <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="group w-full">
                      <label className="block text-md font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          label="Proposal Name"
                          id="name"
                          name="name"
                          value={formValues.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter proposal name"
                          className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black 
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500 
                   hover:border-blue-400"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                        Apartment Type
                      </label>
                      <div className="relative">
                        <select
                          name="apartmentName"
                          value={formValues.apartmentName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black 
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500 
                   hover:border-blue-400"
                        >
                          <option value="">Select type</option>
                          <option value="Studio">Studio</option>
                          <option value="1BR">1 Bedroom</option>
                          <option value="2BR">2 Bedroom</option>
                        </select>
                        <ChevronRight
                          size={18}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transform rotate-90 pointer-events-none"
                        />
                      </div>
                    </div>

                    <div className="group w-full">
                      <label className="block text-md font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          label="Client Name"
                          id="clientInfo"
                          name="clientInfo"
                          value={formValues.clientInfo}
                          onChange={handleChange}
                          required
                          placeholder="Enter client name"
                          className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black 
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500 
                   hover:border-blue-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Products Section */}
                  <div className="bg-white shadow-md rounded-2xl p-6 border border-slate-600">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-black  flex items-center gap-2">
                        <Package size={20} className="text-black " />
                        Select Products
                      </h3>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <select
                        className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black 
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500 
                   hover:border-blue-400"
                      >
                        <option>Furniture Families</option>
                      </select>
                      <select
                        className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black 
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500 
                   hover:border-blue-400"
                      >
                        <option>Furniture SubFamilies</option>
                      </select>
                    </div>

                    {/* Products Table */}
                    <div className="w-full p-6 mt-4 bg-white rounded-xl border border-slate-700">
                      <div className="mb-4">
                        <div className="group w-full">
                          <label className="block text-md font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                            Product Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              label="Search Product"
                              name="searchProduct"
                              value=""
                              onChange={handleChange}
                              placeholder="Search By Name & SKU"
                              className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black 
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500 
                   hover:border-blue-400"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                                Product
                              </th>
                              <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                                SKU
                              </th>
                              <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                                Price
                              </th>
                              <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                                Stock
                              </th>
                              <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                                Quantity
                              </th>
                              <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="group hover:bg-slate-700/50 transition-all duration-200">
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-4">
                                  <div>
                                    <div className="text-md font-medium text-black">
                                      Modern Sofa
                                    </div>
                                    <div className="text-md text-black">
                                      Gray leather 3-seater
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-md text-white font-mono bg-black px-2 py-1 rounded">
                                  SKU-MS001
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-md font-medium text-black">
                                  <span className="text-sm text-black">
                                    AED{" "}
                                  </span>
                                  999
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 text-md font-medium text-green-800 bg-green-500/20 rounded-full">
                                  In Stock(7)
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="relative group">
                                  <div className="flex items-center bg-slate-700 border border-slate-600 rounded-full p-1 shadow-sm  transition-all duration-300">
                                    <button
                                      type="button"
                                      className="w-7 h-7 rounded-full bg-slate-600 text-white  transition-colors duration-200 flex items-center justify-center"
                                      onClick={() =>
                                        handleQuantityChange(
                                          formValues.quantity - 1
                                        )
                                      }
                                      disabled={formValues.quantity <= 0}
                                    >
                                      <span className="text-sm font-medium">
                                        -
                                      </span>
                                    </button>

                                    <div className="mx-2 text-white text-sm font-medium">
                                      {formValues.quantity || 0}
                                    </div>

                                    <button
                                      type="button"
                                      className="w-7 h-7 rounded-full bg-slate-600 text-white hover:bg-blue-500 transition-colors duration-200 flex items-center justify-center"
                                      onClick={() =>
                                        handleQuantityChange(
                                          formValues.quantity + 1
                                        )
                                      }
                                      disabled={formValues.quantity >= 99}
                                    >
                                      <span className="text-sm font-medium">
                                        +
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <motion.button
                                  type="button"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-colors"
                                >
                                  Add
                                </motion.button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Selected Products */}
                  <div className="bg-white rounded-2xl border border-slate-600 p-6">
                    <h3 className="text-lg font-semibold text-black mb-4">
                      Selected Products
                    </h3>
                    <div className="space-y-4">
                      {/* Selected Product Item */}
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl group hover:bg-slate-600 transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-medium text-md text-black">
                              Modern Sofa
                            </h4>
                            <p className="text-md text-black">
                              SKU-MS001 • Qty: 1
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="font-semibold text-md text-black">
                            AED 999
                          </span>
                          <button
                            type="button"
                            className="text-black hover:text-red-400 transition-colors duration-200"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Requirement Form */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-600">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <label className="block text-md font-medium text-black mb-2">
                          Apartment
                        </label>
                        <select
                          name="apartmentTypeId"
                          value={reqFormValues.apartmentTypeId}
                          onChange={handleReqChange}
                          className="w-full px-4 py-3 bg-white border-2 border-slate-700 rounded-xl text-black"
                        >
                          <option value="">Select Apartment</option>
                          {apartmenttype.map((item) => (
                            <option
                              key={item.apartmentId}
                              value={item.apartmentId}
                              className="bg-black text-white"
                            >
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Family Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Family
                        </label>
                        <select
                          name="familyId"
                          value={reqFormValues.familyId}
                          onChange={handleReqChange}
                          className="w-full px-4 py-3 bg-white border-2 border-slate-700 rounded-xl text-black"
                        >
                          <option value="">Select Family</option>
                          {families.map((item) => (
                            <option
                              key={item.familyId}
                              value={item.familyId}
                              className="bg-black text-white"
                            >
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* SubFamily Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          SubFamily
                        </label>
                        <select
                          name="subFamilyId"
                          value={reqFormValues.subFamilyId}
                          onChange={handleReqChange}
                          className="w-full px-4 py-3 bg-white border-2 border-slate-700 rounded-xl text-black"
                        >
                          <option value="">Select SubFamily</option>
                          {subFamilies.map((data) => (
                            <option
                              value={data.subFamilyId}
                              className="bg-black text-white"
                            >
                              {data.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Quantity */}
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          value={reqFormValues.quantity}
                          onChange={(e) =>
                            setReqFormValues({
                              ...reqFormValues,
                              quantity: parseInt(e.target.value),
                            })
                          }
                          placeholder="Enter quantity"
                          className="w-full px-4 py-3 bg-white border-2 border-slate-700 rounded-xl text-black"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={handleSaveRequirement}
                        className="flex items-center space-x-2 px-6 py-3 bg-black hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Save Requirement</span>
                      </button>
                    </div>
                  </div>

                  {/* Requirements List */}
                  <div className="flex-1 bg-white rounded-2xl border-2 border-slate-700/50 p-2 shadow-xl backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-black">
                        Requirements List
                      </h3>
                      <div className="flex items-center space-x-2 text-black">
                        <span className="text-xl">
                          Total: {requirements.length}
                        </span>
                        <Info className="w-4 h-4 hover:text-blue-400 cursor-help" />
                      </div>
                    </div>

                    <div className="h-[300px] overflow-y-auto custom-scrollbar scrollbar-thick scrollbar-thumb-blue-500 scrollbar-track-slate-700">
                      <table className="w-full border-collapse">
                        <thead className="sticky top-0 z-20">
                          <tr className="border-b border-[#D6D3CF] bg-tbhead">
                            <th className="px-6 py-4 text-left text-md font-semibold text-black uppercase tracking-wider border-b-2 border-slate-700/50">
                              Appartment Type
                            </th>
                            <th className="px-6 py-4 text-left text-md font-semibold text-black uppercase tracking-wider border-b-2 border-slate-700/50">
                              Family
                            </th>
                            <th className="px-6 py-4 text-left text-md font-semibold text-black uppercase tracking-wider border-b-2 border-slate-700/50">
                              SubFamily
                            </th>
                            <th className="px-6 py-4 text-left text-md font-semibold text-black uppercase tracking-wider border-b-2 border-slate-700/50">
                              Quantity
                            </th>
                            <th className="px-6 py-4 text-left text-md font-semibold text-black uppercase tracking-wider border-b-2 border-slate-700/50">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {requirements &&
                            requirements.map((req, index) => (
                              <tr
                                key={index}
                                className="group hover:bg-slate-800/10 transition-all duration-200 border-b border-slate-700/20 last:border-0"
                              >
                                <td className="px-6 py-4 text-sm font-medium text-black">
                                  {req.apartmentTypeName}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-black">
                                  {req.familyName}
                                </td>
                                <td className="px-6 py-4 text-sm text-black">
                                  {req.subFamilyName}
                                </td>
                                <td className="px-6 py-4 text-sm text-black font-medium">
                                  {req.quantity}
                                </td>
                                <td className="px-6 py-4">
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      try {
                                        await deleteApartmentRequirement(
                                          req.apartmentTypeRequirementId
                                        );

                                        loadRequirements();
                                      } catch (error) {
                                        console.error(
                                          "Error deleting requirement",
                                          error
                                        );
                                        toast.error(
                                          "Failed to delete requirement"
                                        );
                                      }
                                    }}
                                    className="p-2 rounded-lg hover:bg-slate-200 transition-all duration-200"
                                  >
                                    <Trash2
                                      size={28}
                                      className="text-black hover:text-red-400 transition-colors duration-200"
                                    />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          {requirements.length === 0 && (
                            <tr>
                              <td colSpan="4" className="py-12 text-center">
                                <div className="flex flex-col items-center justify-center text-slate-500">
                                  <FolderX className="w-12 h-12 mb-4" />
                                  No requirements found
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Always at the bottom */}
            <div className="mt-6 pt-6 border-t border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-8 mb-10">
                {activeTab === "proposal" && (
                  <>
                    <div className="group">
                      <label className="block text-xl font-medium text-black mb-2  transition-colors duration-200">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        value={formValues.discount}
                        onChange={handleDiscountChange}
                        min="0"
                        max="100"
                        className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black 
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500 
                   hover:border-blue-400"
                      />
                    </div>
                    <div className="space-y-1 ">
                      <div className="text-lg text-black">
                        Original Price:{" "}
                        <span className="line-through">
                          AED {originalPrice}
                        </span>
                      </div>
                      <div className="text-xl font-semibold text-black">
                        Final Price: <span className="text-black">AED 500</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  type="button"
                  className="px-6 py-2 bg-black/30 text-xl text-black rounded-xl transition-colors"
                >
                  Cancel
                </motion.button>
                {activeTab === "proposal" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-2 bg-black text-xl text-white rounded-xl hover:bg-slate-600 transition-colors"
                  >
                    Generate Proposal
                  </motion.button>
                )}
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddProposalModal;
