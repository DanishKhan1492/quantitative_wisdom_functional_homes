import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { getAllColours } from "../../ApiService/ColorService/ColorApiService";
import { getAllMaterials } from "../../ApiService/MaterialService/MaterialApiService";
import { getAllFurnitureFamilies } from "../../ApiService/FurnitureFamily/FurnitureFamilyApiServices";
import { getAllSuppliers } from "../../ApiService/SupplierService/SupplierApiService";
import { getSubFamilyByFamilyId } from "../../ApiService/SubFamily/SubFamilyApiService";

const AddProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  productData,
}) => {
  const fileInputRef = useRef(null);

  // Basic product details
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [family, setFamily] = useState("");
  const [subFamily, setSubFamily] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [length, setLength] = useState("");
  const [materialIds, setMaterialIds] = useState([]);
  const [colourIds, setColourIds] = useState([]);
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [supplier, setSupplier] = useState("");
  const [status, setStatus] = useState(true);

  // Single state to hold both existing and new images
  // Each image object: { id, src, isNew, file (optional) }
  const [images, setImages] = useState([]);

  // Dropdown data
  const [colours, setColours] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subFamilies, setSubFamilies] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Handlers for material and colour selection
  const handleMaterialChange = (e) => {
    const selectedMaterial = e.target.value;
    setMaterialIds(selectedMaterial ? [selectedMaterial] : []);
  };

  const handleColourChange = (e) => {
    const selectedColour = e.target.value;
    setColourIds(selectedColour ? [selectedColour] : []);
  };

  // Fetch dropdown data
  const fetchColours = async () => {
    try {
      const response = await getAllColours();
      setColours(response.data);
    } catch (error) {
      console.error("Error fetching colours:", error);
    }
  };

  const fetchMaterial = async () => {
    try {
      const res = await getAllMaterials();
      setMaterials(res.content);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const fetchFamily = async () => {
    try {
      const res = await getAllFurnitureFamilies();
      setFamilies(res.content);
    } catch (error) {
      console.error("Error fetching families:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const data = await getAllSuppliers();
      setSuppliers(data.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const fetchSubFamilies = async (familyId) => {
    try {
      const response = await getSubFamilyByFamilyId(familyId);
      setSubFamilies(response);
    } catch (error) {
      console.error("Error fetching subfamilies:", error);
    }
  };

  // Fetch subfamilies when family changes
  useEffect(() => {
    if (family) {
      fetchSubFamilies(family);
    } else {
      setSubFamilies([]);
      setSubFamily("");
    }
  }, [family]);

  // Fetch dropdowns on mount
  useEffect(() => {
    fetchColours();
    fetchMaterial();
    fetchFamily();
    fetchSuppliers();
  }, []);

  // Prepopulate form fields and images when editing
  useEffect(() => {
    if (isEditing && productData) {
      setName(productData.name || "");
      setSku(productData.sku || "");
      setFamily(productData.familyId || "");
      setSubFamily(productData.subFamilyId || "");
      setWidth(productData.width || "");
      setHeight(productData.height || "");
      setLength(productData.length || "");
      setMaterialIds(productData.materials?.map((m) => m.materialId) || []);
      setColourIds(productData.colours?.map((c) => c.colourId) || []);
      setPrice(productData.price || "");
      setDiscount(productData.discount || "");
      setSupplier(productData.supplierId || "");
      setStatus(productData.status === "Active");

      // Combine old images into one state
      if (productData.allImages && productData.allImages.length > 0) {
        const existingImgs = productData.allImages.map((img, index) => ({
          id: `existing-${index}`,
          // Assuming these are base64 strings; adjust if they're URLs
          src: `data:image/png;base64,${img}`,
          isNew: false,
        }));
        setImages(existingImgs);
      } else if (productData.images) {
        // If images are provided as comma-separated strings
        const existingImgs = productData.images
          .split(",")
          .map((img, index) => ({
            id: `existing-${index}`,
            src: img.trim(),
            isNew: false,
          }));
        setImages(existingImgs);
      }
    }
  }, [isEditing, productData]);

  function convertBase64ToBlob(base64Data, contentType = "image/png") {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }


  // When selecting new images, append them to the current images state
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      const newImgs = selectedFiles.map((file) => ({
        id: `new-${Date.now()}-${file.name}`,
        file: file, // keep the file for submission
        src: URL.createObjectURL(file),
        isNew: true,
      }));
      setImages((prev) => [...prev, ...newImgs]);
    }
  };

  async function prepareImagesForUpdate() {
    const imagesForUpload = await Promise.all(
      images.map((img) => {
        if (img.isNew) {
          return img.file;
        } else {
          // Extract the base64 part and convert to blob
          const base64Data = img.src.split(",")[1];
          return convertBase64ToBlob(base64Data, "image/png");
        }
      })
    );
    return imagesForUpload;
  }

  const removeImage = (imageId) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));
  };

  // Handle submission, combining existing and new images in the request
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const formattedStatus = status ? "Active" : "Inactive";

    // Create the product object including existing images
    const product = {
      name,
      sku,
      familyId: family,
      subFamilyId: subFamily,
      width,
      height,
      length,
      materialIds,
      colourIds,
      price,
      discount,
      supplierId: supplier,
      status: formattedStatus
    };

    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    const imagesToUpload = await prepareImagesForUpdate();
    // Append new image files
    imagesToUpload.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 custom-scrollbar">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-800 rounded-2xl w-full max-w-[1500px] mx-4 overflow-hidden shadow-2xl custom-scrollbar"
      >
        {/* Header */}
        <div className=" bg-black  p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? "Update Product" : "Create Product"}
            </h2>
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

        {/* Form Container */}
        <div className="overflow-y-auto max-h-[80vh] p-6 bg-white 0 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-black mb-6 flex items-center">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Product Name */}
                <div className="group w-full">
                  <label className="block text-md font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter product name"
                      className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500
                   hover:border-blue-400"
                    />
                  </div>
                </div>

                {/* SKU */}
                <div className="group w-full">
                  <label className="block text-md font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      required
                      placeholder="Enter SKU"
                      className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500
                   hover:border-blue-400"
                    />
                  </div>
                </div>

                {/* Product Family */}
                <div className="group w-full">
                  <label className="block text-md font-medium text-black mb-2">
                    Product Family <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={family}
                    onChange={(e) => setFamily(e.target.value)}
                    required
                    className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500
                   hover:border-blue-400"
                  >
                    <option value="">Select a family</option>
                    {families.map((f) => (
                      <option
                        key={f.familyId}
                        value={f.familyId}
                        className="text-white bg-black"
                      >
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SubFamily Dropdown - Only shows when family is selected */}
                {family && (
                  <div className="group w-full">
                    <label className="block text-md font-medium text-black mb-2">
                      Sub Family <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={subFamily}
                      onChange={(e) => setSubFamily(e.target.value)}
                      required
                      className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500
                   hover:border-blue-400"
                    >
                      <option value="">Select a subfamily</option>
                      {subFamilies.map((sf) => (
                        <option
                          key={sf.subFamilyId}
                          value={sf.subFamilyId}
                          className="text-white bg-black"
                        >
                          {sf.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Dimensions Section */}
            <div>
              <h3 className="text-xl font-semibold text-black mb-6 flex items-center">
                Dimensions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Width */}
                <div className="group w-full">
                  <label className="block text-md font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Width (cm) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="width"
                      name="width"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      type="number"
                      required
                      placeholder="Enter width"
                      className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500
                   hover:border-blue-400"
                    />
                  </div>
                </div>

                {/* Height */}
                <div className="group w-full">
                  <label className="block text-md font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Height (cm) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="height"
                      name="height"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      type="number"
                      required
                      placeholder="Enter height"
                      className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500
                   hover:border-blue-400"
                    />
                  </div>
                </div>

                {/* Length */}
                <div className="group w-full">
                  <label className="block text-md font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Length (cm) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="length"
                      name="length"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      type="number"
                      required
                      placeholder="Enter length"
                      className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500
                   hover:border-blue-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Materials & Colors Section */}
            <div>
              <h3 className="text-xl font-semibold text-black mb-6 flex items-center">
                Materials & Colors
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Primary Material */}
                <div className="group w-full">
                  <label className="block text-md font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Primary Material <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="material"
                      name="material"
                      value={materialIds[0] || ""}
                      onChange={handleMaterialChange}
                      required
                      className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500
                   hover:border-blue-400"
                    >
                      <option value="">Select a material</option>
                      {materials &&
                        materials.map((option) => (
                          <option
                            key={option.materialId}
                            value={option.materialId}
                          >
                            {option.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Primary Color */}
                <div className="group w-full">
                  <label className="block text-md font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Primary Color <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="colour"
                      name="colour"
                      value={colourIds[0] || ""}
                      onChange={handleColourChange}
                      required
                      className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500
                   hover:border-blue-400"
                    >
                      <option value="">Select a Colour</option>
                      {colours &&
                        colours.map((option) => (
                          <option key={option.colourId} value={option.colourId}>
                            {option.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-black mb-6 flex items-center">
                Pricing Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price */}
                <div className="group w-full">
                  <label className="block text-md font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="price"
                      name="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      type="number"
                      required
                      placeholder="Enter price"
                      className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500
                   hover:border-blue-400"
                    />
                  </div>
                </div>

                {/* Discount */}
                <div className="group w-full">
                  <label className="block text-md font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Discount (%) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="discount"
                      name="discount"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      type="number"
                      placeholder="Enter discount"
                      className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500
                   hover:border-blue-400"
                    />
                  </div>
                </div>

                {/* Supplier */}
                <div className="group w-full">
                  <label className="block text-md font-medium text-black mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Supplier <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="supplier"
                      name="supplier"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      required
                      className="w-full px-4 py-3 text-xl  border border-black rounded-xl text-black placeholder-black
                   transition-all duration-300 ease-in-out
                    focus:border-blue-500
                   hover:border-blue-400"
                    >
                      <option value="">Select a Supplier</option>
                      {suppliers.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="flex items-start space-x-6">
              {/* Left Column: Preview Images and Upload Button */}
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap gap-4 justify-center">
                  {images.map((img, index) => (
                    <div
                      key={img.id !== undefined ? img.id : index}
                      className="relative flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden border"
                    >
                      <img
                        src={img.src}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center">
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-black text-white rounded-xl transition-colors"
                  >
                    Upload Image
                  </motion.button>
                </div>
              </div>

              {/* Right Column: Status */}
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Status
                </h3>
                <div className="flex gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="status"
                      name="status"
                      checked={status}
                      onChange={(e) => setStatus(e.target.checked)}
                      className="h-6 w-6 border rounded focus:ring-blue-500/20"
                    />
                    <label htmlFor="status" className="ml-2 text-lg text-black">
                      Active
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                type="button"
                className="px-6 py-2 bg-black/30 text-xl rounded-xl transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-2 bg-black text-xl text-white rounded-xl transition-colors"
              >
                {isEditing ? "Update Product" : "Add Product"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddProductModal;
