import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const QuantitySelector = ({ 
  priceTiers, 
  initialQuantity = 1, 
  onQuantityChange, 
  onTierChange 
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [selectedTier, setSelectedTier] = useState(null);

  // Find the best tier for current quantity
  const getBestTier = (qty) => {
    const sortedTiers = [...priceTiers].sort((a, b) => b.minQuantity - a.minQuantity);
    for (const tier of sortedTiers) {
      if (qty >= tier.minQuantity) {
        return tier;
      }
    }
    return priceTiers[0];
  };

  useEffect(() => {
    const bestTier = getBestTier(quantity);
    setSelectedTier(bestTier);
    onQuantityChange && onQuantityChange(quantity);
    onTierChange && onTierChange(bestTier);
  }, [quantity, priceTiers]);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDirectInput = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, value));
  };

  return (
    <div className="space-y-4">
      {/* Quantity Controls */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="h-10 w-10 p-0 rounded-none"
          >
            <ApperIcon name="Minus" className="h-4 w-4" />
          </Button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleDirectInput}
            className="w-16 h-10 text-center border-0 focus:ring-0 focus:outline-none"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleIncrease}
            className="h-10 w-10 p-0 rounded-none"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Price Tiers Display */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Quantity Discounts:</h4>
        <div className="grid gap-2">
          {priceTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                selectedTier?.minQuantity === tier.minQuantity
                  ? "border-primary-500 bg-primary-50 shadow-md"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">
                  {tier.minQuantity}+ items
                </span>
                {tier.discountPercentage > 0 && (
                  <Badge variant="discount">
                    {tier.discountPercentage}% OFF
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-primary-600">
                  Rs.{tier.price.toFixed(2)} each
                </span>
                {selectedTier?.minQuantity === tier.minQuantity && (
                  <div className="text-sm text-primary-600 font-medium">
                    Total: Rs.{(tier.price * quantity).toFixed(2)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedTier && selectedTier.discountPercentage > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name="CheckCircle" className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              You save Rs.{((priceTiers[0].price - selectedTier.price) * quantity).toFixed(2)} 
              with this quantity!
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QuantitySelector;