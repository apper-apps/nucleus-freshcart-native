import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import useCart from "@/hooks/useCart";
const ProductCard = ({ product, index = 0 }) => {
  const navigate = useNavigate();
const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleViewProduct = () => {
    navigate(`/product/${product.Id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };
// Safely parse priceTiers - handle both array and string formats
  const getPriceTiers = (priceTiers) => {
    if (!priceTiers) return [];
    if (Array.isArray(priceTiers)) return priceTiers;
    if (typeof priceTiers === 'string') {
      try {
        const parsed = JSON.parse(priceTiers);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const safePriceTiers = getPriceTiers(product.priceTiers);
  const currentTier = safePriceTiers[selectedVariant] || safePriceTiers[0] || { price: 0, discountPercentage: 0 };
  const basePrice = safePriceTiers[0]?.price || 0;
  const hasDiscount = safePriceTiers.some(tier => tier.discountPercentage > 0);
  const maxDiscount = Math.max(...(safePriceTiers.map(tier => tier.discountPercentage) || [0]));
  const originalPrice = currentTier.discountPercentage > 0 ? 
    Math.round(currentTier.price / (1 - currentTier.discountPercentage / 100)) : null;
  
  const stockLeft = product.stockCount || Math.floor(Math.random() * 20) + 5;
  const isLowStock = stockLeft <= 10;
  const isVeryLowStock = stockLeft <= 5;
  
  const updatePricing = (variantIndex) => {
    setSelectedVariant(variantIndex);
  };

  const getDietaryBadgeVariant = (tag) => {
    const variants = {
      'Vegan': 'vegan',
      'Organic': 'organic',
      'Vegetarian': 'vegetarian',
      'Halal': 'halal',
      'Gluten-Free': 'glutenFree'
    };
    return variants[tag] || 'default';
  };

  return (
<motion.div
    initial={{
        opacity: 0,
        y: 20
    }}
    animate={{
        opacity: 1,
        y: 0
    }}
    transition={{
        delay: index * 0.1
    }}
    whileHover={{
        scale: 1.03,
        y: -8
    }}
    className="product-card card card-hover cursor-pointer group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500"
    onClick={handleViewProduct}
    onHoverStart={() => setIsHovered(true)}
    onHoverEnd={() => setIsHovered(false)}>
    <div className="relative overflow-hidden rounded-t-xl">
        {/* Discount Ribbon */}
        {currentTier.discountPercentage > 0 && <div className="discount-ribbon absolute top-0 right-0 z-20">
            <div
                className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 transform rotate-45 translate-x-3 -translate-y-1 shadow-lg min-w-[80px] text-center">
                {currentTier.discountPercentage}% OFF
                            </div>
        </div>}
        {/* Product Image */}
        <div
            className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
            <img
                src={product.images?.[0] || "/placeholder-product.jpg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                loading="lazy" />
            {/* Image Overlay Effects */}
            <div
                className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        {/* Quick Add Button */}
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.8
            }}
            animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8
            }}
            className="absolute bottom-3 right-3 z-10">
            <Button
                size="sm"
                onClick={handleAddToCart}
                className="rounded-full w-12 h-12 p-0 shadow-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 border-2 border-white">
                <ApperIcon name="Plus" className="h-5 w-5" />
            </Button>
        </motion.div>
    </div>
    {/* Product Info */}
    <div className="p-5 space-y-4">
        <div>
            <h3
className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 text-lg mb-2">
                {product.Name || product.name}
            </h3>
            {/* Pricing Section */}
            <div className="pricing flex items-center space-x-3 mb-3">
                <span className="discounted-price text-2xl font-bold gradient-text">Rs {currentTier.price}
                </span>
                {originalPrice && <span className="original-price text-lg text-gray-500 line-through">Rs {originalPrice}
                </span>}
            </div>
            {/* Variant Selector */}
            {product.priceTiers && product.priceTiers.length > 1 && <div className="variants flex space-x-2 mb-3">
                {product.priceTiers.map((tier, index) => <button
                    key={index}
                    onClick={e => {
                        e.stopPropagation();
                        updatePricing(index);
                    }}
                    className={`px-3 py-1 text-xs font-medium rounded-full border-2 transition-all duration-200 ${selectedVariant === index ? "selected bg-primary-500 text-white border-primary-500" : "bg-gray-100 text-gray-700 border-gray-200 hover:border-primary-300"}`}
                    data-price={tier.price}>
                    {tier.minQuantity}kg
                                    </button>)}
            </div>}
            {/* Stock & Category Row */}
            <div className="flex items-center justify-between mb-3">
                <div className="stock flex items-center">
                    {product.inStock ? <motion.div
                        className={`flex items-center ${isVeryLowStock ? "text-red-600" : isLowStock ? "text-orange-600" : "text-green-600"}`}
                        animate={isVeryLowStock ? {
                            scale: [1, 1.05, 1]
                        } : {}}
                        transition={{
                            duration: 1,
                            repeat: Infinity
                        }}>
                        <div
                            className={`w-2 h-2 rounded-full mr-2 ${isVeryLowStock ? "bg-red-500 animate-pulse" : isLowStock ? "bg-orange-500 animate-pulse" : "bg-green-500 animate-pulse"}`} />
                        <span className="text-sm font-medium">
                            {isVeryLowStock ? `Only ${stockLeft} left!` : isLowStock ? `${stockLeft} left` : `${stockLeft} available`}
                        </span>
                    </motion.div> : <div className="flex items-center text-red-600">
                        <ApperIcon name="XCircle" className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Out of Stock</span>
                    </div>}
                </div>
                <div className="flex items-center space-x-1">
                    {product.trending && <Badge variant="trending" className="text-xs px-2 py-1">🔥 Trending
                                        </Badge>}
                    <Badge
                        variant="outline"
                        className="text-xs px-2 py-1 bg-gradient-to-r from-accent-50 to-accent-100 text-accent-700 border-accent-200">
                        {product.category}
</Badge>
                </div>
            </div>
            
            {/* Dietary Tags */}
            {product.dietaryTags && product.dietaryTags.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-1 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {product.dietaryTags.slice(0, 3).map((tag, tagIndex) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * tagIndex }}
                  >
                    <Badge
                      variant={getDietaryBadgeVariant(tag)}
                      className="text-xs px-2 py-0.5 font-medium"
                    >
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
                {product.dietaryTags.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border border-gray-200"
                  >
                    +{product.dietaryTags.length - 3}
                  </Badge>
                )}
              </motion.div>
            )}
            {/* Action Button */}
            <motion.button
                whileHover={{
                    scale: 1.02
                }}
                whileTap={{
                    scale: 0.98
                }}
                onClick={handleAddToCart}
                className="add-cart w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2">
                <ApperIcon name="ShoppingCart" className="h-4 w-4" />
                <span>+ Add to Cart</span>
            </motion.button>
        </div>
        {/* Featured Badge */}
        {product.featured && <div className="absolute top-3 left-3 z-10">
            <div
                className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                <ApperIcon name="Star" className="h-3 w-3 fill-current" />
                <span>Featured</span>
            </div>
        </div>}
    </div></motion.div>
  );
};

export default ProductCard;