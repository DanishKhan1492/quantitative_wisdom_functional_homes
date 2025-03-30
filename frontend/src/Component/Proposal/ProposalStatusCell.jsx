import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  approveProposal,
  finalizeProposal,
  getProposalById,
} from "../../ApiService/ProposalServices/PorposalApiSurvice";

const getStatusStyles = (statusValue) => {
  const normalizedStatus = statusValue?.toUpperCase() || "DRAFT";

  const statusStyles = {
    DRAFT: {
      background: "bg-gradient-to-r from-amber-400 to-yellow-500",
      icon: "📝",
      display: "Draft",
    },
    FINALIZED: {
      background: "bg-gray-400",
      icon: "📋",
      display: "Finalized",
    },
    APPROVED: {
      background: "bg-gradient-to-r from-emerald-400 to-green-600",
      icon: "✅",
      display: "Approved",
    },
    // REJECTED: {
    //   background: "bg-gradient-to-r from-red-400 to-red-600",
    //   icon: "❌",
    //   display: "Rejected",
    // },
  };

  return statusStyles[normalizedStatus] || statusStyles.DRAFT;
};

const ProposalStatusCell = ({ proposal, onStatusChange }) => {
  const validStatuses = ["DRAFT", "FINALIZED", "APPROVED"];
  const [currentProposal, setCurrentProposal] = useState(proposal);
  const [status, setStatus] = useState(
    getStatusStyles(proposal?.status).display
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const normalizedStatus = getStatusStyles(proposal?.status).display;
    setStatus(normalizedStatus);
    setCurrentProposal(proposal);
  }, [proposal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = async (newStatus) => {
    const normalizedNew = newStatus.toUpperCase();
    const currentStatus = status.toUpperCase();

    if (
      !validStatuses.includes(normalizedNew) ||
      normalizedNew === currentStatus
    )
      return;

    setIsLoading(true);
    try {
      if (normalizedNew === "FINALIZED") {
        await finalizeProposal(currentProposal.id);
      } else if (normalizedNew === "APPROVED") {
        await approveProposal(currentProposal.id);
      }

      const updatedProposal = await getProposalById(currentProposal.id);
      const newStatusData = getStatusStyles(updatedProposal.status);

      setCurrentProposal(updatedProposal);
      setStatus(newStatusData.display);

      onStatusChange?.(updatedProposal);
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setIsLoading(false);
      setIsDropdownOpen(false);
    }
  };

  const statusInfo = getStatusStyles(status);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        className={`
          relative text-white font-medium px-4 py-2 rounded-xl
          min-w-32 text-left shadow-lg transition-all
          ${statusInfo.background}
          hover:shadow-xl hover:scale-[1.02] focus:outline-none
          flex items-center justify-between
          ${isLoading ? "opacity-75 cursor-not-allowed" : ""}
          ${status === "Approved" ? "cursor-default" : "cursor-pointer"}
        `}
        onClick={() =>
          status !== "Approved" && setIsDropdownOpen(!isDropdownOpen)
        }
        disabled={status === "Approved" || isLoading}
        whileTap={{ scale: status === "Approved" ? 1 : 0.98 }}
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{statusInfo.icon}</span>
          <span>{status}</span>
        </div>

        {!isLoading && status !== "Approved" && (
          <motion.span
            className="ml-2"
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
          >
            ▼
          </motion.span>
        )}

        {isLoading && (
          <motion.div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 mt-2 w-full origin-top"
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-2 space-y-1 border border-gray-200 dark:border-gray-700">
              {validStatuses.map((option) => {
                const optionStyle = getStatusStyles(option);
                const currentStatus = status.toUpperCase();
                const isDisabled =
                  option === currentStatus || // Always disable current status
                  (currentStatus === "DRAFT" && option !== "FINALIZED") || // Only allow Finalized from Draft
                  (currentStatus === "APPROVED" && option !== "APPROVED"); // Lock Approved status

                return (
                  <motion.button
                    key={option}
                    className={`
                      w-full px-4 py-2.5 rounded-lg flex items-center space-x-3
                      transition-all text-sm font-medium
                      ${
                        isDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }
                      ${optionStyle.background}
                    `}
                    onClick={() => !isDisabled && handleStatusChange(option)}
                    disabled={isDisabled}
                    whileHover={!isDisabled ? { scale: 1.02 } : {}}
                  >
                    <span className="text-lg">{optionStyle.icon}</span>
                    <span className="text-white">{optionStyle.display}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProposalStatusCell;
