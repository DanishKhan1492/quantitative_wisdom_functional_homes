import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, FileText, User, Home, DollarSign, Calendar, Package } from "lucide-react";
import { motion } from "framer-motion";

const ProposalDetails = () => {
  const navigate = useNavigate();
  const { state: proposal } = useLocation();
  
  const proposals = {
    items: [
      {
        id: 1,
        name: "Modern Sofa",
        quantity: 2,
        unitPrice: 1500,
        totalPrice: 3000,
      },
      {
        id: 2,
        name: "Coffee Table",
        quantity: 3,
        unitPrice: 500,
        totalPrice: 1500,
      },
      {
        id: 3,
        name: "Armchair",
        quantity: 2,
        unitPrice: 250,
        totalPrice: 500,
      },
    ],
  };

  const InfoCard = ({ icon: Icon, title, value }) => (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white shadow-md rounded-xl p-4 flex items-start gap-3"
    >
      <div className="bg-black p-2 rounded-lg">
        <Icon className="text-white" size={20} />
      </div>
      <div>
        <h3 className="text-black text-sm">{title}</h3>
        <p className="text-black font-medium mt-1">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="h-screen bg-background p-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center text-black hover:text-white transition-colors mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Proposals
        </motion.button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Proposal Overview Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 to-stone-900 p-6">
                <h1 className="text-2xl font-bold text-white">
                  {proposal.name}
                </h1>
                <span
                  className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-semibold ${
                    proposal.status === "Pending"
                      ? "bg-yellow-500/20 text-slate-400"
                      : proposal.status === "Approved"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {proposal.status}
                </span>
              </div>
              <div className="p-6">
                <p className="text-black mb-6">{proposal.description}</p>
                <div className="space-y-4">
                  <InfoCard
                    icon={Calendar}
                    title="Date"
                    value={proposal.date}
                  />
                  <InfoCard
                    icon={Home}
                    title="Apartment Name"
                    value={proposal.apartmentName}
                  />
                  <InfoCard
                    icon={User}
                    title="Client Info"
                    value={proposal.clientInfo}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Financial Information */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-black mb-4">
                Financial Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={Package}
                  title="Quantity"
                  value={proposal.quantity}
                />
                <InfoCard
                  icon={DollarSign}
                  title="Unit Price"
                  value={`AED ${proposal.price.toFixed(2)}`}
                />
                <InfoCard
                  icon={DollarSign}
                  title="Total Price"
                  value={`AED ${proposal.totalPrice.toFixed(2)}`}
                />
              </div>
            </div>

            {/* Items Included */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-black mb-4">
                Items Included
              </h2>
              <div className="space-y-4">
                {proposals.items.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white shadow-md rounded-xl p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-black font-medium">{item.name}</h3>
                        <p className="text-black text-md mt-1">
                          Quantity: {item.quantity} × AED{" "}
                          {item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-black font-semibold">
                        AED {item.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-6 py-3 mb-4 bg-black text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-colors"
              >
                <FileText size={18} className="mr-2" />
                Download Proposal
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetails;