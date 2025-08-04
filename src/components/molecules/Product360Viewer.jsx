import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Product360Viewer = ({ images = [], productName = "", className = "" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const containerRef = useRef(null);

  // Parse images if it's a string
  const parsedImages = (() => {
    if (typeof images === 'string') {
      try {
        return images.split(',').map(img => img.trim()).filter(img => img);
      } catch (e) {
        return [images];
      }
    }
    return Array.isArray(images) ? images : [];
  })();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseDown = (e) => {
    if (parsedImages.length <= 1) return;
    setIsDragging(true);
    setDragStart(e.clientX);
    setShowHint(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || parsedImages.length <= 1) return;
    
    const diff = e.clientX - dragStart;
    const sensitivity = 10;
    
    if (Math.abs(diff) > sensitivity) {
      const direction = diff > 0 ? -1 : 1;
      const newIndex = (currentImageIndex + direction + parsedImages.length) % parsedImages.length;
      setCurrentImageIndex(newIndex);
      setDragStart(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (parsedImages.length <= 1) return;
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    setShowHint(false);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || parsedImages.length <= 1) return;
    
    const diff = e.touches[0].clientX - dragStart;
    const sensitivity = 15;
    
    if (Math.abs(diff) > sensitivity) {
      const direction = diff > 0 ? -1 : 1;
      const newIndex = (currentImageIndex + direction + parsedImages.length) % parsedImages.length;
      setCurrentImageIndex(newIndex);
      setDragStart(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (parsedImages.length === 0) {
    return (
      <div className={`aspect-square bg-gray-100 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <ApperIcon name="Image" className="h-16 w-16 mx-auto mb-2" />
          <p className="text-sm">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`product-360-viewer relative select-none ${className}`}>
      <div
        ref={containerRef}
        className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={parsedImages[currentImageIndex] || "/placeholder-product.jpg"}
          alt={`${productName} - View ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-100"
          draggable={false}
        />

        {/* Drag Hint */}
        {showHint && parsedImages.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="product-360-drag-hint"
          >
            <div className="text-center text-white">
              <motion.div
                animate={{ x: [-10, 10, -10] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center justify-center space-x-2 mb-2"
              >
                <ApperIcon name="MousePointer" className="h-6 w-6" />
                <span className="text-sm font-medium">Drag to rotate</span>
              </motion.div>
              <div className="text-xs opacity-75">{parsedImages.length} views available</div>
            </div>
          </motion.div>
        )}

        {/* Controls */}
        {parsedImages.length > 1 && (
          <div className="product-360-controls">
            <div className="product-360-progress">
              {parsedImages.map((_, index) => (
                <div
                  key={index}
                  className={`product-360-dot ${
                    index === currentImageIndex ? 'active' : 'inactive'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {parsedImages.length > 1 && (
        <>
          <button
            onClick={() => setCurrentImageIndex((prev) => 
              (prev - 1 + parsedImages.length) % parsedImages.length
            )}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <ApperIcon name="ChevronLeft" className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setCurrentImageIndex((prev) => 
              (prev + 1) % parsedImages.length
            )}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <ApperIcon name="ChevronRight" className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Image Counter */}
      {parsedImages.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {currentImageIndex + 1} / {parsedImages.length}
        </div>
      )}
    </div>
  );
};

export default Product360Viewer;