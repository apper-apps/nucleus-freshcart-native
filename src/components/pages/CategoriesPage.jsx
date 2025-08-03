import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import categoryService from "@/services/api/categoryService";
import productService from "@/services/api/productService";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoryStats, setCategoryStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategoriesWithStats();
  }, []);

  const loadCategoriesWithStats = async () => {
    try {
      setLoading(true);
      setError("");
      
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);

      // Load product counts for each category
      const stats = {};
      for (const category of categoriesData) {
        const products = await productService.getByCategory(category.name);
        stats[category.name] = {
          count: products.length,
          featuredCount: products.filter(p => p.featured).length
        };
      }
      setCategoryStats(stats);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-6 pb-24 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-xl mb-4" />
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-6 pb-24 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={loadCategoriesWithStats} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-6 pb-24 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Shop by Category
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our wide selection of fresh products organized by category
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const stats = categoryStats[category.name] || { count: 0, featuredCount: 0 };
            
            return (
              <motion.div
                key={category.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="card card-hover cursor-pointer group"
                onClick={() => handleCategoryClick(category.name)}
              >
                {/* Category Image */}
                <div className="relative overflow-hidden rounded-t-xl">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-accent-100">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Overlay with icon */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white bg-opacity-0 group-hover:bg-opacity-90 rounded-full flex items-center justify-center transition-all duration-300">
                      <ApperIcon 
                        name={category.icon} 
                        className="h-8 w-8 text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                      />
                    </div>
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl flex items-center justify-center group-hover:from-primary-200 group-hover:to-accent-200 transition-all duration-300">
                      <ApperIcon 
                        name={category.icon} 
                        className="h-6 w-6 text-primary-600 group-hover:scale-110 transition-transform" 
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {stats.count} {stats.count === 1 ? "product" : "products"}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <ApperIcon name="Package" className="h-4 w-4" />
                      <span>{stats.count} items</span>
                    </div>
                    {stats.featuredCount > 0 && (
                      <div className="flex items-center space-x-1 text-secondary-600">
                        <ApperIcon name="Star" className="h-4 w-4" />
                        <span>{stats.featuredCount} featured</span>
                      </div>
                    )}
                  </div>

                  {/* Browse Button */}
                  <motion.div
                    className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center text-primary-600 font-medium text-sm">
                      <span>Browse {category.name}</span>
                      <ApperIcon name="ArrowRight" className="h-4 w-4 ml-1" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;