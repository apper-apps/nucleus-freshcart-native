import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import QuantitySelector from "@/components/molecules/QuantitySelector";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Product360Viewer from "@/components/molecules/Product360Viewer";
import Error from "@/components/ui/Error";
import productService from "@/services/api/productService";
import useCart from "@/hooks/useCart";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [frequentlyBoughtWith, setFrequentlyBoughtWith] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 34, seconds: 56 });
  const { addToCart } = useCart();

useEffect(() => {
    if (id) {
      loadProduct();
      loadRecommendedProducts();
      loadFrequentlyBoughtWith();
    }
  }, [id]);

  useEffect(() => {
    // Countdown timer for limited-time offers
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadFrequentlyBoughtWith = async () => {
    try {
      const data = await productService.getFrequentlyBoughtWith(id);
      setFrequentlyBoughtWith(data);
    } catch (err) {
      console.error("Failed to load frequently bought together products:", err);
    }
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getById(id);
      setProduct(data);
    } catch (err) {
      setError("Product not found");
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendedProducts = async () => {
    try {
      const recommendations = await productService.getRecommended(id, 4);
      setRecommendedProducts(recommendations);
    } catch (err) {
      console.error("Error loading recommendations:", err);
    }
  };
const handleAddToCart = () => {
    if (product && selectedQuantity > 0) {
      addToCart(product, selectedQuantity);
    }
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

  const stockLeft = product?.stockCount || 0;
  const isLowStock = stockLeft <= 10;
  const isVeryLowStock = stockLeft <= 5;

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={loadProduct} />
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen pt-6 pb-24 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-gray-600 mb-6"
        >
          <button onClick={() => navigate("/")} className="hover:text-primary-600">
            Home
          </button>
          <ApperIcon name="ChevronRight" className="h-4 w-4" />
          <button onClick={() => navigate(`/category/${product.category}`)} className="hover:text-primary-600">
            {product.category}
          </button>
          <ApperIcon name="ChevronRight" className="h-4 w-4" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </motion.nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
{/* 360° Product Viewer */}
            <Product360Viewer
              images={product.images}
              productName={product.name}
              className="w-full"
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
<div className="flex items-center space-x-2 mb-2">
                <Badge variant="default">{product.category}</Badge>
                {product.featured && (
                  <Badge variant="secondary">
                    <ApperIcon name="Star" className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              
              {/* Dietary Tags */}
{product.dietaryTags && product.dietaryTags.length > 0 && (
                <motion.div 
                  className="flex flex-wrap gap-2 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {product.dietaryTags.map((tag, index) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Badge
                        variant={getDietaryBadgeVariant(tag)}
                        className="px-3 py-1 font-medium"
                      >
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
<div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {product.inStock ? (
                  <motion.div 
                    className={`flex items-center space-x-2 ${isVeryLowStock ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-green-600'}`}
                    animate={isVeryLowStock ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ApperIcon name="CheckCircle" className={`h-5 w-5 ${isVeryLowStock ? 'text-red-500' : isLowStock ? 'text-orange-500' : 'text-green-500'}`} />
                    <span className="font-medium">
                      {isVeryLowStock ? `Only ${stockLeft} left - Order now!` : isLowStock ? `${stockLeft} left in stock` : `${stockLeft} available`}
                    </span>
                  </motion.div>
                ) : (
                  <>
                    <ApperIcon name="XCircle" className="h-5 w-5 text-red-500" />
                    <span className="text-red-700 font-medium">Out of Stock</span>
                  </>
                )}
              </div>
              {product.trending && (
                <Badge variant="trending" className="px-3 py-1">
                  🔥 Trending Now
                </Badge>
              )}
            </div>

            {/* Limited Time Offer Countdown */}
            {product.dealId && (
              <motion.div 
                className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Clock" className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-800">Limited Time Offer!</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                      {String(timeLeft.hours).padStart(2, '0')}h
                    </div>
                    <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                      {String(timeLeft.minutes).padStart(2, '0')}m
                    </div>
                    <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                      {String(timeLeft.seconds).padStart(2, '0')}s
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quantity Selector */}
            <QuantitySelector
              priceTiers={product.priceTiers}
              initialQuantity={1}
              onQuantityChange={setSelectedQuantity}
              onTierChange={setSelectedTier}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1"
              >
                <ApperIcon name="ShoppingCart" className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="secondary"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1"
              >
                <ApperIcon name="Zap" className="h-5 w-5 mr-2" />
                Buy Now
              </Button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Shield" className="h-5 w-5 text-primary-600" />
                <span className="text-sm text-gray-700">Freshness Guarantee</span>
              </div>
              <div className="flex items-center space-x-3">
                <ApperIcon name="Truck" className="h-5 w-5 text-primary-600" />
                <span className="text-sm text-gray-700">Same-day delivery available</span>
              </div>
              <div className="flex items-center space-x-3">
                <ApperIcon name="RotateCcw" className="h-5 w-5 text-primary-600" />
                <span className="text-sm text-gray-700">Easy returns within 24 hours</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((recommendedProduct, index) => (
                <ProductCard
                  key={recommendedProduct.Id}
                  product={recommendedProduct}
                  index={index}
                />
              ))}
</div>
          </motion.section>
        )}

        {/* Frequently Bought Together Section */}
        {frequentlyBoughtWith.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-2 mb-6">
              <ApperIcon name="Users" className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Frequently Bought Together</h2>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {frequentlyBoughtWith.map((item, index) => (
                  <motion.div
                    key={item.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.images?.[0] || "/placeholder-product.jpg"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                        <p className="text-primary-600 font-semibold">Rs.{item.priceTiers?.[0]?.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-blue-700 font-medium">Customers who bought this item also purchased these products</p>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;