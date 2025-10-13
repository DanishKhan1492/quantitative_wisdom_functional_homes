
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { getAllApartmentTypes } from "../../ApiService/AppartmentType/AppartmentTypeApiService";
import { getAllFurnitureFamilies } from "../../ApiService/FurnitureFamily/FurnitureFamilyApiServices";
import { getSubFamilyByFamilyId } from "../../ApiService/SubFamily/SubFamilyApiService";
import { getAllProductsByFamilyAndSubFamily } from "../../ApiService/ProductCatalog/ProductCatalogApiServices";

const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [apartmentTypes, setApartmentTypes] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subFamilies, setSubFamilies] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedApartmentType, setSelectedApartmentType] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [selectedSubFamily, setSelectedSubFamily] = useState("");
  const [productSearch, setProductSearch] = useState("");

  // Fetch apartment types on mount
  useEffect(() => {
    const fetchApartmentTypes = async () => {
      try {
        const res = await getAllApartmentTypes();
        setApartmentTypes(res.content);
      } catch (error) {
        console.error("Error fetching apartment types:", error);
      }
    };
    fetchApartmentTypes();
  }, []);

  // Fetch families when an apartment type is selected
  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const res = await getAllFurnitureFamilies();
        setFamilies(res.content);
      } catch (error) {
        console.error("Error fetching families:", error);
      }
    };
    if (selectedApartmentType) {
      fetchFamilies();
    }
  }, [selectedApartmentType]);

  // Fetch subfamilies when a family is selected
  useEffect(() => {
    const fetchSubFamilies = async () => {
      try {
        const res = await getSubFamilyByFamilyId(selectedFamily);
        setSubFamilies(res);
      } catch (error) {
        console.error("Error fetching subfamilies:", error);
      }
    };
    if (selectedFamily) {
      fetchSubFamilies();
    }
  }, [selectedFamily]);

  // Fetch products when subfamily is selected or productSearch changes
  useEffect(() => {
    const fetchProducts = async () => {
      console.log(selectedFamily, selectedSubFamily,"=======================check family======================================")
      try {
        const res = await getAllProductsByFamilyAndSubFamily(selectedFamily, selectedSubFamily); 
        console.log(res,"=======================check products======================================")
        setProducts(res);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    if (selectedSubFamily) {
      fetchProducts();
    }
  }, [selectedSubFamily, productSearch]);

  // When adding a product, include the selected apartmentTypeId in the product object
  const handleAddProductClick = (product) => {
    console.log(product,"--------product===========")
     const productToAdd = {
       productId: product.productId || product.id,
       name: product.name,
       sku: product.sku,
       price: product.price,
       discount: product.discount,
       quantity: 1,
       totalPrice: product.price,
       apartmentTypeId: selectedApartmentType, // This should now be valid.
     };
    onAddProduct(productToAdd);
  //  onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-6xl mx-4 overflow-hidden shadow-2xl"
      >
        <div className="bg-black p-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add Product</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-white p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </motion.button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Apartment Type Dropdown */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Apartment Type
              </label>
              <select
                value={selectedApartmentType}
                onChange={(e) => {
                  setSelectedApartmentType(e.target.value);
                  setSelectedFamily("");
                  setSelectedSubFamily("");
                }}
                className="w-full px-4 py-3 border border-black rounded-xl"
              >
                <option value="">Select Apartment Type</option>
                {apartmentTypes.map((apt) => (
                  <option key={apt.apartmentId} value={apt.apartmentId}>
                    {apt.name}
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
                value={selectedFamily}
                onChange={(e) => {
                  setSelectedFamily(e.target.value);
                  setSelectedSubFamily("");
                }}
                className="w-full px-4 py-3 border border-black rounded-xl"
                disabled={!selectedApartmentType}
              >
                <option value="">Select Family</option>
                {families.map((fam) => (
                  <option key={fam.familyId} value={fam.familyId}>
                    {fam.name}
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
                value={selectedSubFamily}
                onChange={(e) => setSelectedSubFamily(e.target.value)}
                className="w-full px-4 py-3 border border-black rounded-xl"
                disabled={!selectedFamily}
              >
                <option value="">Select SubFamily</option>
                {subFamilies.map((sub) => (
                  <option key={sub.subFamilyId} value={sub.subFamilyId}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-200">
                  <th className="p-2 text-left text-black">Product</th>
                  <th className="p-2 text-left text-black">SKU</th>
                  <th className="p-2 text-left text-black">Price</th>
                  <th className="p-2 text-left text-black">Stock</th>
                  <th className="p-2 text-left text-black">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedSubFamily &&
                  products.map((product) => (
                    <tr key={product.productId} className="border-b">
                      <td className="p-2">{product.name}</td>
                      <td className="p-2">{product.sku}</td>
                      <td className="p-2">AED {product.price}</td>
                      <td className="p-2">{product.stockQuantity}</td>
                      <td className="p-2">
                        <button
                          type="button"
                          onClick={() => handleAddProductClick(product)}
                          className="px-4 py-2 bg-black text-white rounded-xl"
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-4 text-center">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddProductModal;
