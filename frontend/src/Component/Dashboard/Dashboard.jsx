import React, { useState, useEffect } from "react";
import {
  Users,
  Palette,
  Box,
  Building2,
  FileText,
  Sofa,
  ShoppingBag,
  UserCheck,
  UserX,
  PackageCheck,
  PackageX,
  AlertTriangle,
  FileCheck,
  FileClock,
  FileOutput,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  getSupplierMetadata,
  getColourMetadata,
  getMaterialMetadata,
  getFurnitureMetadata,
  getProductsMetadata,
  getProposalMetadata,
  getAppartmentMetadata,
} from "../../ApiService/DashboadApiServices/DashboardApiServices";

const MainCard = ({ title, value, icon: Icon, details }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-black text-xl font-medium">{title}</h3>
          <p className="text-3xl font-bold text-black mt-1">{value}</p>
        </div>
        <div className="bg-black p-3 rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {details && (
        <div className="space-y-3 transition-all duration-300 ease-in-out">
          {details.map((detail, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-white p-3 rounded-lg shadow-xl border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <detail.icon className={`w-6 h-6 ${detail.iconColor}`} />
                <span className="text-md font-medium text-black">
                  {detail.label}
                </span>
              </div>
              <span className={`text-2xl font-semibold ${detail.textColor}`}>
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const SmallCard = ({ title, value, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-black text-xl font-medium">{title}</h3>
          <p className="text-2xl font-bold text-black mt-1">{value}</p>
        </div>
        <div className="bg-black p-3 rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  // State for metadata from APIs
  const [supplierMeta, setSupplierMeta] = useState(null);
  const [colourMeta, setColourMeta] = useState(null);
  const [materialMeta, setMaterialMeta] = useState(null);
  const [furnitureMeta, setFurnitureMeta] = useState(null);
  const [productMeta, setProductMeta] = useState(null);
  const [proposalMeta, setProposalMeta] = useState(null);
  const [appartmentMeta, setAppartmentMeta] = useState(null);
 

  // Dummy data for other cards (if API not available)
  const mainStats = [
    {
      title: "Total Suppliers",
      value: supplierMeta?.totalSuppliers, // use API value if available, else dummy
      icon: Users,
      details: [
        {
          label: "Active",
          value: supplierMeta?.totalActiveSuppliers,
          icon: UserCheck,
          iconColor: "text-green-900",
          textColor: "text-black",
        },
        {
          label: "Inactive",
          value: supplierMeta?.totalInactiveSuppliers,
          icon: UserX,
          iconColor: "text-red-400",
          textColor: "text-black",
        },
      ],
    },
    {
      title: "Total Products",
      value: productMeta?.totalProducts,
      icon: ShoppingBag,
      details: [
        {
          label: "In Stock",
          value: "0",
          icon: PackageCheck,
          iconColor: "text-green-400",
          textColor: "text-green-400",
        },
        {
          label: "Out of Stock",
          value: "0",
          icon: PackageX,
          iconColor: "text-red-400",
          textColor: "text-red-400",
        },
       
      ],
    },
    {
      title: "Total Proposals",
      value: proposalMeta?.totalProposals,
      icon: FileText,
      details: [
        {
          label: "Draft",
          value: "0",
          icon: FileClock,
          iconColor: "text-slate-400",
          textColor: "text-slate-400",
        },
        {
          label: "Finalized",
          value: "0",
          icon: FileCheck,
          iconColor: "text-blue-400",
          textColor: "text-blue-400",
        },
        {
          label: "Approved",
          value: "0",
          icon: FileOutput,
          iconColor: "text-green-400",
          textColor: "text-green-400",
        },
      ],
    },
  ];

  const otherStats = [
    {
      title: "Total Colors",
      value: colourMeta?.totalColours,
      icon: Palette,
    },
    {
      title: "Total Materials",
      value: materialMeta?.totalMaterials,
      icon: Box,
    },
    {
      title: "Total Apartments",
      value: appartmentMeta?.totalApartmentTypes,
      icon: Building2,
    },
    {
      title: "Total Furniture",
      value: furnitureMeta?.totalFurnitureFamilies,
      icon: Sofa,
    },
  ];

  // Fetch dashboard metadata on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const supplierData = await getSupplierMetadata();
        setSupplierMeta(supplierData);

        const colourData = await getColourMetadata();
        setColourMeta(colourData);

        const materialData = await getMaterialMetadata();
        setMaterialMeta(materialData);

        const furnitureData = await getFurnitureMetadata();
        setFurnitureMeta(furnitureData);
        
        const productData = await getProductsMetadata();
        setProductMeta(productData);
        
        const proposalData = await getProposalMetadata();
        setProposalMeta(proposalData);
        
        const appartmentData = await getAppartmentMetadata();
        setAppartmentMeta(appartmentData);

       

      } catch (error) {
        console.error("Error fetching dashboard metadata:", error);
      }
    };
    fetchMetadata();
  }, []);

  return (
    <div className="h-screen bg-background">
      <div className="w-full p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black">Dashboard Overview</h1>
          <p className="text-black mt-1">Monitor your business metrics</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {mainStats.map((stat, index) => (
            <MainCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              details={stat.details}
            />
          ))}
        </div>

        {/* Other Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherStats.map((stat, index) => (
            <SmallCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
