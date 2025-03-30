import React from "react";
import {
  AlertTriangle,
  X,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, proposalToDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3 }}
        className="bg-background rounded-xl w-full max-w-lg p-6 relative shadow-2xl mx-4"
      >
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
          <p className="text-black text-lg">
            Are you sure you want to delete this proposal? This action cannot be undone.
          </p>
        </div>

        {/* Proposal Details (if provided) */}
        {proposalToDelete && (
          <div className="bg-gradient-to-r from-slate-700 to-slate-700/50 p-6 rounded-xl mb-8 border border-slate-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-slate-600 flex items-center justify-center border-2 border-red-500/20">
                  <span className="text-2xl font-bold text-slate-300">
                    {proposalToDelete.title?.charAt(0) || 'P'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-red-900/30 p-1.5 rounded-full border-2 border-slate-700">
                  <X size={14} className="text-red-400" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-xl text-slate-200">
                  {proposalToDelete?.title || 'Proposal'}
                </h4>
                <span className="text-sm text-slate-400">
                  ID: {proposalToDelete?.id || 'N/A'}
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
            className="flex-1 px-6 py-3 border border-slate-600 rounded-lg text-black bg-black/30
                      transition-all duration-200 font-medium"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-black text-white rounded-lg
                     hover:from-red-700 hover:to-red-600 transition-all duration-200 font-medium
                     shadow-lg shadow-red-500/10 hover:shadow-red-500/20 flex items-center justify-center gap-2"
          >
            <Trash2 size={20} />
            Delete Proposal
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmationModal;