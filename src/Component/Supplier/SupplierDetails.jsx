import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Edit, Trash2, ArrowLeft, Mail, Phone, MapPin, Globe, Building, CreditCard, Clock, FileText } from "lucide-react";
import { motion } from "framer-motion";

import {
  getSupplierById,
  deleteSupplier,
} from "../../ApiService/SupplierService/SupplierApiService";
import { toast } from "react-toastify";
const SupplierDetails = () => {
  const navigate = useNavigate();
  const { supplierId } = useParams(); // Get the supplier ID from URL parameters
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const data = await getSupplierById(supplierId);
        setSupplier(data);
      } catch (error) {
        console.error("Error fetching supplier details:", error);
        toast.error("Failed to fetch supplier details");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [supplierId]);

  const handleEdit = () => {
    navigate(`/suppliers`, { state: { editSupplierId: supplier.id } });
  };

  const handleDelete = async () => {
    try {
      await deleteSupplier(supplier.id);
      toast.success("Supplier deleted successfully");
      navigate("/suppliers");
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast.error("Failed to delete supplier");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

 


  if (!supplier) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
        <div className="text-white">Supplier not found.</div>
      </div>
    );
  }

  const InfoCard = ({ icon: Icon, title, value }) => (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-slate-700/50 rounded-xl p-4 flex items-start gap-3"
    >
      <div className="bg-blue-500/20 p-2 rounded-lg">
        <Icon className="text-blue-400" size={20} />
      </div>
      <div>
        <h3 className="text-slate-400 text-sm">{title}</h3>
        <p className="text-white font-medium mt-1">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="h-full bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center text-slate-300 hover:text-white transition-colors"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Suppliers
          </motion.button>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
              onClick={handleEdit}
            >
              <Edit size={18} className="mr-2" />
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
              onClick={handleDelete}
            >
              <Trash2 size={18} className="mr-2" />
              Delete
            </motion.button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-blue-600">
                    {supplier.name.charAt(0)}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white text-center">
                  {supplier.name}
                </h1>
                <p className="text-blue-100 mt-2">
                  {supplier.city}, {supplier.country}
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <InfoCard
                    icon={Mail}
                    title="Email"
                    value={supplier.email}
                  />
                  <InfoCard
                    icon={Phone}
                    title="Phone"
                    value={supplier.phoneNumber}
                  />
                  <InfoCard
                    icon={MapPin}
                    title="Location"
                    value={`${supplier.city}, ${supplier.state}, ${supplier.country}`}
                  />
                  <InfoCard
                    icon={Globe}
                    title="Website"
                    value={
                      <a 
                        href={supplier.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {supplier.websiteUrl}
                      </a>
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Information */}
            <div className="bg-slate-800 rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={Building}
                  title="Tax Number"
                  value={supplier.taxNumber}
                />
                <InfoCard
                  icon={FileText}
                  title="Business Registration"
                  value={supplier.businessRegistrationNumber}
                />
                <InfoCard
                  icon={CreditCard}
                  title="Payment Terms"
                  value={supplier.paymentTerms}
                />
                <InfoCard
                  icon={Clock}
                  title="Delivery Time"
                  value={`${supplier.deliveryTimeWeeks} weeks`}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-slate-800 rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Primary Contact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={Mail}
                  title="Contact Name"
                  value={supplier.primaryContactName}
                />
                <InfoCard
                  icon={Phone}
                  title="Contact Phone"
                  value={supplier.phoneNumber}
                />
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-slate-800 rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Status Information
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Account Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      supplier.status 
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-slate-600/20 text-slate-400'
                    }`}>
                      {supplier.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;