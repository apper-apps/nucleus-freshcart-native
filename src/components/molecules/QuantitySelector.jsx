import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const QuantitySelector = ({ 
  priceTiers = [], 
  initialQuantity = 1, 
  onQuantityChange,
  onTierChange 
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [selectedTier, setSelectedTier] = useState(null);

  // Parse priceTiers if it's a string
  const parsedTiers = (() => {
    if (typeof priceTiers === 'string') {
      try {
        return JSON.parse(priceTiers);
      } catch (e) {
        return [];
      }
    }
    return Array.isArray(priceTiers) ? priceTiers : [];
  })();

  useEffect(() => {
    if (parsedTiers.length > 0) {
      // Find the appropriate tier based on quantity
      const tier = [...parsedTiers]
        .sort((a, b) => b.minQuantity - a.minQuantity)
        .find(t => quantity >= t.minQuantity) || parsedTiers[0];
      
      setSelectedTier(tier);
      onTierChange && onTierChange(tier);
    }
  }, [quantity, priceTiers]);

  useEffect(() => {
    onQuantityChange && onQuantityChange(quantity);
  }, [quantity]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const increment = () => handleQuantityChange(quantity + 1);
  const decrement = () => handleQuantityChange(quantity - 1);

  if (parsedTiers.length === 0) {
    return (
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={decrement}
          disabled={quantity <= 1}
          className="w-10 h-10 p-0"
        >
          <ApperIcon name="Minus" className="h-4 w-4" />
        </Button>
        <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={increment}
          className="w-10 h-10 p-0"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const totalPrice = selectedTier ? selectedTier.price * quantity : 0;
  const originalTotalPrice = parsedTiers[0] ? parsedTiers[0].price * quantity : 0;
  const savings = originalTotalPrice - totalPrice;

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={decrement}
            disabled={quantity <= 1}
            className="w-10 h-10 p-0"
          >
            <ApperIcon name="Minus" className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={increment}
            className="w-10 h-10 p-0"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Price Tiers */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Bulk Pricing:</h4>
        <div className="grid gap-2">
          {parsedTiers.map((tier, index) => {
            const isActive = selectedTier && tier.minQuantity === selectedTier.minQuantity;
            const isAvailable = quantity >= tier.minQuantity;
            
            return (
              <motion.div
                key={index}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  isActive
                    ? 'border-primary-500 bg-primary-50'
                    : isAvailable
                    ? 'border-gray-200 bg-white hover:border-primary-300'
                    : 'border-gray-100 bg-gray-50 opacity-60'
                }`}
                whileHover={isAvailable ? { scale: 1.02 } : {}}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {tier.minQuantity}+ items
                    </span>
                    {tier.discountPercentage > 0 && (
                      <Badge variant="discount" className="text-xs">
                        {tier.discountPercentage}% OFF
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600">
                      Rs.{tier.price.toFixed(2)} each
                    </div>
                    {tier.discountPercentage > 0 && parsedTiers[0] && (
                      <div className="text-xs text-gray-500 line-through">
                        Rs.{parsedTiers[0].price.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
                
                {isActive && (
                  <div className="mt-2 pt-2 border-t border-primary-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary-700">Total for {quantity} items:</span>
                      <span className="font-bold text-primary-700">Rs.{totalPrice.toFixed(2)}</span>
                    </div>
                    {savings > 0 && (
                      <div className="flex items-center justify-between text-xs text-green-600">
                        <span>You save:</span>
                        <span className="font-semibold">Rs.{savings.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuantitySelector;