import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, Info, FolderX } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AddProductModal from "./AddProductModal";

import {
  getAllApartmentRequirements,
  createApartmentRequirement,
  deleteApartmentRequirement,
} from "../../ApiService/AppartmentRequirmentTypes/AppartmentRequirementTypesApi";
import { getAllFurnitureFamilies } from "../../ApiService/FurnitureFamily/FurnitureFamilyApiServices";
import { getSubFamilyByFamilyId } from "../../ApiService/SubFamily/SubFamilyApiService";
import { getAllApartmentTypes } from "../../ApiService/AppartmentType/AppartmentTypeApiService";
import { getAllActiveClients } from "../../ApiService/ClientApiService/ClientApiService";

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
    clientInfo: "",
    discount: 0,
  });
   const [reqFormValues, setReqFormValues] = useState({
     apartmentTypeId: "",
     familyId: "",
     subFamilyId: "",
     quantity: "",
   });

  const [selectedProducts, setSelectedProducts] = useState([]);
  console.log(selectedProducts,"--------selectedProducts======233=====");
  const clickHandledRef = useRef(false);
  const [requirements, setRequirements] = useState([]);
  const [apartmenttype, setApartmentType] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subFamilies, setSubFamilies] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [clientList, setClientList] = useState([]);

  
  
  const calculateOriginalPrice = (products) => {
    return products.reduce((total, product) => {
      const priceAfterProductDiscount = product.price - (product.price * (product.discount || 0) / 100);
      return total + (priceAfterProductDiscount * product.quantity);
    }, 0);
  };
  // State to track original price
  const [originalPrice, setOriginalPrice] = useState(0);
  // State to track final price
  const [finalPrice, setFinalPrice] = useState(0);

  // Update prices when products or discount changes
  useEffect(() => {
    const calcOriginalPrice = calculateOriginalPrice(selectedProducts);
    setOriginalPrice(calcOriginalPrice);

    // Calculate final price with discount
    const discountAmount = (calcOriginalPrice * formValues.discount) / 100;
    setFinalPrice(calcOriginalPrice - discountAmount);
  }, [selectedProducts, formValues.discount]);

  // Fetch clients, families, apartments on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const resClients = await getAllActiveClients();
        
        setClientList(resClients);

        const resFamilies = await getAllFurnitureFamilies();
        setFamilies(resFamilies.content);

        const resApts = await getAllApartmentTypes();
        setApartmentType(resApts.content);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const fetchSubFamilies = async () => {
      console.log(reqFormValues.familyId, "-------reqFormValues.familyId");

      if (reqFormValues.familyId) {
        try {
          const res = await getSubFamilyByFamilyId(reqFormValues.familyId);
          console.log(res, "-------res subfamilies-------");
          setSubFamilies(res);
        } catch (error) {
          console.error("Error fetching subfamilies:", error);
          setSubFamilies([]);
        }
      } else {
        setSubFamilies([]);
      }
    };

    fetchSubFamilies();
  }, [reqFormValues.familyId]);

  // If editing, populate fields
// If editing, populate fields
useEffect(() => {
  if (isEditMode && proposalData) {
    console.log(proposalData, "-------proposalData---112----");
    // Set form values including discount from API response
    setFormValues({
      name: proposalData.name || "",
      clientInfo: proposalData.clientId || "",
      discount: proposalData.discount || 0,
      apartmentTypeId: proposalData.apartmentTypeId || "",
    });

    // Make sure products have the price property for calculations
    const productsWithPrice = (proposalData.proposalProducts || []).map(
      (product) => {
        // Calculate individual price from totalPrice and quantity
        const price =
          product.quantity > 0 ? product.totalPrice / product.quantity : 0;
        return {
          ...product,
          productId: product.productId,
          price: price,
          quantity: product.quantity || 1,
          discount: product.productDiscount, // Map productDiscount to discount for consistency
        };
      }
    );

    setSelectedProducts(productsWithPrice);
  } else {
    setFormValues({
      name: "",
      clientInfo: "",
      discount: 0,
      apartmentTypeId: "",
    });
    setSelectedProducts([]);
  }
}, [isEditMode, proposalData]);

  // Input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleDiscountChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    if (val >= 0 && val <= 100) {
      setFormValues((prev) => ({ ...prev, discount: val }));
    }
  };

  // Key modification: If the product already exists, increment quantity
  
  const handleAddProduct = (newProduct) => {
    if (clickHandledRef.current) return;
    clickHandledRef.current = true;
    setSelectedProducts((prevProducts) => {
      const existingIndex = prevProducts.findIndex(
        (p) => p.productId === newProduct.productId
      );
      if (existingIndex >= 0) {
        const updatedProducts = [...prevProducts];
        updatedProducts[existingIndex].quantity += 1;
        const priceAfterProductDiscount = updatedProducts[existingIndex].price - 
          (updatedProducts[existingIndex].price * (updatedProducts[existingIndex].discount || 0) / 100);
        updatedProducts[existingIndex].totalPrice =
          updatedProducts[existingIndex].quantity * priceAfterProductDiscount;
        return updatedProducts;
      } else {
        const priceAfterProductDiscount = newProduct.price - 
          (newProduct.price * (newProduct.discount || 0) / 100);
        return [...prevProducts, {
          ...newProduct,
          totalPrice: newProduct.quantity * priceAfterProductDiscount
        }];
      }
    });
    setTimeout(() => {
      clickHandledRef.current = false;
    }, 0);
  };
  

  // Update product quantity from the list

  const updateProductQuantity = (productId, newQuantity) => {
    setSelectedProducts((prev) =>
      prev.map((p) => {
        if (p.productId === productId) {
          const priceAfterProductDiscount = p.price - (p.price * (p.discount || 0) / 100);
          return {
            ...p,
            quantity: newQuantity,
            totalPrice: newQuantity * priceAfterProductDiscount,
          };
        }
        return p;
      })
    );
  };
  

  // Remove product
  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.filter((p) => p.productId !== productId)
    );
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (selectedProducts.length === 0) {
  //     toast.error(
  //       "At least one product is required to create or update a proposal."
  //     );
  //     return;
  //   }

  //   const productApartmentTypeId = Number(selectedProducts[0].apartmentTypeId);
  //   const apartmentTypeId =
  //     productApartmentTypeId ||
  //     (isEditMode && proposalData?.apartmentTypeId
  //       ? Number(proposalData.apartmentTypeId)
  //       : null);

  //   if (!apartmentTypeId) {
  //     toast.error(
  //       "A valid Apartment Type is required. Please add a product with a selected Apartment Type."
  //     );
  //     return;
  //   }

  //   const payload = {
  //     name: formValues.name,
  //     apartmentTypeId: apartmentTypeId,
  //     clientId: Number(formValues.clientInfo),
  //     discount: formValues.discount, // Sending discount to the API
  //    finalPrice: finalPrice,
  //     proposalProducts: selectedProducts.map((product) => ({
  //       productId: product.productId,
  //       quantity: product.quantity,
  //       price: product.price,
  //       totalPrice: product.totalPrice,
  //     })),
  //   };

  //   onSubmit(payload);
  //   onClose();
  // };

  // Requirement management
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (selectedProducts.length === 0) {
      toast.error(
        "At least one product is required to create or update a proposal."
      );
      return;
    }
  
    const productApartmentTypeId = Number(selectedProducts[0].apartmentTypeId);
    const apartmentTypeId =
      productApartmentTypeId ||
      (isEditMode && proposalData?.apartmentTypeId
        ? Number(proposalData.apartmentTypeId)
        : null);
  
    if (!apartmentTypeId) {
      toast.error(
        "A valid Apartment Type is required. Please add a product with a selected Apartment Type."
      );
      return;
    }
  
    const payload = {
      name: formValues.name,
      apartmentTypeId: apartmentTypeId,
      clientId: Number(formValues.clientInfo),
      discount: formValues.discount,
      finalPrice: finalPrice,
      proposalProducts: selectedProducts.map((product) => {
        const priceAfterProductDiscount = product.price - (product.price * (product.discount || 0) / 100);
        return {
          productId: product.productId,
          quantity: product.quantity,
          price: priceAfterProductDiscount, // Send price after supplier discount
          totalPrice: product.quantity * priceAfterProductDiscount,
          productDiscount: product.discount || 0 // Send as productDiscount to API
        };
      }),
    };
  
    onSubmit(payload);
    onClose();
  };

  const handleReqChange = (e) => {
    const { name, value } = e.target;
    setReqFormValues((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : Number(value) || "",
    }));
  };

  const loadRequirements = async () => {
    try {
      const data = await getAllApartmentRequirements();
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
      setReqFormValues({
        apartmentTypeId: "",
        familyId: "",
        subFamilyId: "",
        quantity: "",
      });
      loadRequirements();
    } catch (error) {
      console.error("Error saving requirement:", error);
      toast.error("Failed to create apartment requirement");
    }
  };

  const handleDeleteRequirement = async (id) => {
    try {
      await deleteApartmentRequirement(id);
      loadRequirements();
    } catch (error) {
      console.error("Error deleting requirement:", error);
      toast.error("Failed to delete requirement");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-full mx-4 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-black p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-8">
                <h2 className="text-xl font-bold text-white whitespace-nowrap">
                  {isEditMode ? "Update Proposal" : "Create New Proposal :"}
                </h2>
                <div className="flex gap-6">
                  <div
                    onClick={() => setActiveTab("proposal")}
                    className={`relative px-6 py-3 text-xl font-medium cursor-pointer border-b-2 transition-all duration-200 ${
                      activeTab === "proposal"
                        ? "text-white border-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5"
                        : "text-white border-transparent hover:text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    Proposal Details
                  </div>
                  <div
                    onClick={() => setActiveTab("requirements")}
                    className={`relative px-6 py-3 text-xl font-medium cursor-pointer border-b-2 transition-all duration-200 ${
                      activeTab === "requirements"
                        ? "text-white border-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5"
                        : "text-white border-transparent hover:text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    Apartment Type Setup
                  </div>
                </div>
              </div>
            </div>
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

        {/* Body */}
        <div className="p-6 h-[750px] overflow-y-auto proposal_scrollbar">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <div className="flex-1">
              {activeTab === "proposal" ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Proposal Name */}
                    <div className="group w-full">
                      <label className="block text-md font-medium text-black mb-2">
                        Proposal Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="name"
                        value={formValues.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter proposal name"
                        className="w-full px-4 py-3 text-xl border border-black rounded-xl"
                      />
                    </div>
                    {/* Client Info */}
                    <div className="group w-full">
                      <label className="block text-md font-medium text-black mb-2">
                        Client Name <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="clientInfo"
                        value={formValues.clientInfo}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 text-xl border border-black rounded-xl"
                      >
                        <option value="">Select Client</option>
                        {clientList.map((client) => (
                          <option key={client.clientId} value={client.clientId}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Add Product Button */}
                  <div className="w-full flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setShowProductModal(true)}
                      className="px-6 py-3 bg-black text-white rounded-xl transition-colors"
                    >
                      Add Product
                    </motion.button>
                  </div>

                  {/* Selected Products */}
                  <div className="bg-white rounded-2xl border border-slate-600 p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Selected Products
                    </h3>
                    <div className="space-y-4">
                    

{selectedProducts.map((product) => {
  console.log(product,"--------product======123=====");
  // Calculate price after supplier discount
  const priceAfterDiscount = product.price - (product.price * (product.discount || 0) / 100);
  const totalAfterDiscount = priceAfterDiscount * product.quantity;
  
  return (
    <div
      key={product.productId}
      className="flex items-center justify-between p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex-1">
        <h4 className="font-semibold text-lg text-gray-800">{product.name}</h4>
        <p>
                              SKU: {product.sku} • Qty: {product.quantity}
                            </p>
      </div>
      
      <div className="flex items-center gap-8">
        {/* Original Price */}
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Original Price</p>
          <span className="text-sm font-medium text-gray-700">
            AED {product.price?.toFixed(2)}
          </span>
        </div>
        
        {/* Supplier Discount */}
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Product Discount</p>
          <span className="text-sm font-semibold text-orange-600">
            {(product.discount)}%
          </span>
        </div>
        
      
        
        {/* Quantity Input */}
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Quantity</p>
          <input
            type="number"
            min="1"
            value={product.quantity}
            onChange={(e) =>
              updateProductQuantity(
                product.productId,
                parseInt(e.target.value) || 1
              )
            }
            className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Total Price */}
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
          <span className="text-sm ">
            AED {totalAfterDiscount.toFixed(2)}
          </span>
        </div>
        
        {/* Remove Button */}
        <button
          onClick={() => handleRemoveProduct(product.productId)}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
          title="Remove Product"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
})}
                    </div>
                  </div>
                </div>
              ) : (
                // Requirements Tab
                <div className="space-y-6">
                  {/* Requirement Form */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-600">
                    <div className="grid grid-cols-3 gap-6">
                      {/* Apartment */}
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
                      {/* Family */}
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
                      {/* SubFamily */}
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
                              key={data.subFamilyId}
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
                          {requirements.map((req) => (
                            <tr
                              key={req.apartmentTypeRequirementId}
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
                                  onClick={() =>
                                    handleDeleteRequirement(
                                      req.apartmentTypeRequirementId
                                    )
                                  }
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
                              <td colSpan="5" className="py-12 text-center">
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
            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-8 mb-10">
                {activeTab === "proposal" && selectedProducts.length > 0 && (
                  <>
                    {/* Discount Input */}
                    <div className="group">
                      <label className="block text-xl font-medium text-black mb-2">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        value={formValues.discount}
                        onChange={handleDiscountChange}
                        min="0"
                        max="100"
                        className="w-full px-4 py-3 text-xl border border-black rounded-xl text-black placeholder-black transition-all duration-300 ease-in-out focus:border-blue-500 hover:border-blue-400"
                      />
                    </div>

                    {/* Price Display */}
                  
                    <div className="space-y-1">
  {formValues.discount > 0 ? (
    <>
      <div className="text-lg text-black">
        Subtotal:{" "}
        <span className="line-through">
          AED {originalPrice.toFixed(2)}
        </span>
      </div>
      <div className="text-lg text-black">
        Additional Discount ({formValues.discount}%):{" "}
        <span className="text-red-600">
          -AED {((originalPrice * formValues.discount) / 100).toFixed(2)}
        </span>
      </div>
      <div className="text-xl font-semibold text-green-600">
        Final Price: AED {finalPrice.toFixed(2)}
      </div>
    </>
  ) : (
    <div className="text-xl font-semibold text-black">
      Total Price: AED {originalPrice.toFixed(2)}
    </div>
  )}
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
                    {isEditMode ? "Update Proposal" : "Generate Proposal"}
                  </motion.button>
                )}
              </div>
            </div>
          </form>
        </div>
      </motion.div>
      {showProductModal && (
        <AddProductModal
          isOpen={showProductModal}
          onClose={() => setShowProductModal(false)}
          onAddProduct={handleAddProduct}
        />
      )}
    </div>
  );
};

export default AddProposalModal;
