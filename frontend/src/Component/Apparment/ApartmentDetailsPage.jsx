
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  Building,
  Bed,
  Maximize,
  DollarSign,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { getApartmentTypeById } from "../../ApiService/AppartmentType/AppartmentTypeApiService";

const ApartmentDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get apartment ID from URL
  const [apartment, setApartment] = useState({});

  useEffect(() => {
    const fetchApartment = async () => {
      const data = await getApartmentTypeById(id);
      console.log(data, "------data details======");
     setApartment(data);
    };
    fetchApartment();
  }, [id]);

  if (!apartment)
    return (
      <p className="bg-gradient-to-b h-screen from-slate-900 to-slate-800 text-white">
        Loading...
      </p>
    );

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      <div className="w-full mx-auto">
        {/* Header Section */}
        <div className="mb-6 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </motion.button>
        </div>

        {/* Main Content Card */}
        <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
          {/* Title Section */}
          <div className="bg-slate-900 p-6">
            <h1 className="text-3xl font-bold text-white mb-4">
              {apartment.name}
            </h1>
            <div className="inline-flex items-center bg-slate-600/50 px-3 py-1.5 rounded-full text-slate-300">
              <MapPin size={16} className="mr-2" />
              <span className="text-sm">{apartment.location}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PropertyFeature
                icon={<Home size={24} />}
                label="Property Type"
                value={apartment.type}
              />
              <PropertyFeature
                icon={<Building size={24} />}
                label="Category"
                value={apartment.categoryName}
              />
              <PropertyFeature
                icon={<Bed size={24} />}
                label="Bedrooms"
                value={apartment.numberOfBedrooms}
              />
              <PropertyFeature
                icon={<Maximize size={24} />}
                label="Floor Area"
                value={`${apartment.floorAreaMin} - ${apartment.floorAreaMax} sqft`}
              />
              <PropertyFeature
                icon={<DollarSign size={24} />}
                label="Price"
                value={`$${apartment.price}`}
                className="md:col-span-2 bg-gradient-to-r from-slate-700/50 to-slate-700/30"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyFeature = ({ icon, label, value, className = "" }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`group p-6 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-all duration-300 ${className}`}
  >
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors duration-300">
        <div className="text-blue-400">{icon}</div>
      </div>
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    </div>
  </motion.div>
);

export default ApartmentDetailsPage;
