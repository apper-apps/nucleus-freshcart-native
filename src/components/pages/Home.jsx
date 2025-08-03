import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import DealsShowcase from "@/components/organisms/DealsShowcase";
import FeaturedProducts from "@/components/organisms/FeaturedProducts";
import CategoryNav from "@/components/molecules/CategoryNav";
import ProductCard from "@/components/molecules/ProductCard";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import productService from "@/services/api/productService";
const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Fresh Food</span>
              <br />
              <span className="text-gray-900">Delivered Daily</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover premium fresh products with amazing bulk discounts. 
              The more you buy, the more you save on quality ingredients.
            </p>
            
            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center space-x-3 p-4 bg-white/70 backdrop-blur-sm rounded-xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="Truck" className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Fresh Daily</h3>
                  <p className="text-sm text-gray-600">Delivered same day</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center space-x-3 p-4 bg-white/70 backdrop-blur-sm rounded-xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="Percent" className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Bulk Savings</h3>
                  <p className="text-sm text-gray-600">Up to 30% off</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center space-x-3 p-4 bg-white/70 backdrop-blur-sm rounded-xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="Shield" className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Quality Guarantee</h3>
                  <p className="text-sm text-gray-600">100% satisfaction</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Category Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
              Shop by Category
            </h2>
            <CategoryNav />
          </motion.div>
        </div>
      </section>

      {/* Deals Showcase */}
      <DealsShowcase />

      {/* Featured Products */}
<FeaturedProducts />

      {/* Hot Deals Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <ApperIcon name="Flame" className="h-8 w-8 text-red-500" />
            <h2 className="text-4xl font-bold gradient-text">Hot Deals</h2>
            <ApperIcon name="Flame" className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Limited time offers that won't last long
          </p>
          
          {/* Countdown Timer */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg">
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs">Hours</div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg">
              <div className="text-2xl font-bold">34</div>
              <div className="text-xs">Minutes</div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg">
              <div className="text-2xl font-bold">56</div>
              <div className="text-xs">Seconds</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Recommended Products Section */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-primary-50 to-accent-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <ApperIcon name="Sparkles" className="h-8 w-8 text-primary-600" />
            <h2 className="text-4xl font-bold gradient-text">AI Recommended For You</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Personalized picks based on your preferences and shopping history
          </p>
        </motion.div>
        
        <div className="text-center">
          <Button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700">
            <ApperIcon name="Brain" className="h-5 w-5 mr-2" />
            View All Recommendations
          </Button>
        </div>
      </section>

      {/* Seasonal Offers Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <ApperIcon name="Sun" className="h-8 w-8 text-secondary-600" />
            <h2 className="text-4xl font-bold gradient-text">Seasonal Offers</h2>
            <ApperIcon name="Snowflake" className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Weather-based promotions and seasonal favorites
          </p>
          
          {/* Weather-based Promotion Card */}
          <div className="max-w-md mx-auto mt-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <ApperIcon name="CloudRain" className="h-6 w-6" />
              <span className="font-semibold">Rainy Day Special</span>
            </div>
            <p className="text-blue-100 mb-4">It's raining! Enjoy 25% off on hot beverages and comfort food</p>
            <Badge className="bg-white text-blue-600 font-semibold">
              Weather-Based Offer
            </Badge>
          </div>
        </motion.div>
      </section>
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-accent-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              Start Saving on Fresh Food Today
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of customers who save more by buying fresh products in bulk
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <ApperIcon name="ShoppingCart" className="inline h-5 w-5 mr-2" />
                Shop Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all"
              >
                <ApperIcon name="Info" className="inline h-5 w-5 mr-2" />
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;