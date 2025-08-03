import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import categoryService from "@/services/api/categoryService";
import productService from "@/services/api/productService";
import { useNavigate } from "react-router-dom";

const CategoryNav = () => {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [topProducts, setTopProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);

      // Load top products for each category
      const productsData = {};
      for (const category of categoriesData) {
        const products = await productService.getByCategory(category.name);
        productsData[category.name] = products.slice(0, 3);
      }
      setTopProducts(productsData);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center space-x-4 overflow-x-auto pb-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex-shrink-0">
            <div className="w-20 h-20 bg-gray-200 rounded-xl animate-pulse" />
            <div className="w-16 h-3 bg-gray-200 rounded mt-2 mx-auto animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-center space-x-4 overflow-x-auto pb-2 px-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 relative"
            onMouseEnter={() => setHoveredCategory(category.name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category.name)}
              className="flex flex-col items-center p-3 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 group min-w-[80px]"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl flex items-center justify-center mb-2 group-hover:from-primary-200 group-hover:to-accent-200 transition-all duration-300">
                <ApperIcon 
                  name={category.icon} 
                  className="h-6 w-6 text-primary-600 group-hover:scale-110 transition-transform" 
                />
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-primary-600 transition-colors text-center">
                {category.name}
              </span>
            </motion.button>

            {/* Hover Preview */}
            {hoveredCategory === category.name && topProducts[category.name]?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
              >
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 min-w-[280px]">
                  <h4 className="font-semibold text-gray-900 mb-3 text-center">
                    Top {category.name}
                  </h4>
                  <div className="space-y-2">
                    {topProducts[category.name].map((product) => (
                      <motion.div
                        key={product.Id}
                        whileHover={{ x: 5 }}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/product/${product.Id}`)}
                      >
                        <img
                          src={product.images?.[0] || "/placeholder-product.jpg"}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-primary-600 font-semibold">
                            Rs.{product.priceTiers?.[0]?.price.toFixed(2)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;