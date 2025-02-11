import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Download,
  Package,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} from "../../ApiService/ProductCatalog/ProductCatalogApiServices";
import AddProductModal from "./AddProductModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const ProductCatalogueList = () => {
  // Modal and editing states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);

  // Data state
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Pagination and search/filter states
  const [pageNumber, setPageNumber] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [searchSku, setSearchSku] = useState("");

  // Fetch products when pagination or search parameters change
  useEffect(() => {
    fetchProducts();
  }, [pageNumber, size, searchName, searchSku]);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts(
        pageNumber,
        size,
        searchName,
        searchSku
      );
      
      setProducts(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products.");
    }
  };

  const handleCreateOrUpdateProduct = async (formData) => {
    try {
      if (editingProduct) {
        const updatedProduct = await updateProduct(
          editingProduct.productId,
          formData
        );
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === editingProduct.id ? updatedProduct : product
          )
        );
        setEditingProduct(null);
      } else {
        await createProduct(formData);
        // Re-fetch the products to update pagination and the list
        fetchProducts();
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating/updating product:", error);
      toast.error("Failed to save product.");
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.productId);
        // Re-fetch products after deletion
        fetchProducts();
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product.");
      }
    }
  };

  const handleEditClick = async (product) => {
    try {
      const detailedProduct = await getProductById(product.productId);
      setEditingProduct(detailedProduct);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
      // Fallback to using the provided product data
      setEditingProduct(product);
      setIsModalOpen(true);
    }
  };

  const handleViewClick = (product) => {
    navigate("/product-details", { state: product });
  };

  const handleExcelDownload = () => {
    setIsDownloadDropdownOpen(false);
    alert("Excel download functionality not implemented.");
  };

  const handleCSVDownload = () => {
    setIsDownloadDropdownOpen(false);
    const csvContent = [
      [
        "Date",
        "Name",
        "SKU",
        "Family",
        "Sub Family",
        "Price",
        "Supplier",
        "Status",
      ],
      ...products.map((product) => [
        product.date,
        product.name,
        product.sku,
        product.familyName,
        product.subFamilyName,
        product.price,
        product.supplierName,
        product.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination calculations
  const startItem = pageNumber * size + 1;
  const endItem = Math.min((pageNumber + 1) * size, totalElements);

  const handlePreviousPage = () => {
    if (pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber + 1 < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  return (
    <div className="p-6 bg-slate-900">
      {/* Header & Controls */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Package className="mr-2 text-blue-400" size={24} />
            Product List
          </h1>
          <div className="flex items-center gap-4">
            {/* Search by Name */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
            </div>
            {/* Search by SKU */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by SKU"
                value={searchSku}
                onChange={(e) => setSearchSku(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
            </div>

            {/* Download Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setIsDownloadDropdownOpen(!isDownloadDropdownOpen)
                }
                className="flex items-center bg-slate-700 text-white px-4 py-2 rounded-xl hover:bg-slate-600 transition-colors duration-300 space-x-2"
              >
                <Download size={20} />
                <span>Download</span>
                <ChevronDown size={16} />
              </motion.button>
              <AnimatePresence>
                {isDownloadDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-slate-800 ring-1 ring-slate-700 z-50"
                  >
                    <div className="py-1">
                      <button
                        onClick={handleExcelDownload}
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 w-full text-left transition-colors duration-150"
                      >
                        Download Excel
                      </button>
                      <button
                        onClick={handleCSVDownload}
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 w-full text-left transition-colors duration-150"
                      >
                        Download CSV
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Add Product Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={20} />
              <span>Add New Product</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900/50 text-left">
                <th className="p-4 font-semibold text-slate-300">
                  <div className="flex items-center space-x-1 hover:text-blue-400 transition-colors cursor-pointer">
                    <span>Product Name</span>
                    <ChevronDown size={16} />
                  </div>
                </th>
                <th className="p-4 font-semibold text-slate-300">SKU</th>
                <th className="p-4 font-semibold text-slate-300">Family</th>
                <th className="p-4 font-semibold text-slate-300">Sub Family</th>
                <th className="p-4 font-semibold text-slate-300">Price</th>
                <th className="p-4 font-semibold text-slate-300">Status</th>
                <th className="p-4 font-semibold text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product.productId}
                    className="border-t border-slate-700 hover:bg-slate-700/30 transition-colors duration-150"
                  >
                    <td className="p-4 text-slate-300">{product.name}</td>
                    <td className="p-4 text-slate-300">{product.sku}</td>
                    <td className="p-4 text-slate-300">{product.familyName}</td>
                    <td className="p-4 text-slate-300">
                      {product.subFamilyName}
                    </td>
                    <td className="p-4 text-slate-300">
                      AED {parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="p-4 text-slate-300">{product.status}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-400"
                          onClick={() => handleViewClick(product)}
                        >
                          <Eye size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-emerald-400"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-400"
                          onClick={() => handleDeleteClick(product)}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-between items-center">
        <span className="text-slate-400 text-sm">
          Showing {startItem} to {endItem} of {totalElements} entries
        </span>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreviousPage}
            disabled={pageNumber === 0}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg"
          >
            Previous
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextPage}
            disabled={pageNumber + 1 >= totalPages}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg"
          >
            Next
          </motion.button>
        </div>
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleCreateOrUpdateProduct}
        isEditing={!!editingProduct}
        productData={editingProduct}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ProductCatalogueList;
