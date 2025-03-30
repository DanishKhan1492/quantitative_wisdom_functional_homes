import React from "react";
import { Package, ImagePlus } from "lucide-react";

const ProductDetailsTab = ({ formData, handleChange, handleImageChange, imagePreview, InputField, SelectField, families, availableSubFamilies }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center custom-scrollbar">
          <Package className="mr-2 text-blue-400" size={24} />
          Product Information
        </h3>

        {/* Product Name and SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Product Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter product name"
          />
          <InputField
            label="SKU"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            placeholder="Enter SKU"
          />
        </div>
      </div>

      {/* Family and Sub Family */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Family"
          id="family"
          name="family"
          value={formData.family}
          onChange={handleChange}
          options={families}
          required
        />
        <SelectField
          label="Sub Family"
          id="subFamily"
          name="subFamily"
          value={formData.subFamily}
          onChange={handleChange}
          options={availableSubFamilies}
          required
        />
      </div>

      {/* Status */}
      <div>
        <SelectField
          label="Status"
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={["In Stock", "Out of Stock", "Backordered"]}
          required
        />
      </div>

      {/* Dimensions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Dimensions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Width (cm)"
            id="width"
            name="width"
            value={formData.width}
            onChange={handleChange}
            type="number"
            required
            placeholder="Enter width"
          />
          <InputField
            label="Height (cm)"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            type="number"
            required
            placeholder="Enter height"
          />
          <InputField
            label="Length (cm)"
            id="length"
            name="length"
            value={formData.length}
            onChange={handleChange}
            type="number"
            required
            placeholder="Enter length"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-sm font-medium text-slate-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
            Product Image <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center w-full h-40 px-4 py-6 
                       border-2 border-dashed border-slate-600 rounded-xl cursor-pointer 
                       hover:border-blue-400 hover:bg-slate-700/50 transition-colors duration-200"
            >
              <ImagePlus className="w-12 h-12 text-slate-400" />
              <span className="mt-2 text-sm text-slate-400">
                Click to upload or drag and drop
              </span>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {imagePreview && (
          <div className="group">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Image Preview
            </label>
            <div className="relative h-40 rounded-xl overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsTab;