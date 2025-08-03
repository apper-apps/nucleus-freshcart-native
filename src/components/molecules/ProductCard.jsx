import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { useNavigate } from "react-router-dom";
import useCart from "@/hooks/useCart";

const ProductCard = ({ product, index = 0 }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleViewProduct = () => {
    navigate(`/product/${product.Id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const basePrice = product.priceTiers?.[0]?.price || 0;
  const hasDiscount = product.priceTiers?.some(tier => tier.discountPercentage > 0);
  const maxDiscount = Math.max(...(product.priceTiers?.map(tier => tier.discountPercentage) || [0]));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="card card-hover cursor-pointer group"
      onClick={handleViewProduct}
    >
      <div className="relative overflow-hidden">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="discount">
              Up to {maxDiscount}% OFF
            </Badge>
          </div>
        )}

        {/* Product Image */}
        <div className="aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
          <img
            src={product.images?.[0] || "/placeholder-product.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* Quick Add Button - appears on hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="rounded-full w-10 h-10 p-0 shadow-lg"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold gradient-text">
              Rs.{basePrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-500 ml-1">starting</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {product.inStock ? (
              <div className="flex items-center text-green-600">
                <ApperIcon name="CheckCircle" className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">In Stock</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <ApperIcon name="XCircle" className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">Out of Stock</span>
              </div>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="flex items-center justify-between">
          <Badge variant="default" className="text-xs">
            {product.category}
          </Badge>
          {product.featured && (
            <div className="flex items-center text-secondary-600">
              <ApperIcon name="Star" className="h-4 w-4 mr-1 fill-current" />
              <span className="text-xs font-medium">Featured</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;