import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import productService from "@/services/api/productService";
import categoryService from "@/services/api/categoryService";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (query || category) {
      performSearch();
    } else {
      setProducts([]);
    }
  }, [query, category]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.search(query, category || null);
      setProducts(data);
    } catch (err) {
      setError("Failed to search products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery) => {
    const params = new URLSearchParams();
    if (newQuery) params.set("q", newQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    setSearchParams(params);
  };

  const handleCategoryFilter = (categoryName) => {
    setSelectedCategory(categoryName);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (categoryName) params.set("category", categoryName);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSearchParams(query ? { q: query } : {});
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-6 pb-24 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>
          <Loading variant="products" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-6 pb-24 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <SearchBar onSearch={handleSearch} />
          
          {/* Search Results Info */}
          {(query || category) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-gray-600">
                {products.length} results
                {query && ` for "${query}"`}
                {category && ` in ${category}`}
              </span>
              {(query || category) && (
                <button
                  onClick={clearFilters}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryFilter("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.Id}
                onClick={() => handleCategoryFilter(cat.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.name
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Search Results */}
        {error ? (
          <Error message={error} onRetry={performSearch} />
        ) : products.length === 0 && (query || category) ? (
          <Empty
            title="No products found"
            description={`Try adjusting your search terms${category ? " or removing category filter" : ""}`}
            actionText="Clear Search"
            onAction={() => {
              setSearchParams({});
              setSelectedCategory("");
            }}
            icon="Search"
          />
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Search" className="w-10 h-10 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Search for Products</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter a product name or browse by category to find fresh ingredients and deals
            </p>
          </motion.div>
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

export default SearchPage;