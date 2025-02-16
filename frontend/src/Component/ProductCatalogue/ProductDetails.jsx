import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Carousel } from "react-bootstrap"; // Import Carousel
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Tag,
  DollarSign,
  Calendar,
  Building2,
} from "lucide-react";
import main from "../../images/main.jpg";
import "bootstrap/dist/css/bootstrap.min.css"; 

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state || null);

  useEffect(() => {
    if (!product) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const productDetails = await getProductById(id);
      setProduct(productDetails);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  if (!product) {
    return (
      <div className="text-white text-center">Loading product details...</div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6 ">
      <button
        className="flex items-center text-slate-300 hover:text-white transition-colors"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} className="mr-2" /> Back to Products
      </button>

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
            {product.allImages && product.allImages.length > 0 ? (
              <Carousel
                indicators={product.allImages.length > 1}
                controls={product.allImages.length > 1}
              >
                {product.allImages.map((img, index) => (
                  <Carousel.Item key={index}>
                    <img
                      src={`data:image/png;base64,${img}`}
                      alt={`${product.name} ${index + 1}`}
                      className="d-block w-full h-[400px] object-cover rounded-lg"
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <img
                src={product.image || main}
                alt={product.name}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            )}
            <div className="mt-6">
              <h1 className="text-2xl font-bold text-white"> {product.name}</h1>
              <p className="text-slate-400 mt-2">{product.description}</p>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard icon={Package} label="SKU" value={product.sku} />
            <InfoCard
              icon={DollarSign}
              label="Price"
              value={`AED ${product.price.toFixed(2)}`}
            />
            <InfoCard
              icon={Tag}
              label="Discount"
              value={product.discount.toFixed(1)}
            />
            <InfoCard
              icon={Building2}
              label="Supplier"
              value={product.supplierName}
            />
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Product Details
            </h2>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-slate-400">Sub Family</p>
                <p className="text-white">{product.subFamilyName}</p>
              </div>
              <div>
                <p className="text-slate-400">Status</p>
                <p className="text-white">{product.status}</p>
              </div>
              <div>
                <p className="text-slate-400">Date Added</p>
                <p className="text-white">{product.createdAt.split("T")[0]}</p>
              </div>
              <div>
                <p className="text-slate-400">Product Family</p>
                <p className="text-white">{product.familyName}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Specifications
            </h2>
            <div className="space-y-4">
              {/* <div className="flex items-center justify-between py-2 border-b border-slate-700">
                <span className="text-slate-400">Dimensions</span>
                <span className="text-white">10 x 15 x 20 cm</span>
              </div> */}
              <div className="flex items-center justify-between py-2 border-b border-slate-700">
                <span className="text-slate-400">Height</span>
                <span className="text-white">{product.height.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-700">
                <span className="text-slate-400">Length</span>
                <span className="text-white">{product.length.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400">Width</span>
                <span className="text-white">{product.width.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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


export default ProductDetails;
