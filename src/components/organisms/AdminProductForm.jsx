import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import productService from "@/services/api/productService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const AdminProductForm = ({ onSuccess, onCancel }) => {
const [formData, setFormData] = useState({
Name: "",
    category: "",
    description: "",
    buyingPrice: 0,
    sellingPrice: 0,
    measurementUnit: "",
    customUnit: "",
    discountType: "Percentage",
    discountValue: 0,
    images: [""],
    priceTiers: [
      { minQuantity: 1, price: 0, discountPercentage: 0 }
    ],
    featured: false
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Vegetables", "Fruits", "Groceries", "Meat", 
    "Milk", "Pizza", "Drinks", "Ready-to-Eat"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };


  const calculateProfit = () => {
    const buying = parseFloat(formData.buyingPrice) || 0;
    const selling = parseFloat(formData.sellingPrice) || 0;
    const profit = selling - buying;
    const profitPercent = buying > 0 ? ((profit / buying) * 100) : 0;
    return { profit, profitPercent };
  };

  const handleImageFileChange = (index, file) => {
    if (file) {
      const newFiles = [...imageFiles];
      const newPreviews = [...imagePreviews];
      
      newFiles[index] = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews[index] = e.target.result;
        setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);
      
      setImageFiles(newFiles);
      
      // Update form data with file name for now (in real app, would upload to server)
      const newImages = [...formData.images];
      newImages[index] = file.name;
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ""]
    }));
    setImageFiles(prev => [...prev, null]);
    setImagePreviews(prev => [...prev, null]);
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      const newFiles = imageFiles.filter((_, i) => i !== index);
      const newPreviews = imagePreviews.filter((_, i) => i !== index);
      
      setFormData(prev => ({ ...prev, images: newImages }));
      setImageFiles(newFiles);
      setImagePreviews(newPreviews);
    }
  };

  const handleTierChange = (index, field, value) => {
    const newTiers = [...formData.priceTiers];
    newTiers[index] = {
      ...newTiers[index],
      [field]: field === "price" || field === "minQuantity" ? parseFloat(value) || 0 : value
    };

    // Auto-calculate discount percentage
    if (field === "price" && index > 0) {
      const basePrice = newTiers[0].price;
      const currentPrice = parseFloat(value) || 0;
      const discountPercentage = basePrice > 0 ? Math.round(((basePrice - currentPrice) / basePrice) * 100) : 0;
      newTiers[index].discountPercentage = Math.max(0, discountPercentage);
    }

    setFormData(prev => ({
      ...prev,
      priceTiers: newTiers
    }));
  };

  const addTier = () => {
    const lastTier = formData.priceTiers[formData.priceTiers.length - 1];
    const newMinQuantity = lastTier.minQuantity + 10;
    
    setFormData(prev => ({
      ...prev,
      priceTiers: [
        ...prev.priceTiers,
        { minQuantity: newMinQuantity, price: 0, discountPercentage: 0 }
      ]
    }));
  };

  const removeTier = (index) => {
    if (formData.priceTiers.length > 1) {
      const newTiers = formData.priceTiers.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        priceTiers: newTiers
      }));
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.category || !formData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.measurementUnit.trim()) {
      toast.error("Please select a measurement unit");
      return;
    }

    if (formData.measurementUnit === "custom" && !formData.customUnit.trim()) {
      toast.error("Please enter a custom unit");
      return;
    }

    if (parseFloat(formData.buyingPrice) <= 0) {
      toast.error("Buying price must be greater than 0");
      return;
    }

    if (parseFloat(formData.sellingPrice) <= 0) {
      toast.error("Selling price must be greater than 0");
      return;
    }

    if (parseFloat(formData.sellingPrice) <= parseFloat(formData.buyingPrice)) {
      toast.error("Selling price must be greater than buying price");
      return;
    }

    if (formData.priceTiers[0].price <= 0) {
      toast.error("Base price must be greater than 0");
      return;
    }

    const validImages = formData.images.filter(img => img.trim() !== "");
    if (validImages.length === 0) {
      toast.error("Please add at least one product image");
      return;
    }

    try {
      setLoading(true);
      
const productData = {
        Name: formData.Name,
        category: formData.category,
        description: formData.description,
        images: validImages,
        priceTiers: formData.priceTiers.sort((a, b) => a.minQuantity - b.minQuantity),
        inStock: true,
        stockCount: 50,
        featured: formData.featured,
        trending: false,
        dealId: "",
        dietaryTags: "",
        frequentlyBoughtWith: "",
        featuredOrder: formData.featured ? 1 : null,
        measurementUnit: formData.measurementUnit === "custom" ? formData.customUnit : formData.measurementUnit,
        images: validImages,
        priceTiers: formData.priceTiers.sort((a, b) => a.minQuantity - b.minQuantity)
      };
      
      // Remove customUnit from final data if not needed
      delete productData.customUnit;

      await productService.create(productData);
      toast.success("Product created successfully!");
      onSuccess && onSuccess();
    } catch (error) {
      toast.error("Failed to create product");
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
<Input
            value={formData.Name}
            onChange={(e) => handleInputChange("Name", e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 focus:outline-none"
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

{/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter product description"
          rows={3}
          className="flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 focus:outline-none resize-none"
          required
        />
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Pricing Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buying Price (Rs) *
            </label>
            <Input
              type="number"
              value={formData.buyingPrice}
              onChange={(e) => handleInputChange("buyingPrice", e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selling Price (Rs) *
            </label>
            <Input
              type="number"
              value={formData.sellingPrice}
              onChange={(e) => handleInputChange("sellingPrice", e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Auto-calculated Profit */}
        <div className="bg-white p-3 rounded-lg border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Profit:</span>
            <div className="flex items-center space-x-2">
              <Badge variant="success" className="text-sm">
                Rs {calculateProfit().profit.toFixed(2)}
              </Badge>
              <Badge variant="primary" className="text-sm">
                {calculateProfit().profitPercent.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Measurement Units */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Measurement Unit *
        </label>
        <select
          value={formData.measurementUnit}
          onChange={(e) => handleInputChange("measurementUnit", e.target.value)}
          className="flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 focus:outline-none"
          required
        >
          <option value="">Select Unit</option>
          <option value="Kg">Kg</option>
          <option value="Pack">Pack</option>
          <option value="Box (12 units)">Box (12 units)</option>
          <option value="Dozen">Dozen</option>
          <option value="Liter">Liter</option>
          <option value="ml">ml</option>
          <option value="custom">Custom...</option>
        </select>
        
        {formData.measurementUnit === "custom" && (
          <div className="mt-2">
            <Input
              value={formData.customUnit}
              onChange={(e) => handleInputChange("customUnit", e.target.value)}
              placeholder="Enter custom unit"
              required
            />
          </div>
        )}
      </div>

      {/* Discount Configuration */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Discount Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Type
            </label>
            <select
              value={formData.discountType}
              onChange={(e) => handleInputChange("discountType", e.target.value)}
              className="flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 focus:outline-none"
            >
              <option value="Percentage">Percentage</option>
              <option value="Fixed Amount">Fixed Amount</option>
              <option value="Bulk Tier">Bulk Tier</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Value
            </label>
            <Input
              type="number"
              value={formData.discountValue}
              onChange={(e) => handleInputChange("discountValue", e.target.value)}
              placeholder="0"
              min="0"
              step={formData.discountType === "Percentage" ? "1" : "0.01"}
            />
          </div>
        </div>

        {/* Live Badge Preview */}
        {formData.discountValue > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Preview:</span>
            <Badge variant="discount">
              -{formData.discountValue}{formData.discountType === "Percentage" ? "%" : ` Rs`}
            </Badge>
          </div>
        )}
      </div>

      {/* Images */}
{/* Images */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Product Images *
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImageField}
          >
            <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
            Add Image
          </Button>
        </div>
        <div className="space-y-4">
          {formData.images.map((image, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                {/* File Input */}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileChange(index, e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  <div className="mt-2">
                    <Input
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="Or enter image URL"
                      className="text-sm"
                    />
                  </div>
                </div>
                
                {/* Image Preview */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  {imagePreviews[index] ? (
                    <img
                      src={imagePreviews[index]}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : image ? (
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 text-xs text-center">
                      <ApperIcon name="Image" className="h-6 w-6 mx-auto mb-1" />
                      Preview
                    </div>
                  )}
                  {image && !imagePreviews[index] && (
                    <div className="text-gray-400 text-xs text-center" style={{display: 'none'}}>
                      <ApperIcon name="ImageOff" className="h-6 w-6 mx-auto mb-1" />
                      Invalid
                    </div>
                  )}
                </div>
                
                {/* Remove Button */}
                {formData.images.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImageField(index)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {/* Preview Dimensions Info */}
              {(imagePreviews[index] || image) && (
                <div className="mt-2 text-xs text-gray-500">
                  Recommended: 600×600px for best quality
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price Tiers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Price Tiers *
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addTier}
          >
            <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
            Add Tier
          </Button>
        </div>
        
        <div className="space-y-4">
          {formData.priceTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">
                  Tier {index + 1}
                  {index === 0 && <Badge variant="primary" className="ml-2">Base Price</Badge>}
                  {tier.discountPercentage > 0 && (
                    <Badge variant="discount" className="ml-2">
                      {tier.discountPercentage}% OFF
                    </Badge>
                  )}
                </h4>
                {formData.priceTiers.length > 1 && index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTier(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Min Quantity
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={tier.minQuantity}
                    onChange={(e) => handleTierChange(index, "minQuantity", e.target.value)}
                    disabled={index === 0}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Price per Item (Rs.)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={tier.price}
                    onChange={(e) => handleTierChange(index, "price", e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => handleInputChange("featured", e.target.checked)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
          Mark as featured product
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {loading ? "Creating..." : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AdminProductForm;