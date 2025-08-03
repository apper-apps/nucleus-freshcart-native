import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import productService from "@/services/api/productService";
import { toast } from "react-toastify";

const AdminProductForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    images: [""],
    priceTiers: [
      { minQuantity: 1, price: 0, discountPercentage: 0 }
    ],
    featured: false
  });
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

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ""]
    }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        images: newImages
      }));
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
        ...formData,
        images: validImages,
        priceTiers: formData.priceTiers.sort((a, b) => a.minQuantity - b.minQuantity)
      };

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
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
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
        <div className="space-y-2">
          {formData.images.map((image, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder="Enter image URL"
                className="flex-1"
              />
              {formData.images.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImageField(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" className="h-4 w-4" />
                </Button>
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