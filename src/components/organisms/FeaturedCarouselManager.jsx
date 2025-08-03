import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import productService from "@/services/api/productService";
import { toast } from "react-toastify";

const FeaturedCarouselManager = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const [all, featured] = await Promise.all([
        productService.getAll(),
        productService.getFeatured()
      ]);
      setAllProducts(all);
      setFeaturedProducts(featured);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (product) => {
    try {
      const updatedProduct = await productService.update(product.Id, {
        featured: !product.featured
      });
      
      toast.success(`${product.name} ${!product.featured ? 'added to' : 'removed from'} featured carousel`);
      loadProducts();
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProducts} />;
  }

  return (
    <div className="space-y-8">
      {/* Current Featured Products */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Current Featured Products ({featuredProducts.length})
          </h3>
          <Badge variant="primary">
            Carousel Order
          </Badge>
        </div>
        
        {featuredProducts.length === 0 ? (
          <Empty
            title="No Featured Products"
            description="Select products below to add them to the featured carousel"
            icon="Star"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
              >
                <div className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex items-center space-x-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {product.category}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFeatured(product)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <ApperIcon name="X" className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* All Products */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            All Products ({allProducts.length})
          </h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const isFeatured = featuredProducts.some(fp => fp.Id === product.Id);
            
            return (
              <motion.div
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 border rounded-lg transition-all ${
                  isFeatured 
                    ? 'border-primary-300 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {product.category}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-medium text-gray-900">
                        Rs. {product.priceTiers[0].price}
                      </span>
                      {isFeatured && (
                        <Badge variant="primary" size="sm">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={isFeatured ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleFeatured(product)}
                  >
                    <ApperIcon 
                      name={isFeatured ? "Star" : "Plus"} 
                      className="h-4 w-4 mr-1" 
                    />
                    {isFeatured ? "Remove" : "Add"}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && searchTerm && (
          <Empty
            title="No products found"
            description={`No products match "${searchTerm}"`}
            icon="Search"
          />
        )}
      </div>
    </div>
  );
};

export default FeaturedCarouselManager;