import { motion } from "framer-motion";
import DealsShowcase from "@/components/organisms/DealsShowcase";
import FeaturedProducts from "@/components/organisms/FeaturedProducts";
import CategoryNav from "@/components/molecules/CategoryNav";
import ApperIcon from "@/components/ApperIcon";

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