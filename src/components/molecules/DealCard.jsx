import { motion } from "framer-motion";
import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const DealCard = ({ deal, index = 0 }) => {
const [expanded, setExpanded] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const navigate = useNavigate();

const displayProducts = expanded ? deal.products : deal.products.slice(0, 8);
  
  const calculateDiscount = (product) => {
    if (!product.priceTiers || product.priceTiers.length === 0) return null;
    const maxDiscount = Math.max(...product.priceTiers.map(tier => tier.discountPercentage));
    return maxDiscount > 0 ? maxDiscount : null;
  };
  
  const timeRemaining = formatDistanceToNow(new Date(deal.expiresAt), { 
    addSuffix: true 
  });

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
const handleViewMore = () => {
    if (deal.products.length <= 8) {
      // If 8 or fewer products, navigate to a filtered category page
      navigate(`/category?deal=${deal.Id}`);
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="card p-6 relative overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 opacity-60" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold gradient-text mb-1">
              {deal.title}
            </h3>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Clock" className="h-4 w-4 text-secondary-600" />
              <span className="text-sm text-secondary-600 font-medium">
                Expires {timeRemaining}
              </span>
            </div>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            <ApperIcon name="Zap" className="h-4 w-4 mr-1" />
            Hot Deal
          </Badge>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {displayProducts.map((product, productIndex) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
transition={{ delay: (index * 0.1) + (productIndex * 0.05) }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="deal-card-image cursor-pointer group relative overflow-hidden"
              onClick={() => handleProductClick(product.Id)}
              onHoverStart={() => setHoveredProduct(product.Id)}
              onHoverEnd={() => setHoveredProduct(null)}
            >
              {/* Discount Ribbon */}
              {calculateDiscount(product) && (
                <div className="absolute top-2 left-2 z-20">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg transform rotate-12 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {calculateDiscount(product)}% OFF
                  </div>
                </div>
              )}

              <img
                src={product.images?.[0] || "/placeholder-product.jpg"}
                alt={product.name}
                className="w-full h-full object-cover rounded-md transition-all duration-500 group-hover:scale-125 group-hover:rotate-1"
                loading="lazy"
              />
              
              {/* Enhanced Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-md flex flex-col items-center justify-center">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="bg-white rounded-full p-2 shadow-xl mb-2">
                    <ApperIcon name="Eye" className="h-4 w-4 text-primary-600" />
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <p className="text-xs font-semibold text-gray-900 text-center">Quick View</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Product Info Tooltip */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-30 shadow-xl">
                <div className="font-semibold">{product.name}</div>
                <div className="text-gray-300">Rs.{product.priceTiers?.[0]?.price || 0}</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </motion.div>
          ))}
        </div>

{/* Enhanced View More Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="outline"
            onClick={handleViewMore}
            className="w-full group bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200 hover:from-primary-100 hover:to-accent-100 hover:border-primary-300 transition-all duration-300"
          >
            <span className="flex items-center justify-center space-x-3">
              {deal.products.length > 8 ? (
                <>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Package" className="h-4 w-4 text-primary-600" />
                    <span className="font-semibold text-primary-700">
                      {expanded ? "Show Less" : `View ${deal.products.length - 8} More Deals`}
                    </span>
                  </div>
                  <ApperIcon 
                    name={expanded ? "ChevronUp" : "ChevronDown"} 
                    className="h-4 w-4 group-hover:scale-125 transition-all duration-300 text-primary-600" 
                  />
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="ShoppingBag" className="h-4 w-4 text-primary-600" />
                    <span className="font-semibold text-primary-700">Explore All Deals</span>
                  </div>
                  <ApperIcon 
                    name="ArrowRight" 
                    className="h-4 w-4 group-hover:translate-x-2 transition-all duration-300 text-primary-600" 
                  />
                </>
              )}
            </span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DealCard;