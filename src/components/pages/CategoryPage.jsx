import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import productService from "@/services/api/productService";

const CategoryPage = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "name");

  useEffect(() => {
    if (category) {
      loadProducts();
    }
  }, [category, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const decodedCategory = decodeURIComponent(category);
      const data = await productService.getByCategory(decodedCategory);
      
      // Sort products
      const sortedData = sortProducts(data, sortBy);
      setProducts(sortedData);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (products, sortType) => {
    switch (sortType) {
      case "price-low":
        return [...products].sort((a, b) => a.priceTiers[0].price - b.priceTiers[0].price);
      case "price-high":
        return [...products].sort((a, b) => b.priceTiers[0].price - a.priceTiers[0].price);
      case "featured":
        return [...products].sort((a, b) => b.featured - a.featured);
      case "name":
      default:
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.set("sort", newSort);
      return params;
    });
  };

  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "featured", label: "Featured First" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-6 pb-24 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8 animate-pulse" />
          <Loading variant="products" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-6 pb-24 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={loadProducts} />
        </div>
      </div>
    );
  }

  const decodedCategory = decodeURIComponent(category);

  return (
    <div className="min-h-screen pt-6 pb-24 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              {decodedCategory}
            </h1>
            <p className="text-gray-600">
              {products.length} {products.length === 1 ? "product" : "products"} available
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <ApperIcon name="ArrowUpDown" className="h-4 w-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Empty
            title={`No ${decodedCategory} Found`}
            description="Check back soon for new products in this category"
            actionText="Browse All Categories"
            onAction={() => window.history.back()}
            icon="Package"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.Id}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;