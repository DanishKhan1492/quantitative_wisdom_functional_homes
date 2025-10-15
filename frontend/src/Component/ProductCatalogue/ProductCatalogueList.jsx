import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  
  Eye,
  Edit,
  Trash2,
  Download,
  Package,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Unlock,
  Lock,
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
  patchProduct,
  downloadProductsExcel
} from "../../ApiService/ProductCatalog/ProductCatalogApiServices";
import AddProductModal from "./AddProductModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import Loading from "../Loading/Lodder";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [pageNumber, size, searchName, searchSku]);

  const fetchProducts = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
            product.productId === editingProduct.productId
              ? updatedProduct
              : product
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

  const handleViewClick = async (product, navigate) => {
    try {
      const productDetails = await getProductById(product.productId);
      navigate(`/product-details/${product.productId}`, {
        state: productDetails,
      });
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
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
  if (pageNumber < totalPages - 1) {
    // Corrected condition
    setPageNumber(pageNumber + 1);
  }
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



  const handleStatusToggle = async (productId) => {
    try {
      const productstatus = products.find((pro) => pro.productId === productId);
      if (productstatus) {
        // Convert string status to boolean, toggle it, then convert back to string
        const currentStatus = productstatus.status === "Active";
        const newStatus = !currentStatus;
        const statusString = newStatus ? "Active" : "Inactive";

        // Pass status as parameter for query string
        await patchProduct(productId, statusString);

        toast.success("Product status updated");
        fetchProducts(); // You might want to rename this to fetchProducts for clarity
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Error updating product status");
    }
  };


    const handleExcelDownload = async () => {
       try {
         const excelData = await downloadProductsExcel();
         const url = URL.createObjectURL(excelData);
         const link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", "products.xlsx");
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
       } catch (error) {
         console.error("Error downloading the Excel file:", error);
       }
     };

  return (
    <div className="p-4 md:p-6 bg-background min-h-screen">
      {/* Header & Controls */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-2xl font-bold text-black flex items-center mb-4 sm:mb-0">
            <Package className="mr-2 text-black" size={24} />
            Product List
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            {/* Search by Name */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-[#D6D3CF] rounded-xl text-[#262525] placeholder-[#262525]/50 focus:outline-none focus:ring-2 focus:ring-[#262525]/30"
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
                className="w-full pl-10 pr-4 py-2 bg-white border border-[#D6D3CF] rounded-xl text-[#262525] placeholder-[#262525]/50 focus:outline-none focus:ring-2 focus:ring-[#262525]/30"
              />
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
            </div>
            {/* Download Dropdown */}
           <motion.button
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           className="flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-colors"
                           onClick={handleExcelDownload}
                         >
                           <Download className="w-5 h-5 mr-2" />
                           Export
                         </motion.button>
            {/* Add Product Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={20} />
              <span>Add New Product</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden ">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-[#D6D3CF] bg-tbhead">
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  <div className="flex items-center space-x-1 hover:text-blue-400 transition-colors cursor-pointer">
                    <span>Product Name</span>
                    <ChevronDown size={16} />
                  </div>
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  SKU
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Family
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Sub Family
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Price
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Status
                </th>
                <th className="p-4 text-left text-black font-semibold first:rounded-tl-xl">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7">
                    <div className="h-64 w-full flex items-center justify-center">
                      <Loading />
                    </div>
                  </td>
                </tr>
              ) : products && products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product.productId}
                    className="border-b border-slate-700 hover:bg-black/10 transition-colors"
                  >
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {product.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {product.sku}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {product.familyName}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-black font-medium">
                        {product.subFamilyName}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-black font-medium">
                        AED {parseFloat(product.price).toFixed(2)}
                      </div>
                    </td>

                    <td className="p-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleStatusToggle(product.productId)}
                        className={`px-3 py-1 rounded-full flex items-center gap-2 ${
                          product.status === "Active"
                            ? "bg-blue-500/20 text-black"
                            : "bg-slate-600/20 text-black"
                        }`}
                      >
                        {product.status === "Active" ? (
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
                    {/* <td className="p-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleStatusToggle(product.productId)}
                        className={`px-3 py-1 rounded-full flex items-center gap-2 ${
                          product.status === "Active"
                            ? "bg-blue-500/20 text-black"
                            : "bg-slate-600/20 text-black"
                        }`}
                      >
                        {product.status === "Active" ? (
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
                    </td> */}

                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-800"
                          onClick={() => handleViewClick(product, navigate)}
                        >
                          <Eye size={28} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-emerald-800"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit size={28} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-800"
                          onClick={() => handleDeleteClick(product)}
                        >
                          <Trash2 size={28} />
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

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-slate-400">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-0">
          {/* Styled "Showing records" display */}
          <span className="text-sm bg-gradient-to-r bg-black border-2  text-white px-4 py-2 rounded-full shadow-md">
            Showing {startItem} to {endItem} of {totalElements} entries
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
            onClick={handlePreviousPage}
            disabled={pageNumber === 0} // Corrected disabled condition
            className="px-4 py-2 bg-black text-white rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-black transition-all hover:bg-slate-600 flex items-center"
          >
            <ChevronLeft size={18} className="mr-1" />
            Previous
          </button>
          <div className="flex gap-2">{renderPageNumbers()}</div>
          <button
            onClick={handleNextPage}
            disabled={pageNumber === totalPages - 1} // Corrected disabled condition
            className="px-4 py-2 bg-black border-2 border-black text-white rounded-xl hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all flex items-center"
          >
            Next
            <ChevronRight size={18} className="ml-1" />
          </button>
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
        productToDelete={products.find(
          (product) => product.productId === productToDelete?.productId
        )}
      />
    </div>
  );
};

export default ProductCatalogueList;
