import React from "react";
import {
  AlertTriangle,
  X,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, furnitureToDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3 }}
        className="bg-backgorund rounded-xl w-full max-w-lg p-6 relative shadow-2xl mx-4"
      >
        <div className="absolute inset-0 bg-background rounded-xl backdrop-blur-sm -z-10" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-black hover:text-slate-200 transition-colors"
        >
          <X size={24} />
        </button>

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
            Are you sure you want to delete this furniture item?
          </p>
          <p className="text-black text-lg">
            This action cannot be undone.
          </p>
        </div>

        {/* Furniture Details (if provided) */}
        {furnitureToDelete && (
          <div className="bg-white p-6 rounded-xl mb-8 border border-slate-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center border-2 border-red-500/20">
                  <span className="text-2xl font-bold text-slate-300">
                    {furnitureToDelete.name?.charAt(0) || 'F'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-red-900/30 p-1.5 rounded-full border-2 border-slate-700">
                  <X size={14} className="text-red-400" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-xl text-black">
                  {furnitureToDelete?.name || 'Furniture Item'}
                </h4>
                <span className="text-sm text-black">
                  ID: {furnitureToDelete?.familyId || 'N/A'}
                </span>
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
            className="flex-1 px-6 py-3 border bg-black border-slate-600 rounded-lg text-slate-300 
                     hover:bg-slate-700 hover:border-slate-500 transition-all duration-200 font-medium"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg
                     hover:from-red-700 hover:to-red-600 transition-all duration-200 font-medium
                     shadow-lg shadow-red-500/10 hover:shadow-red-500/20 flex items-center justify-center gap-2"
          >
            <Trash2 size={20} />
            Delete Item
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmationModal;