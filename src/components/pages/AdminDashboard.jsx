import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import AdminProductForm from "@/components/organisms/AdminProductForm";
import AdminProductList from "@/components/organisms/AdminProductList";
import FeaturedCarouselManager from "@/components/organisms/FeaturedCarouselManager";
import FeaturedProducts from "@/components/organisms/FeaturedProducts";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [showAddProduct, setShowAddProduct] = useState(false);

const tabs = [
    { id: "products", name: "Products", icon: "Package" },
    { id: "featured", name: "Featured Carousel", icon: "Star" },
    { id: "deals", name: "Deals", icon: "Zap" },
    { id: "analytics", name: "Analytics", icon: "BarChart3" }
  ];

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
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your products, deals, and analytics
            </p>
          </div>

          {activeTab === "products" && (
            <Button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="mt-4 sm:mt-0"
            >
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              {showAddProduct ? "Cancel" : "Add Product"}
            </Button>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border-b border-gray-200 mb-8"
        >
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <ApperIcon name={tab.icon} className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === "products" && (
            <div className="space-y-8">
              {showAddProduct && (
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Add New Product
                  </h2>
                  <AdminProductForm
                    onSuccess={() => {
                      setShowAddProduct(false);
                      // Refresh product list
                    }}
                    onCancel={() => setShowAddProduct(false)}
                  />
                </div>
              )}
              <AdminProductList />
            </div>
)}

          {activeTab === "featured" && (
            <div className="space-y-8">
              {/* Featured Carousel Preview */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Carousel Preview
                </h2>
                <FeaturedProducts isAdmin={true} />
              </div>
              
              {/* Carousel Management */}
              <FeaturedCarouselManager />
            </div>
          )}

          {activeTab === "deals" && (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Zap" className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Deals Management
              </h3>
              <p className="text-gray-600 mb-6">
                Deal management features coming soon. Currently, deals are managed through the product assignment system.
              </p>
              <Button variant="outline">
                <ApperIcon name="Settings" className="h-4 w-4 mr-2" />
                Configure Deals
              </Button>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample Analytics Cards */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Total Products</h3>
                  <ApperIcon name="Package" className="h-8 w-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">142</div>
                <p className="text-sm text-gray-600">+12 this month</p>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Active Deals</h3>
                  <ApperIcon name="Zap" className="h-8 w-8 text-secondary-600" />
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">4</div>
                <p className="text-sm text-gray-600">2 expiring soon</p>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Featured Items</h3>
                  <ApperIcon name="Star" className="h-8 w-8 text-accent-600" />
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">8</div>
                <p className="text-sm text-gray-600">Currently showcased</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;