import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import QuantitySelector from "@/components/molecules/QuantitySelector";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import productService from "@/services/api/productService";
import useCart from "@/hooks/useCart";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      loadProduct();
      loadRecommendedProducts();
    }
  }, [id]);

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
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={product.images?.[selectedImageIndex] || "/placeholder-product.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-primary-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <>
                  <ApperIcon name="CheckCircle" className="h-5 w-5 text-green-500" />
                  <span className="text-green-700 font-medium">In Stock</span>
                </>
              ) : (
                <>
                  <ApperIcon name="XCircle" className="h-5 w-5 text-red-500" />
                  <span className="text-red-700 font-medium">Out of Stock</span>
                </>
              )}
            </div>

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
      </div>
    </div>
  );
};

export default ProductDetail;