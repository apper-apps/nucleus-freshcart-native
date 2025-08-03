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
      <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
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
    <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ApperIcon name="TrendingUp" className="h-8 w-8 text-red-500" />
            <h2 className="text-3xl font-bold gradient-text">
              Trending in Your Area
            </h2>
            <ApperIcon name="MapPin" className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Popular products that are flying off the shelves in your neighborhood
          </p>
          
          {/* Location indicator */}
          <div className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-red-200">
            <ApperIcon name="MapPin" className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Popular in Downtown Area</span>
          </div>
        </motion.div>

        {/* Trending Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product, index) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard
                product={product}
                index={index}
              />
            </motion.div>
          ))}
        </div>

        {/* Trending Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full">
            <ApperIcon name="Flame" className="h-5 w-5" />
            <span className="font-semibold">Updated every hour based on local demand</span>
            <ApperIcon name="Flame" className="h-5 w-5" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingSection;