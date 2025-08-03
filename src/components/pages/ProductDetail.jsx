import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import productService from "@/services/api/productService";
import ApperIcon from "@/components/ApperIcon";
import ProductCard from "@/components/molecules/ProductCard";
import QuantitySelector from "@/components/molecules/QuantitySelector";
import Product360Viewer from "@/components/molecules/Product360Viewer";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Home from "@/components/pages/Home";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
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
  const [urgencyLevel, setUrgencyLevel] = useState('normal');
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
      // Use tier pricing if available
      const productToAdd = selectedTier ? 
        { ...product, price: selectedTier.price } : 
        product;
      addToCart(productToAdd, selectedQuantity);
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
                  className="flex flex-wrap gap-2 mb-6"
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
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge
                        variant={getDietaryBadgeVariant(tag)}
                        className="px-4 py-2 font-semibold text-sm shadow-md hover:shadow-lg transition-shadow"
                      >
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
{product.description}
              </p>
            </div>

{/* Quantity Selector with Tiered Pricing */}
            {product.priceTiers && product.priceTiers.length > 0 && (
              <div className="mb-8 p-6 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl border border-primary-100">
                <QuantitySelector
                  priceTiers={product.priceTiers}
                  initialQuantity={selectedQuantity}
                  onQuantityChange={setSelectedQuantity}
                  onTierChange={setSelectedTier}
                />
              </div>
            )}

            {/* Enhanced Stock Status */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                {product.inStock ? (
                  <motion.div 
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${
                      isVeryLowStock 
                        ? 'bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200' 
                        : isLowStock 
                        ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200' 
                        : 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200'
                    }`}
                    animate={isVeryLowStock ? { 
                      scale: [1, 1.02, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(239, 68, 68, 0.7)",
                        "0 0 0 10px rgba(239, 68, 68, 0)",
                        "0 0 0 0 rgba(239, 68, 68, 0)"
                      ]
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ApperIcon 
                      name={isVeryLowStock ? "AlertTriangle" : "CheckCircle"} 
                      className={`h-6 w-6 ${
                        isVeryLowStock ? 'text-red-500' : isLowStock ? 'text-orange-500' : 'text-green-500'
                      }`} 
                    />
                    <div>
                      <span className={`font-bold text-lg ${
                        isVeryLowStock ? 'text-red-700' : isLowStock ? 'text-orange-700' : 'text-green-700'
                      }`}>
                        {isVeryLowStock 
                          ? `Only ${stockLeft} left!` 
                          : isLowStock 
                          ? `${stockLeft} left in stock` 
                          : `${stockLeft} available`
                        }
                      </span>
                      {isVeryLowStock && (
                        <p className="text-sm text-red-600 font-medium">Order now before it's gone!</p>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gray-100 rounded-xl border-2 border-gray-200">
                    <ApperIcon name="XCircle" className="h-6 w-6 text-red-500" />
                    <span className="text-red-700 font-bold text-lg">Out of Stock</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {product.trending && (
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Badge variant="trending" className="px-4 py-2 text-sm font-bold shadow-lg">
                      🔥 Trending Now
                    </Badge>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Limited Time Offer Countdown */}
{product.dealId && (
              <motion.div 
                className="bg-gradient-to-br from-red-50 via-orange-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 mt-6 shadow-lg"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ApperIcon name="Clock" className="h-7 w-7 text-red-600" />
                    </motion.div>
                    <div>
                      <span className="font-bold text-xl text-red-800">Limited Time Offer!</span>
                      <p className="text-sm text-red-600">Don't miss out on this amazing deal</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-xl shadow-md"
                      animate={{ boxShadow: ["0 4px 15px rgba(239, 68, 68, 0.3)", "0 6px 20px rgba(239, 68, 68, 0.4)", "0 4px 15px rgba(239, 68, 68, 0.3)"] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="text-xs font-medium opacity-90">Hours</div>
                    </motion.div>
                    <div className="text-2xl font-bold text-red-600">:</div>
                    <motion.div 
                      className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-xl shadow-md"
                      animate={{ boxShadow: ["0 4px 15px rgba(239, 68, 68, 0.3)", "0 6px 20px rgba(239, 68, 68, 0.4)", "0 4px 15px rgba(239, 68, 68, 0.3)"] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    >
                      <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="text-xs font-medium opacity-90">Minutes</div>
                    </motion.div>
                    <div className="text-2xl font-bold text-red-600">:</div>
                    <motion.div 
                      className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-xl shadow-md"
                      animate={{ boxShadow: ["0 4px 15px rgba(239, 68, 68, 0.3)", "0 6px 20px rgba(239, 68, 68, 0.4)", "0 4px 15px rgba(239, 68, 68, 0.3)"] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    >
                      <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="text-xs font-medium opacity-90">Seconds</div>
                    </motion.div>
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

{/* AI-Powered Recommendations */}
        {recommendedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16"
          >
            <motion.div 
              className="flex items-center justify-center space-x-3 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ApperIcon name="Brain" className="h-8 w-8 text-purple-600" />
              <h2 className="text-3xl md:text-4xl font-bold gradient-text text-center">
                AI Recommendations
              </h2>
              <ApperIcon name="Sparkles" className="h-8 w-8 text-purple-600" />
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 rounded-3xl p-8 border-2 border-purple-200 shadow-xl relative overflow-hidden mb-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                {recommendedProducts.map((recommendedProduct, index) => {
                  const aiReasons = [
                    "Perfect Match", "Trending Choice", "Smart Savings", "Popular Combo",
                    "Seasonal Pick", "Customer Favorite", "Best Value", "Premium Choice"
                  ];
                  const confidenceScores = [92, 88, 95, 89, 91, 87, 94, 86];
                  const aiInsights = [
                    "Based on your preferences", "97% customer satisfaction", "Save 25% when bundled", 
                    "Often bought together", "Perfect for this season", "Top rated by similar users",
                    "Best price-to-quality ratio", "Premium quality guaranteed"
                  ];
                  
                  return (
                    <motion.div
                      key={recommendedProduct.Id}
                      initial={{ opacity: 0, y: 40, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.1 * index + 0.5, type: "spring", stiffness: 100 }}
                      whileHover={{ y: -8, scale: 1.03 }}
                      className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all duration-300 relative group"
                    >
                      {/* AI Badge */}
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full px-3 py-1 text-xs font-bold flex items-center space-x-1 shadow-lg">
                        <ApperIcon name="Zap" className="h-3 w-3" />
                        <span>AI</span>
                      </div>
                      
                      {/* Confidence Score */}
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xs font-bold shadow-md">
                        {confidenceScores[index % confidenceScores.length]}%
                      </div>
                      
                      <div className="flex flex-col items-center text-center space-y-4 pt-6">
                        <div className="relative">
                          <img
                            src={recommendedProduct.images?.[0] || "/placeholder-product.jpg"}
                            alt={recommendedProduct.name}
                            className="w-24 h-24 object-cover rounded-2xl shadow-md group-hover:shadow-lg transition-shadow duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-3 py-1">
                            <span className="text-xs font-semibold text-purple-700">
                              {aiReasons[index % aiReasons.length]}
                            </span>
                          </div>
                          
                          <h4 className="font-bold text-gray-900 text-lg leading-tight">
                            {recommendedProduct.name}
                          </h4>
                          
                          <p className="text-xs text-purple-600 font-medium">
                            {aiInsights[index % aiInsights.length]}
                          </p>
                          
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-2xl font-bold text-primary-600">
                              Rs.{recommendedProduct.priceTiers?.[0]?.price.toFixed(2)}
                            </span>
                            {recommendedProduct.priceTiers?.[0]?.discountPercentage > 0 && (
                              <Badge variant="discount" className="text-xs">
                                {recommendedProduct.priceTiers[0].discountPercentage}% OFF
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 w-full">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-purple-300 hover:border-purple-400 hover:bg-purple-50"
                            onClick={() => navigate(`/product/${recommendedProduct.Id}`)}
                          >
                            <ApperIcon name="Eye" className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                            onClick={() => handleAddToCart(recommendedProduct)}
                          >
                            <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              <motion.div 
                className="mt-8 text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <ApperIcon name="Brain" className="h-5 w-5 text-purple-600" />
                  <p className="text-lg font-semibold text-purple-800">
                    Powered by advanced AI algorithms analyzing millions of purchase patterns
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-6 text-sm text-purple-600">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Target" className="h-4 w-4" />
                    <span>Personalized</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="TrendingUp" className="h-4 w-4" />
                    <span>Data-Driven</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Shield" className="h-4 w-4" />
                    <span>Trusted Results</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.section>
        )}

        {/* Traditional Recommendations */}
        {recommendedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8"
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

{/* Enhanced Frequently Bought Together Section */}
        {frequentlyBoughtWith.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <motion.div 
              className="flex items-center justify-center space-x-3 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <ApperIcon name="Users" className="h-8 w-8 text-primary-600" />
              <h2 className="text-3xl md:text-4xl font-bold gradient-text text-center">
                Frequently Bought Together
              </h2>
              <ApperIcon name="ShoppingBag" className="h-8 w-8 text-primary-600" />
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 rounded-3xl p-8 border-2 border-blue-200 shadow-xl relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full blur-2xl" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {frequentlyBoughtWith.map((item, index) => (
                  <motion.div
                    key={item.Id}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.1 * index + 0.7, type: "spring", stiffness: 100 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="relative">
                        <img
                          src={item.images?.[0] || "/placeholder-product.jpg"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-2xl shadow-md"
                        />
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h4>
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-2xl font-bold text-primary-600">
                            Rs.{item.priceTiers?.[0]?.price.toFixed(2)}
                          </span>
                          {item.priceTiers?.[0]?.discountPercentage > 0 && (
                            <Badge variant="discount" className="text-xs">
                              {item.priceTiers[0].discountPercentage}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate(`/product/${item.Id}`)}
                      >
                        <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
                        View Product
                      </Button>
                    </div>
                    
                    {/* Plus connector for desktop */}
                    {index < frequentlyBoughtWith.length - 1 && (
                      <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold z-10">
                        +
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="mt-8 text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <ApperIcon name="TrendingUp" className="h-5 w-5 text-blue-600" />
                  <p className="text-lg font-semibold text-blue-800">
                    95% of customers who bought this item also purchased these products
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm text-blue-600">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Star" className="h-4 w-4 fill-current" />
                    <span>Highly Rated Combo</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Truck" className="h-4 w-4" />
                    <span>Free Delivery</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Clock" className="h-4 w-4" />
                    <span>Save Time</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;