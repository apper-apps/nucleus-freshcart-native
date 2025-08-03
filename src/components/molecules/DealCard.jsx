import { motion } from "framer-motion";
import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const DealCard = ({ deal, index = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const displayProducts = expanded ? deal.products : deal.products.slice(0, 8);
  
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
              whileHover={{ scale: 1.05 }}
              className="deal-card-image cursor-pointer group relative"
              onClick={() => handleProductClick(product.Id)}
            >
              <img
                src={product.images?.[0] || "/placeholder-product.jpg"}
                alt={product.name}
                className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-md flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white rounded-full p-1 shadow-lg">
                    <ApperIcon name="Eye" className="h-3 w-3 text-primary-600" />
                  </div>
                </div>
              </div>

              {/* Product Info Tooltip */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20">
                {product.name}
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <Button
          variant="outline"
          onClick={handleViewMore}
          className="w-full group"
        >
          <span className="flex items-center justify-center space-x-2">
            {deal.products.length > 8 ? (
              <>
                <span>{expanded ? "Show Less" : `View ${deal.products.length - 8} More`}</span>
                <ApperIcon 
                  name={expanded ? "ChevronUp" : "ChevronDown"} 
                  className="h-4 w-4 group-hover:scale-110 transition-transform" 
                />
              </>
            ) : (
              <>
                <span>View All Deals</span>
                <ApperIcon 
                  name="ArrowRight" 
                  className="h-4 w-4 group-hover:translate-x-1 transition-transform" 
                />
              </>
            )}
          </span>
        </Button>
      </div>
    </motion.div>
  );
};

export default DealCard;