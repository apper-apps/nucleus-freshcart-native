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

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      const updatedProduct = await productService.update(product.Id, {
        featured: !product.featured
      });
      
      setProducts(prev => 
        prev.map(p => p.Id === product.Id ? updatedProduct : p)
      );
      
      toast.success(`Product ${updatedProduct.featured ? "featured" : "unfeatured"} successfully`);
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleToggleStock = async (product) => {
    try {
      const updatedProduct = await productService.update(product.Id, {
        inStock: !product.inStock
      });
      
      setProducts(prev => 
        prev.map(p => p.Id === product.Id ? updatedProduct : p)
      );
      
      toast.success(`Product marked as ${updatedProduct.inStock ? "in stock" : "out of stock"}`);
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      await productService.delete(product.Id);
      setProducts(prev => prev.filter(p => p.Id !== product.Id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        <Loading />
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadProducts} />;
  }

  if (products.length === 0) {
    return (
      <Empty
        title="No products yet"
        description="Start by adding your first product to the catalog"
        actionText="Add Product"
        icon="Package"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Product Catalog ({products.length} items)
        </h2>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card p-6"
          >
            <div className="flex items-start space-x-4">
              {/* Product Image */}
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={product.images?.[0] || "/placeholder-product.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* Badges */}
                    <div className="flex items-center space-x-2 mt-3">
                      <Badge variant="default">{product.category}</Badge>
                      {product.featured && (
                        <Badge variant="secondary">
                          <ApperIcon name="Star" className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge variant={product.inStock ? "success" : "error"}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>

                    {/* Price Tiers */}
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Price Tiers:</p>
                      <div className="flex flex-wrap gap-2">
                        {product.priceTiers?.map((tier, tierIndex) => (
                          <div
                            key={tierIndex}
                            className="text-xs bg-gray-100 px-2 py-1 rounded"
                          >
                            {tier.minQuantity}+: Rs.{tier.price.toFixed(2)}
                            {tier.discountPercentage > 0 && (
                              <span className="text-green-600 ml-1">
                                ({tier.discountPercentage}% off)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFeatured(product)}
                      className={product.featured ? "text-secondary-600" : ""}
                    >
                      <ApperIcon name="Star" className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStock(product)}
                      className={product.inStock ? "text-green-600" : "text-red-600"}
                    >
                      <ApperIcon name={product.inStock ? "CheckCircle" : "XCircle"} className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProduct(product)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductList;