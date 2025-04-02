import React from "react";
import {
  AlertTriangle,
  UserX,
  X,
  Trash2,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

const DeleteModal = ({ isOpen, onClose, onConfirm, supplierToDelete }) => {
  console.log(supplierToDelete," supplierToDelete");
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
            <div className="absolute inset-0 bg-red-900/20 rounded-full animate-ping opacity-25" />
            <AlertTriangle size={48} className="text-red-500 animate-pulse" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
            Confirm Deletion
          </h3>
          <p className="text-slate-400 text-lg">
            Are you sure you want to delete this supplier? This action cannot be
            undone.
          </p>
        </div>

        {/* Supplier Details */}
        {supplierToDelete && (
          <div className="bg-white p-6 rounded-xl mb-8 border border-slate-600">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-600">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-slate-600 flex items-center justify-center border-2 border-red-500/20">
                  <span className="text-2xl font-bold text-slate-300">
                    {supplierToDelete.name.charAt(0)}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full border-2 border-slate-700">
                  <UserX size={14} className="text-red-900" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-xl text-black">
                  {supplierToDelete.name}
                </h4>
                <span className="text-sm text-black">
                  ID: {supplierToDelete.id}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-black">
                <Building2 size={18} className="text-black" />
                <span>{supplierToDelete.primaryContactName}</span>
              </div>
              <div className="flex items-center gap-3 text-black">
                <Mail size={18} className="text-black" />
                <span>{supplierToDelete.email}</span>
              </div>
              <div className="flex items-center gap-3 text-black">
                <Phone size={18} className="text-black" />
                <span>{supplierToDelete.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-3 text-black">
                <MapPin size={18} className="text-black" />
                <span>
                  {supplierToDelete.city}, {supplierToDelete.state},{" "}
                  {supplierToDelete.country}
                </span>
              </div>
              <div className="flex items-center gap-3 text-black">
                <Globe size={18} className="text-black" />
                <span>{supplierToDelete.websiteUrl}</span>
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
            Delete Supplier
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteModal;