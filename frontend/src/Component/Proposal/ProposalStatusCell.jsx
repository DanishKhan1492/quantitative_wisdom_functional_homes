import React, { useState } from "react";
import { motion } from "framer-motion"; // Assuming you're using framer-motion as in your main component

import {
  approveProposal,
  finalizeProposal,
} from "../../ApiService/ProposalServices/PorposalApiSurvice";
const ProposalStatusCell = ({ proposal, onStatusChange }) => {
  const [status, setStatus] = useState(proposal.status || "DRAFT");
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Function to handle status change
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    if (newStatus === status) return;

    setIsLoading(true);

    try {
      // Determine which API to call based on selected status
     if (newStatus === "Finalized") {
       await finalizeProposal(proposal.id);
     } else if (newStatus === "Approved") {
       await approveProposal(proposal.id);
     }

      // Update local state after successful API call
      setStatus(newStatus);

      // Notify parent component about the status change
      if (onStatusChange) {
        onStatusChange(proposal.id, newStatus);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      // You could add error handling here with toast notification
    } finally {
      setIsLoading(false);
    }
  };

  // Get background and effects based on status
  const getStatusStyles = (statusValue) => {
    switch (statusValue) {
      case "DRAFT":
        return {
          background: "bg-gradient-to-r from-amber-400 to-yellow-500",
          icon: "⚙️",
          animation: "pulse",
        };
      case "Finalized":
        return {
          background: "bg-gradient-to-r from-blue-400 to-blue-600",
          icon: "📋",
          animation: "none",
        };
      case "Approved":
        return {
          background: "bg-gradient-to-r from-emerald-400 to-green-600",
          icon: "✅",
          animation: "none",
        };
      case "Rejected":
        return {
          background: "bg-gradient-to-r from-red-400 to-red-600",
          icon: "❌",
          animation: "none",
        };
      default:
        return {
          background: "bg-gradient-to-r from-gray-400 to-gray-600",
          icon: "❓",
          animation: "none",
        };
    }
  };

  const statusInfo = getStatusStyles(status);

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      {/* Display the current status with styling */}
      <motion.div
        className={`
          text-white font-medium px-3 py-1.5 rounded-full 
          inline-block min-w-24 text-center shadow-sm
          ${statusInfo.background}
          
          border-2 border-white/20
        `}
        animate={
          isHovered && !isLoading && status !== "Approved"
            ? { y: [-1, 1, -1] }
            : {}
        }
        transition={{ repeat: Infinity, duration: 1 }}
      >
        <span className="mr-2">{statusInfo.icon}</span>
        {status}
        {isHovered && !isLoading && status !== "Approved" && (
          <span className="ml-2">▼</span>
        )}
      </motion.div>

      {/* Dropdown for changing status */}
      <select
        className="absolute inset-0 opacity-0 cursor-pointer w-full"
        value={status}
        onChange={handleStatusChange}
        disabled={isLoading || status === "Approved"} // Prevent changes after approval
      >
        <option value="DRAFT">DRAFT</option>
        <option value="Finalized">Finalized</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-0 top-0 h-full flex items-center pr-2">
          <motion.div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          ></motion.div>
        </div>
      )}

      {/* Tooltip */}
      {isHovered && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 left-0 top-full mt-2 bg-black/90 text-white text-xs rounded px-2 py-1 shadow-lg"
        >
          {status === "Approved"
            ? "This proposal has been approved and can't be changed"
            : "Click to change status"}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProposalStatusCell;
