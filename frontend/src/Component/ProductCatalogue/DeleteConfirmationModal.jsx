import React, { useState } from "react";
import {
  AlertTriangle,
  UserX,
  X,
  Trash2,
  Package,
} from "lucide-react";
import { toast } from "react-toastify";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, productToDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to delete product."
      );
      toast.error(
        err.response?.data?.message || err.message || "Failed to delete product."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl w-full max-w-lg p-6 relative shadow-2xl mx-4">
        <div className="absolute inset-0 bg-slate-800/40 rounded-xl backdrop-blur-sm -z-10" />
        
        {/* Alert Icon */}
        <div className="flex justify-center mb-6 relative">
          <div className="bg-red-900/20 p-4 rounded-full relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping opacity-25" />
            <AlertTriangle size={48} className="text-red-500 animate-pulse" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
            Confirm Deletion
          </h3>
          <p className="text-slate-400 text-lg">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
        </div>

        {/* Product Details */}
        {productToDelete && (
          <div className="bg-gradient-to-r from-slate-700 to-slate-700/50 p-6 rounded-xl mb-8 border border-slate-600">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-600">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-slate-600 flex items-center justify-center border-2 border-red-500/20">
                  <Package size={28} className="text-slate-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-red-900/30 p-1.5 rounded-full border-2 border-slate-700">
                  <UserX size={14} className="text-red-400" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-xl text-slate-200">
                  {productToDelete?.name}
                </h4>
                <span className="text-sm text-slate-400">
                  ID: {productToDelete?.id}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-300">
                <Package size={18} className="text-slate-400" />
                <span>{productToDelete?.type}</span>
              </div>
              {productToDelete?.description && (
                <div className="text-slate-400 text-sm mt-2">
                  {productToDelete.description}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-slate-600 rounded-lg text-slate-300 
                     hover:bg-slate-700 hover:border-slate-500 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg
                     hover:from-red-700 hover:to-red-600 transition-all duration-200 font-medium
                     shadow-lg shadow-red-500/10 hover:shadow-red-500/20 flex items-center justify-center gap-2"
          >
            <Trash2 size={20} />
            {loading ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;