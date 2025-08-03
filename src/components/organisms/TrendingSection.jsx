import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import productService from "@/services/api/productService";
import ApperIcon from "@/components/ApperIcon";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const TrendingSection = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTrendingProducts();
  }, []);

  const loadTrendingProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getTrending();
      setTrendingProducts(data.slice(0, 4)); // Show max 4 trending products
    } catch (err) {
      setError("Failed to load trending products");
    } finally {
      setLoading(false);
    }
  };

if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              className="flex items-center justify-center space-x-2 mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="h-8 w-8 bg-red-200 rounded animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
              <div className="h-8 w-8 bg-red-200 rounded animate-pulse" />
            </motion.div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-red-100 rounded-full w-48 mx-auto animate-pulse" />
          </div>
          <Loading variant="products" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={loadTrendingProducts} />
        </div>
      </section>
    );
  }

  if (trendingProducts.length === 0) {
    return (
      <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Empty
            title="No Trending Products"
            description="Check back soon to see what's popular in your area"
            icon="TrendingUp"
          />
        </div>
      </section>
    );
  }

return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-red-400 to-orange-400 rounded-full blur-3xl transform -translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400 to-red-400 rounded-full blur-3xl transform translate-x-32 translate-y-32" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div 
            className="flex items-center justify-center space-x-3 mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ApperIcon name="TrendingUp" className="h-10 w-10 text-red-500" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">
              Trending in Your Area
            </h2>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ApperIcon name="MapPin" className="h-10 w-10 text-red-500" />
            </motion.div>
          </motion.div>
          
          <motion.p 
            className="text-xl text-gray-700 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Popular products that are flying off the shelves in your neighborhood
          </motion.p>
          
          {/* Enhanced Location indicator */}
          <motion.div 
            className="inline-flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-md rounded-full border-2 border-red-200 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <ApperIcon name="MapPin" className="h-5 w-5 text-red-600" />
            <span className="text-base font-semibold text-red-800">Popular in Downtown Area</span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </motion.div>
        </motion.div>

        {/* Trending Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingProducts.map((product, index) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="relative"
            >
              {/* Trending Badge */}
              <motion.div
                className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.15 + 0.5 }}
              >
                🔥 #{index + 1}
              </motion.div>
              <ProductCard
                product={product}
                index={index}
              />
            </motion.div>
          ))}
        </div>

        {/* Enhanced Trending Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <motion.div 
              className="inline-flex items-center space-x-4 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              animate={{ boxShadow: ["0 10px 30px rgba(239, 68, 68, 0.3)", "0 15px 40px rgba(239, 68, 68, 0.4)", "0 10px 30px rgba(239, 68, 68, 0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ApperIcon name="Flame" className="h-6 w-6" />
              <span className="font-bold text-lg">Updated every hour</span>
              <ApperIcon name="Flame" className="h-6 w-6" />
            </motion.div>
            
            <motion.div 
              className="inline-flex items-center space-x-3 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full border-2 border-orange-200 text-orange-800"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <ApperIcon name="Users" className="h-5 w-5" />
              <span className="font-semibold">Based on local demand</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingSection;