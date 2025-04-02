import React, { useState } from "react";
import {
  AlertTriangle,
  UserX,
  X,
  Trash2,
  Palette,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const DeleteColourModal = ({ isOpen, onClose, onConfirm, colourToDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to delete colour."
      );
      toast.error(
        err.response?.data?.message || err.message || "Failed to delete colour."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3 }}
        className="bg-background rounded-xl w-full max-w-lg p-6 relative shadow-2xl mx-4"
      >
        <div className="absolute inset-0 bg-background rounded-xl backdrop-blur-sm -z-10" />

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
          <p className="text-black text-lg">
            Are you sure you want to delete this colour? This action cannot be
            undone.
          </p>
        </div>

        {/* Colour Details */}
        {colourToDelete && (
          <div className="bg-white p-6 rounded-xl mb-8 border border-slate-600">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-600">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-black  flex items-center justify-center border-2 border-red-500/20">
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{ backgroundColor: colourToDelete.code }}
                  ></div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-xl text-black">
                  {colourToDelete.name}
                </h4>
                <span className="text-sm text-black">
                  ID: {colourToDelete.colourId}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-black">
                <Palette size={18} className="text-black" />
                <span>{colourToDelete.code}</span>
              </div>
             
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 px-6 bg-black py-3 border border-slate-600 rounded-lg text-slate-300 
                     hover:bg-slate-700 hover:border-slate-500 transition-all duration-200 font-medium"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg
                     hover:from-red-700 hover:to-red-600 transition-all duration-200 font-medium
                     shadow-lg shadow-red-500/10 hover:shadow-red-500/20 flex items-center justify-center gap-2"
          >
            <Trash2 size={20} />
            {loading ? "Deleting..." : "Delete Colour"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteColourModal;