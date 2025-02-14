import React from "react";
import { DollarSign, Truck } from "lucide-react";

const PriceSupplierTab = ({ formData, handleChange, InputField, SelectField }) => {
  return (
    <div className="space-y-8">
      {/* Price Section */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <DollarSign className="mr-2 text-blue-400" size={24} />
          Price Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Price (AED)"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            type="number"
            required
            placeholder="Enter price"
          />
          <InputField
            label="Discount (%)"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            type="number"
            placeholder="Enter discount"
          />
        </div>
      </div>

      {/* Supplier Section */}
      <div className="pt-6 border-t border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Truck className="mr-2 text-blue-400" size={24} />
          Supplier Information
        </h3>
        <div>
          <SelectField
            label="Supplier"
            id="supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            options={["FurnitureCo", "WoodWorks", "ModernDesign"]}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PriceSupplierTab;