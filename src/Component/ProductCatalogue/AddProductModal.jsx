import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { getAllColours } from "../../ApiService/ColorService/ColorApiService";
import { getAllMaterials } from "../../ApiService/MaterialService/MaterialApiService";
import { getAllFurnitureFamilies } from "../../ApiService/FurnitureFamily/FurnitureFamilyApiServices";
import { getAllSuppliers } from "../../ApiService/SupplierService/SupplierApiService";
import {getSubFamilyByFamilyId} from "../../ApiService/SubFamily/SubFamilyApiService"
const AddProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  productData,
}) => {
  const fileInputRef = useRef(null);
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
  const [images, setImages] = useState([]); // Change from 'image' to 'images'
  const [imagePreviews, setImagePreviews] = useState([]); // Change for multiple previews
  const [colours, setColours] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subFamilies, setSubFamilies] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

const handleMaterialChange = (e) => {
  const selectedMaterial = e.target.value;
  setMaterialIds(selectedMaterial ? [selectedMaterial] : []); // Store as array
};

const handleColourChange = (e) => {
  const selectedColour = e.target.value;
  setColourIds(selectedColour ? [selectedColour] : []); // Store as array
};



  const fetchColours = async () => {
    try {
      const response = await getAllColours();
      console.log(response,"==C==")
      setColours(response.data);
    } catch (error) {
      console.error("Error fetching colours:", error);
    }
  };

  const fetchMaterial = async () => {
    try {
      const res = await getAllMaterials();
      console.log(res,"-=-=-M=--")
      setMaterials(res.content);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const fetchFamily = async () => {
    try {
      const res = await getAllFurnitureFamilies();
      console.log(res,"===family==========")
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
      console.log(response, "===========sub family============");
      setSubFamilies(response);
    } catch (error) {
      console.error("Error fetching subfamilies:", error);
    }
  };
  useEffect(() => {
    if (family) {
      fetchSubFamilies(family);
    } else {
      setSubFamilies([]);
      setSubFamily("");
    }
  }, [family]);

  useEffect(() => {
    fetchColours();
    fetchMaterial();
    fetchFamily();
    fetchSuppliers();
  }, []);

 useEffect(() => {
   if (isEditing && productData) {
     setName(productData.name || "");
     setSku(productData.sku || "");
     setFamily(productData.familyId || "");
     setSubFamily(productData.subFamilyId || "");
     setWidth(productData.width || "");
     setHeight(productData.height || "");
     setLength(productData.length || "");
     setMaterialIds(productData.materials.map((m) => m.materialId) || []);
     setColourIds(productData.colours.map((c) => c.colourId) || []);
     setPrice(productData.price || "");
     setDiscount(productData.discount || "");
     setSupplier(productData.supplierId || "");
     setStatus(productData.status === "Active" ? true : false);

     if (productData.allImages) {
       setImagePreviews(
         productData.allImages.map((img) => `data:image/png;base64,${img}`)
       );
     }
   }
 }, [isEditing, productData]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  // const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     const formData = new FormData();

  //     // Append all product fields directly
  //     formData.append("name", name);
  //     formData.append("sku", sku);
  //     formData.append("familyId", family);
  //     formData.append("subFamilyId", subFamily);
  //     formData.append("width", width);
  //     formData.append("height", height);
  //     formData.append("length", length);
  //     formData.append("materialId", material);
  //     formData.append("colourId", colour);
  //     formData.append("price", price);
  //     formData.append("discount", discount);
  //     formData.append("supplierId", supplier);
  //     formData.append("status", status);

  //     // Append multiple images
  //     if (images) {
  //       if (Array.isArray(images)) {
  //         images.forEach((img) => formData.append("images", img));
  //       } else {
  //         formData.append("images", images);
  //       }
  //     }

  //     try {
  //       await onSubmit(formData);
  //       onClose();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Convert boolean status to string (adjust values based on your enum)
    const formattedStatus = status ? "Active" : "Inactive"; // Match backend enum format

    // Create the product object
    const product = {
      name,
      sku,
      familyId: family,
      subFamilyId: subFamily,
      width,
      height,
      length,
      materialIds: materialIds, // Already an array
      colourIds: colourIds, // Already an array
      price,
      discount,
      supplierId: supplier,
      status: formattedStatus, // Send as a string
    };

    // Convert product object to JSON and append it properly
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    // Append multiple images
    if (images && images.length > 0) {
      images.forEach((img) => {
        formData.append("images", img);
      });
    }

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
        className="bg-slate-800 rounded-2xl w-full max-w-6xl mx-4 overflow-hidden shadow-2xl custom-scrollbar"
      >
        {/* Header */}
        <div className="bg-slate-900 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? "Update Product" : "Create Product"}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </motion.button>
          </div>
        </div>

        {/* Form Container */}
        <div className="overflow-y-auto max-h-[80vh] p-6 bg-slate-800 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Product Name */}
                <div className="group w-full">
                  <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
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
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400
                                 transition-all duration-300 ease-in-out
                                 focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                                 hover:border-blue-400"
                    />
                  </div>
                </div>

                {/* SKU */}
                <div className="group w-full">
                  <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
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
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400
                                 transition-all duration-300 ease-in-out
                                 focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                                 hover:border-blue-400"
                    />
                  </div>
                </div>

                {/* Product Family */}
                <div className="group w-full">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Product Family <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={family}
                    onChange={(e) => setFamily(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white"
                  >
                    <option value="">Select a family</option>
                    {families.map((f) => (
                      <option key={f.familyId} value={f.familyId}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SubFamily Dropdown - Only shows when family is selected */}
                {family && (
                  <div className="group w-full">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Sub Family <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={subFamily}
                      onChange={(e) => setSubFamily(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white"
                    >
                      <option value="">Select a subfamily</option>
                      {subFamilies.map((sf) => (
                        <option key={sf.subFamilyId} value={sf.subFamilyId}>
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
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                Dimensions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Width */}
                <div className="group w-full">
                  <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
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
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400
                                 transition-all duration-300 ease-in-out
                                 focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                                 hover:border-blue-400"
                    />
                  </div>
                </div>

                {/* Height */}
                <div className="group w-full">
                  <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
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
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400
                                 transition-all duration-300 ease-in-out
                                 focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                                 hover:border-blue-400"
                    />
                  </div>
                </div>

                {/* Length */}
                <div className="group w-full">
                  <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
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
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400
                                 transition-all duration-300 ease-in-out
                                 focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                                 hover:border-blue-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Materials & Colors Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                Materials & Colors
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Primary Material */}
                <div className="group w-full">
                  <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Primary Material <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="material"
                      name="material"
                      value={materialIds[0] || ""}
                      onChange={handleMaterialChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white
             transition-all duration-300 ease-in-out
             focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
             hover:border-blue-400"
                    >
                      <option value="">Select a material</option>
                      {materials && materials.map((option) => (
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
                  <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Primary Color <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="colour"
                      name="colour"
                      value={colourIds[0] || ""}
                      onChange={handleColourChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white
             transition-all duration-300 ease-in-out
             focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
             hover:border-blue-400"
                    >
                      <option value="">Select a Colour</option>
                      {colours && colours.map((option) => (
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
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                Pricing Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price */}
                <div className="group w-full">
                  <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
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
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400
                                 transition-all duration-300 ease-in-out
                                 focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                                 hover:border-blue-400"
                    />
                  </div>
                </div>

                {/* Discount */}
                <div className="group w-full">
                  <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
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
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400
                                 transition-all duration-300 ease-in-out
                                 focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                                 hover:border-blue-400"
                    />
                  </div>
                </div>

                {/* Supplier */}
                <div className="group w-full">
                  <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    Supplier <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="supplier"
                      name="supplier"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white
                                 transition-all duration-300 ease-in-out
                                 focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
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
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                Product Image
              </h3>
              <div className="flex items-center space-x-6">
                <div className="flex flex-wrap gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-32 h-32 bg-slate-700 rounded-xl overflow-hidden"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <input
                    type="file"
                    multiple // Allow multiple files
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
                    className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Upload Image
                  </motion.button>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-end">
                    Status
                  </h3>
                  <div className="flex gap-6">
                    <div className="flex items-center group">
                      <input
                        type="checkbox"
                        id="status"
                        name="status"
                        checked={status}
                        onChange={(e) => setStatus(e.target.checked)}
                        className="h-4 w-4 text-blue-500 bg-slate-700 border-slate-500 rounded focus:ring-blue-500/20"
                      />
                      <label
                        htmlFor="status"
                        className="ml-2 block text-sm text-slate-300 group-hover:text-blue-400 transition-colors duration-200"
                      >
                        Active
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Section */}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-slate-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                type="button"
                className="px-6 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
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

// import React, { useState, useEffect, useRef } from "react";
// import { X } from "lucide-react";
// import { motion } from "framer-motion";
// import { getAllColours } from "../../ApiService/ColorService/ColorApiService";
// import { getAllMaterials } from "../../ApiService/MaterialService/MaterialApiService";
// import {getAllFurnitureFamilies} from "../../ApiService/FurnitureFamily/FurnitureFamilyApiServices"
// import { getAllSuppliers } from "../../ApiService/SupplierService/SupplierApiService";

// const AddProductModal = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   isEditing,
//   productData,
// }) => {
//   const fileInputRef = useRef(null);
//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     sku: "",
//     family: "",
//     subFamily: "",
//     image: null,
//     width: "",
//     height: "",
//     length: "",
//     material1: "",
//     material2: "",
//     material3: "",
//     material4: "",
//     colour1: "",
//     colour2: "",
//     colour3: "",
//     price: "",
//     discount: "",
//     supplier: "",
//     status: true,
//   });

//   const [imagePreview, setImagePreview] = useState(null);
//   const [colours , setColours] = useState([])
//   const [material,setMaterial] = useState([])
//   const [families,setFamilies] = useState([])
//   const [suppliers, setSuppliers] = useState([])

//   const fetchColours = async() =>{
//     const response = await getAllColours()
//     setColours(response.data)
//   }
//   const fetchMaterial = async() =>{
//     const res = await getAllMaterials()
//     setMaterial(res.content)
//   }
//   const fetchFamily = async() =>{
//     const res = await getAllFurnitureFamilies();

//     setFamilies(res)
//   }

//   const fetchSuppliers = async() =>{
//     const data = await getAllSuppliers();

//     setSuppliers(data.data)
//   }

//   useEffect(()=>{
//     fetchColours()
//     fetchMaterial()
//     fetchFamily()
//     fetchSuppliers()
//   },[])

//   useEffect(() => {
//     if (isEditing && productData) {
//       setNewProduct({
//         ...productData,
//         status: productData.status ?? true,
//       });
//       if (productData.image) {
//         setImagePreview(productData.image);
//       }
//     }
//   }, [isEditing, productData]);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setNewProduct((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewProduct((prev) => ({
//         ...prev,
//         image: file,
//       }));
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await onSubmit(newProduct);
//       onClose();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 custom-scrollbar">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.95 }}
//         className="bg-slate-800 rounded-2xl w-full max-w-6xl mx-4 overflow-hidden shadow-2xl custom-scrollbar"
//       >
//         {/* Header */}
//         <div className="bg-slate-900 p-6">
//           <div className="flex justify-between items-center">
//             <h2 className="text-2xl font-bold text-white">
//               {isEditing ? "Update Product" : "Create Product"}
//             </h2>
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={onClose}
//               className="text-slate-400 hover:text-white p-2 rounded-full transition-colors"
//             >
//               <X size={24} />
//             </motion.button>
//           </div>
//         </div>

//         {/* Form Container */}
//         <div className="overflow-y-auto max-h-[80vh] p-6 bg-slate-800 custom-scrollbar">
//           <form onSubmit={handleSubmit} className="space-y-8">
//             {/* Basic Information Section */}
//             <div>
//               <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
//                 Basic Information
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div className="group w-full">
//                   <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
//                     Product Name
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       id="name"
//                       name="name"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       required
//                       placeholder="Enter product name"
//                       className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400
//                      transition-all duration-300 ease-in-out
//                      focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
//                      hover:border-blue-400"
//                     />
//                   </div>
//                 </div>

//                 <div className="group w-full">
//                   <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
//                     SKU
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       id="sku"
//                       name="sku"
//                       value={newProduct.sku}
//                       onChange={handleInputChange}
//                       required
//                       placeholder="Enter SKU"
//                       className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400
//                      transition-all duration-300 ease-in-out
//                      focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
//                      hover:border-blue-400"
//                     />
//                   </div>
//                 </div>

//                 <div className="group w-full">
//                   <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
//                     Product Family
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <select
//                       id="family"
//                       type
//                       name="family"
//                       value={newProduct.family}
//                       onChange={handleInputChange}
//                       options={families}
//                       required
//                       className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white
//                      transition-all duration-300 ease-in-out
//                      focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
//                      hover:border-blue-400"
//                     >
//                       <option value="" className="text-gray-300">
//                         Select a family
//                       </option>
//                       {families.map((option) => (
//                         <option key={option.familyId} value={option.familyId}>
//                           {option.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 {newProduct.family && (
//                   <div className="group w-full">
//                     <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
//                       Sub Family
//                       <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <select
//                         id="subFamily"
//                         name="subFamily"
//                         value={newProduct.subFamily}
//                         onChange={handleInputChange}
//                         options={subFamilies[newProduct.family] || []}
//                         required
//                         className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white
//                      transition-all duration-300 ease-in-out
//                      focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
//                      hover:border-blue-400"
//                       >
//                         <option value="">Select a Subfamily</option>
//                         {options.map((option) => (
//                           <option key={option} value={option}>
//                             {option}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Dimensions Section */}
//             <div>
//               <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
//                 Dimensions
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div className="group w-full">
//                   <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
//                     Width (cm)
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       id="width"
//                       name="width"
//                       value={newProduct.width}
//                       onChange={handleInputChange}
//                       type="number"
//                       required
//                       placeholder="Enter width"
//                       className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400
//                      transition-all duration-300 ease-in-out
//                      focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
//                      hover:border-blue-400"
//                     />
//                   </div>
//                 </div>

//                 <div className="group w-full">
//                   <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
//                     Height (cm)
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       id="height"
//                       name="height"
//                       value={newProduct.height}
//                       onChange={handleInputChange}
//                       type="number"
//                       required
//                       placeholder="Enter height"
//                       className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400
//                      transition-all duration-300 ease-in-out
//                      focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
//                      hover:border-blue-400"
//                     />
//                   </div>
//                 </div>

//                 <div className="group w-full">
//                   <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
//                     Length (cm)
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       id="length"
//                       name="length"
//                       value={newProduct.length}
//                       onChange={handleInputChange}
//                       type="number"
//                       required
//                       placeholder="Enter length"
//                       className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400
//                      transition-all duration-300 ease-in-out
//                      focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
//                      hover:border-blue-400"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Materials Section */}
//             <div>
//               <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
//                 Materials & Colors
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div className="group w-full">
//                   <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
//                     Primary Material
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <select
//                       id="material1"
//                       name="material1"
//                       value={newProduct.material1}
//                       onChange={handleInputChange}
//                       options={material}
//                       required
//                       className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white
//                      transition-all duration-300 ease-in-out
//                      focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
//                      hover:border-blue-400"
//                     >
//                       <option value="">Select a material</option>
//                       {material.map((option) => (
//                         <option
//                           key={option.materialId}
//                           value={option.materialId}
//                         >
//                           {option.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="group w-full">
//                   <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
//                     Primary Color
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <select
//                       id="colour1"
//                       name="colour1"
//                       value={newProduct.colour1}
//                       onChange={handleInputChange}
//                       options={colours}
//                       required
//                       className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white
//                      transition-all duration-300 ease-in-out
//                      focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
//                      hover:border-blue-400"
//                     >
//                       <option value="">Select a Colour</option>
//                       {colours.map((option) => (
//                         <option key={option.colourId} value={option.colourId}>
//                           {option.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Pricing Section */}
//             <div>
//               <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
//                 Pricing Information
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div className="group w-full">
//                   <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
//                     Price
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       id="price"
//                       name="price"
//                       value={newProduct.price}
//                       onChange={handleInputChange}
//                       type="number"
//                       required
//                       placeholder="Enter price"
//                       className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400
//                      transition-all duration-300 ease-in-out
//                      focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
//                      hover:border-blue-400"
//                     />
//                   </div>
//                 </div>

//                 <div className="group w-full">
//                   <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
//                     Discount (%)
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       id="discount"
//                       name="discount"
//                       value={newProduct.discount}
//                       onChange={handleInputChange}
//                       type="number"
//                       placeholder="Enter discount"
//                       className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400
//                      transition-all duration-300 ease-in-out
//                      focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
//                      hover:border-blue-400"
//                     />
//                   </div>
//                 </div>

//                 <div className="group w-full">
//                   <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
//                     Supplier
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <select
//                       id="supplier"
//                       name="supplier"
//                       value={newProduct.supplier}
//                       onChange={handleInputChange}
//                       required
//                       options={suppliers}

//                       className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white
//                      transition-all duration-300 ease-in-out
//                      focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
//                      hover:border-blue-400"
//                     >
//                       <option value="">Select a Supplier</option>
//                       {suppliers.map((option) => (
//                         <option
//                           key={option.id}
//                           value={option.id}
//                         >

//                           {option.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Image Upload Section */}
//             <div>
//               <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
//                 Product Image
//               </h3>
//               <div className="flex items-center space-x-6">
//                 <div className="flex-shrink-0 w-32 h-32 bg-slate-700 rounded-xl overflow-hidden">
//                   {imagePreview ? (
//                     <img
//                       src={imagePreview}
//                       alt="Product preview"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center text-slate-400">
//                       No image
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleImageChange}
//                     accept="image/*"
//                     className="hidden"
//                     multiple
//                   />
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     type="button"
//                     onClick={() => fileInputRef.current?.click()}
//                     className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
//                   >
//                     Upload Image
//                   </motion.button>
//                 </div>
//               </div>
//             </div>

//             {/* Status Section */}
//             <div>
//               <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
//                 Status
//               </h3>
//               <div className="flex gap-6">
//                 <div className="flex items-center group">
//                   <input
//                     type="checkbox"
//                     id="status"
//                     name="status"
//                     checked={newProduct.status}
//                     onChange={handleInputChange}
//                     className="h-4 w-4 text-blue-500 bg-slate-700 border-slate-500 rounded focus:ring-blue-500/20"
//                   />
//                   <label
//                     htmlFor="status"
//                     className="ml-2 block text-sm text-slate-300 group-hover:text-blue-400 transition-colors duration-200"
//                   >
//                     Active
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end gap-4 pt-6 border-t border-slate-700">
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={onClose}
//                 type="button"
//                 className="px-6 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
//               >
//                 Cancel
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 type="submit"
//                 className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
//               >
//                 {isEditing ? "Update Product" : "Add Product"}
//               </motion.button>
//             </div>
//           </form>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default AddProductModal;
