import React from "react";
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

const MainCard = ({ title, value, icon: Icon, details }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-xl p-6 border border-slate-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className="bg-blue-500/10 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      {details && (
        <div className="space-y-3">
          {details.map((detail, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-slate-700/30 p-3 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <detail.icon className={`w-4 h-4 ${detail.iconColor}`} />
                <span className="text-sm font-medium text-slate-300">
                  {detail.label}
                </span>
              </div>
              <span className={`text-sm font-semibold ${detail.textColor}`}>
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
      className="bg-slate-800 rounded-xl p-6 border border-slate-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className="bg-blue-500/10 p-3 rounded-lg">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const mainStats = [
    {
      title: "Total Suppliers",
      value: "126",
      icon: Users,
      details: [
        {
          label: "Active",
          value: "98",
          icon: UserCheck,
          iconColor: "text-green-400",
          textColor: "text-green-400",
        },
        {
          label: "Inactive",
          value: "28",
          icon: UserX,
          iconColor: "text-red-400",
          textColor: "text-red-400",
        },
      ],
    },
    {
      title: "Total Products",
      value: "892",
      icon: ShoppingBag,
      details: [
        {
          label: "In Stock",
          value: "634",
          icon: PackageCheck,
          iconColor: "text-green-400",
          textColor: "text-green-400",
        },
        {
          label: "Out of Stock",
          value: "158",
          icon: PackageX,
          iconColor: "text-red-400",
          textColor: "text-red-400",
        },
        {
          label: "Low Stock",
          value: "100",
          icon: AlertTriangle,
          iconColor: "text-amber-400",
          textColor: "text-amber-400",
        },
      ],
    },
    {
      title: "Total Proposals",
      value: "312",
      icon: FileText,
      details: [
        {
          label: "Draft",
          value: "45",
          icon: FileClock,
          iconColor: "text-slate-400",
          textColor: "text-slate-400",
        },
        {
          label: "Finalized",
          value: "156",
          icon: FileCheck,
          iconColor: "text-blue-400",
          textColor: "text-blue-400",
        },
        {
          label: "Approved",
          value: "111",
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
      value: "48",
      icon: Palette,
    },
    {
      title: "Total Materials",
      value: "89",
      icon: Box,
    },
    {
      title: "Total Apartments",
      value: "234",
      icon: Building2,
    },
    {
      title: "Total Furniture",
      value: "567",
      icon: Sofa,
    },
  ];

  return (
    <div className="h-screen bg-slate-900">
      <div className="w-full p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1">Monitor your business metrics</p>
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
