import React from "react";
import { Shirt, Palette } from "lucide-react";
import Select from "react-select";

const MaterialColorTab = ({ formData, handleMaterialChange, handleColourChange, materialOptions, colourOptions, customStyles }) => {
  // Enhanced custom styles with larger fields
  const enhancedCustomStyles = {
    ...customStyles,
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#334155', // slate-800
      borderColor: state.isFocused ? '#3b82f6' : '#334155',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
      padding: '0.2rem',
      minHeight: '2rem',
      borderRadius: '1rem',
      '&:hover': {
        borderColor: '#3b82f6',
        borderWidth: '2px'
      },
      transition: 'all 0.2s ease'
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0.5rem'
    }),
    input: (provided) => ({
      ...provided,
      color: 'white',
      fontSize: '1rem'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#94a3b8',
      fontSize: '1rem'
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '1rem',
      padding: '0.5rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' :
                      state.isFocused ? '#2563eb' : 'transparent',
      color: state.isSelected || state.isFocused ? 'white' : '#94a3b8',
      padding: '1rem',
      fontSize: '1rem',
      borderRadius: '0.5rem',
      margin: '0.25rem 0',
      '&:hover': {
        backgroundColor: '#2563eb',
        color: 'white'
      }
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#3b82f6',
      borderRadius: '0.5rem',
      padding: '0.25rem',
      margin: '0.25rem'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white',
      fontSize: '0.9rem',
      padding: '0.25rem 0.5rem'
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'white',
      padding: '0.5rem',
      '&:hover': {
        backgroundColor: '#2563eb',
        color: 'white',
        borderRadius: '0 0.5rem 0.5rem 0'
      }
    })
  };

  return (
    <div className="space-y-12">
      {/* Materials Section */}
      <div className="bg-slate-800 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center mb-8">
          <div className="p-4 bg-blue-500/10 rounded-1xl">
            <Shirt className="text-blue-400 h-8 w-8" />
          </div>
          <h3 className="text-1xl font-semibold text-white ml-4">
            Select Materials
          </h3>
        </div>
        <div className="relative">
          <Select
            id="material1"
            name="material1"
            isMulti
            value={formData.material1}
            onChange={(selected) => handleMaterialChange(selected, "material1")}
            options={materialOptions}
            styles={enhancedCustomStyles}
            placeholder="Choose materials for your product..."
            required
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
      </div>

      {/* Colors Section */}
      <div className="bg-slate-800 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center mb-8">
          <div className="p-4 bg-blue-500/10 rounded-2xl">
            <Palette className="text-blue-400 h-8 w-8" />
          </div>
          <h3 className="text-1xl font-semibold text-white ml-4">
            Select Colors
          </h3>
        </div>
        <div className="relative">
          <Select
            id="colour1"
            name="colour1"
            isMulti
            value={formData.colour1}
            onChange={(selected) => handleColourChange(selected, "colour1")}
            options={colourOptions}
            styles={enhancedCustomStyles}
            placeholder="Choose colors for your product..."
            required
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
      </div>

      {/* Information Box */}
      <div className="bg-slate-800/50 rounded-xl p-6">
        <p className="text-slate-400 text-base flex items-center">
          <span className="text-blue-400 text-xl mr-3">ℹ</span>
          You can select multiple materials and colors for your product. Each selection will be saved automatically.
        </p>
      </div>
    </div>
  );
};

export default MaterialColorTab;