import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import categoryService from "@/services/api/categoryService";

const CategoryNav = ({ activeCategory = null }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
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
      <div className="flex space-x-2 overflow-x-auto">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex-shrink-0 w-20 h-8 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      <button
        onClick={() => navigate('/categories')}
        className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !activeCategory
            ? 'bg-primary-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <ApperIcon name="Grid3X3" className="h-4 w-4" />
        <span>All</span>
      </button>
      
      {categories.map((category, index) => (
        <motion.button
          key={category.Id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => handleCategoryClick(category.Name)}
          className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category.Name
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ApperIcon name={category.icon} className="h-4 w-4" />
          <span>{category.Name}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryNav;