import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Package, Tag, DollarSign, Calendar, Building2 } from "lucide-react";
import main from "../../images/main.jpg";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { state: product } = useLocation();

  const InfoCard = ({ icon: Icon, label, value }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="bg-blue-500/10 p-2 rounded-lg">
          <Icon className="text-blue-400" size={20} />
        </div>
        <div>
          <p className="text-slate-400 text-sm">{label}</p>
          <p className="text-white font-medium">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6 ">
      <div className="-mb-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <button
            className="flex items-center text-slate-300 hover:text-white transition-colors"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} className="mr-2" /> Back to Products
          </button>
          <div className="flex gap-3">
            <button className="flex items-center px-4 py-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-colors">
              <Edit size={18} className="mr-2" /> Edit
            </button>
            <button className="flex items-center px-4 py-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors">
              <Trash2 size={18} className="mr-2" /> Delete
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Image */}
          <div className="col-span-12 lg:col-span-5">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
              <div className="relative">
                <img
                  src={main}
                  alt={product.name}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400 backdrop-blur-sm">
                    {product.status}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <h1 className="text-2xl font-bold text-white">
                  {product.name}
                </h1>
                <p className="text-slate-400 mt-2">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard icon={Package} label="SKU" value={product.sku} />
              <InfoCard
                icon={DollarSign}
                label="Price"
                value={`AED ${product.price.toFixed(2)}`}
              />
              <InfoCard
                icon={Tag}
                label="Product Family"
                value={product.family}
              />
              <InfoCard
                icon={Building2}
                label="Supplier"
                value={product.supplier}
              />
            </div>

            {/* Detailed Information */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Product Details
              </h2>
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-slate-400">Sub Family</p>
                  <p className="text-white">{product.subFamily}</p>
                </div>
                <div>
                  <p className="text-slate-400">Status</p>
                  <p className="text-white">{product.status}</p>
                </div>
                <div>
                  <p className="text-slate-400">Date Added</p>
                  <p className="text-white">{product.date}</p>
                </div>
                <div>
                  <p className="text-slate-400">Category</p>
                  <p className="text-white">Electronics</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Specifications
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Dimensions</span>
                  <span className="text-white">10 x 15 x 20 cm</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Weight</span>
                  <span className="text-white">500g</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Material</span>
                  <span className="text-white">Aluminum</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-400">Warranty</span>
                  <span className="text-white">1 Year</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;