import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import productService from "@/services/api/productService";
import ApperIcon from "@/components/ApperIcon";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";

const FeaturedProducts = ({ isAdmin = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [showManageMode, setShowManageMode] = useState(false);
  const carouselRef = useRef(null);

  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 4
  };

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getFeatured();
      setProducts(data);
    } catch (err) {
      setError("Failed to load featured products");
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (products.length === 0) return;
    const maxIndex = Math.max(0, products.length - itemsPerView.desktop);
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const goToSlide = (index) => {
    const maxIndex = Math.max(0, products.length - itemsPerView.desktop);
    setCurrentIndex(Math.min(index, maxIndex));
  };

  // Drag and Drop Handlers for Admin
  const handleDragStart = (e, product, index) => {
    if (!isAdmin || !showManageMode) return;
    setIsDragging(true);
    setDraggedItem({ product, index });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    if (!isAdmin || !showManageMode) return;
    setIsDragging(false);
    setDraggedItem(null);
    e.target.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    if (!isAdmin || !showManageMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetIndex) => {
    if (!isAdmin || !showManageMode || !draggedItem) return;
    e.preventDefault();
    
    const { index: sourceIndex } = draggedItem;
    if (sourceIndex === targetIndex) return;

    try {
      const newProducts = [...products];
      const [movedProduct] = newProducts.splice(sourceIndex, 1);
      newProducts.splice(targetIndex, 0, movedProduct);
      
      setProducts(newProducts);
      
      // Update order in service
      await productService.setFeaturedOrder(newProducts.map(p => p.Id));
      toast.success("Featured products order updated!");
    } catch (error) {
      toast.error("Failed to update product order");
      loadFeaturedProducts(); // Reload on error
    }
  };

  const toggleManageMode = () => {
    setShowManageMode(!showManageMode);
  };

if (loading) {
    return (
      <section className="py-12">
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
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={loadFeaturedProducts} />
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Empty
            title="No Featured Products"
            description={isAdmin ? "Add products and mark them as featured to display in the carousel" : "Check back soon for our featured products and special deals"}
            icon="Star"
          />
          {isAdmin && (
            <div className="text-center mt-6">
              <Button onClick={() => window.location.href = '/admin'}>
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Add Featured Products
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }

  const canNavigate = products.length > itemsPerView.desktop;
  const maxIndex = Math.max(0, products.length - itemsPerView.desktop);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ApperIcon name="Star" className="h-8 w-8 text-secondary-500 fill-current" />
            <h2 className="text-3xl font-bold gradient-text">
              Featured Products
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Discover our handpicked selection of premium fresh products, carefully chosen for quality and taste
          </p>
          
          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant={showManageMode ? "default" : "outline"}
                size="sm"
                onClick={toggleManageMode}
              >
                <ApperIcon name={showManageMode ? "Check" : "Settings"} className="h-4 w-4 mr-2" />
                {showManageMode ? "Done Managing" : "Manage Order"}
              </Button>
              {showManageMode && (
                <p className="text-sm text-gray-600">
                  Drag and drop products to reorder the carousel
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {canNavigate && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow-lg bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ApperIcon name="ChevronLeft" className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow-lg bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ApperIcon name="ChevronRight" className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Products Carousel */}
          <div className="overflow-hidden" ref={carouselRef}>
            <motion.div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView.desktop)}%)`
              }}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.Id}
                  className={`flex-shrink-0 px-3 ${
                    showManageMode && isAdmin ? 'cursor-move' : ''
                  }`}
                  style={{ width: `${100 / itemsPerView.desktop}%` }}
                  draggable={showManageMode && isAdmin}
                  onDragStart={(e) => handleDragStart(e, product, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`relative ${
                    showManageMode && isAdmin ? 'ring-2 ring-primary-200 ring-offset-2 rounded-lg' : ''
                  }`}>
                    {showManageMode && isAdmin && (
                      <div className="absolute -top-2 -right-2 z-10 bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    )}
                    <ProductCard
                      product={product}
                      index={index}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Carousel Indicators */}
          {canNavigate && (
            <div className="flex justify-center space-x-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    currentIndex === index
                      ? 'bg-primary-500 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Manage Mode Instructions */}
        <AnimatePresence>
          {showManageMode && isAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="flex items-center justify-center space-x-2 text-blue-800">
                <ApperIcon name="Info" className="h-4 w-4" />
                <p className="text-sm font-medium">
                  Drag and drop the numbered products to reorder how they appear in the carousel. Changes are saved automatically.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturedProducts;