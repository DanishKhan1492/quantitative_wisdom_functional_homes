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
    <div className="h-screen bg-background p-6 ">
      <button
        className="flex items-center text-black hover:text-white transition-colors"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} className="mr-2" /> Back to Products
      </button>

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-white backdrop-blur-sm rounded-xl p-6">
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
              <h1 className="text-2xl font-bold text-black"> {product.name}</h1>
              <p className="text-black mt-2">{product.description}</p>
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
          <div className="bg-white backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              Product Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-md p-2 shadow-md">
                <p className="text-black font-bold ">Sub Family</p>
                <p className="text-black">{product.subFamilyName}</p>
              </div>
              <div className="bg-white rounded-md p-2 shadow-md">
                <p className="text-black font-bold">Status</p>
                <p className="text-black">{product.status}</p>
              </div>
              <div className="bg-white rounded-md p-2 shadow-md">
                <p className="text-black font-bold">Date Added</p>
                <p className="text-black">{product.createdAt.split("T")[0]}</p>
              </div>
              <div className="bg-white rounded-md p-2 shadow-md">
                <p className="text-black font-bold">Product Family</p>
                <p className="text-black">{product.familyName}</p>
              </div>
            </div>
          </div>
          <div className="bg-white backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              Specifications
            </h2>
            <div className="space-y-4">
              {/* <div className="flex items-center justify-between py-2 border-b border-slate-700">
                <span className="text-slate-400">Dimensions</span>
                <span className="text-white">10 x 15 x 20 cm</span>
              </div> */}
              <div className="flex items-center justify-between py-2 border-b border-slate-700">
                <span className="text-black font-bold">Height</span>
                <span className="text-black">{product.height.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-700">
                <span className="text-black font-bold">Length</span>
                <span className="text-black">{product.length.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-black font-bold">Width</span>
                <span className="text-black">{product.width.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white shadow-md backdrop-blur-sm rounded-xl p-4">
    <div className="flex items-center gap-3">
      <div className="bg-black p-2 rounded-lg">
        <Icon className="text-white" size={20} />
      </div>
      <div>
        <p className="text-black text-md">{label}</p>
        <p className="text-black font-medium">{value}</p>
      </div>
    </div>
  </div>
);


export default ProductDetails;
