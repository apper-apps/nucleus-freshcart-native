import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Product360Viewer = ({ images, productName, className = "" }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const containerRef = useRef(null);
  const startFrameRef = useRef(0);

  const totalFrames = images?.length || 1;
  const is360Mode = totalFrames > 1;

  // Preload images
  useEffect(() => {
    if (!images || images.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadedImages(0);

    const imagePromises = images.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => prev + 1);
          resolve(img);
        };
        img.onerror = reject;
        img.src = src;
      });
    });

    Promise.all(imagePromises)
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  }, [images]);

  const handleMouseDown = (e) => {
    if (!is360Mode) return;
    setIsDragging(true);
    setDragStart(e.clientX);
    startFrameRef.current = currentFrame;
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    if (!is360Mode) return;
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    startFrameRef.current = currentFrame;
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !is360Mode) return;
    
    const deltaX = e.clientX - dragStart;
    const sensitivity = 2; // Adjust rotation sensitivity
    const frameChange = Math.floor(deltaX / sensitivity);
    const newFrame = (startFrameRef.current + frameChange) % totalFrames;
    
    setCurrentFrame(newFrame < 0 ? totalFrames + newFrame : newFrame);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !is360Mode) return;
    
    const deltaX = e.touches[0].clientX - dragStart;
    const sensitivity = 2;
    const frameChange = Math.floor(deltaX / sensitivity);
    const newFrame = (startFrameRef.current + frameChange) % totalFrames;
    
    setCurrentFrame(newFrame < 0 ? totalFrames + newFrame : newFrame);
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const autoRotate = () => {
    if (!is360Mode || isRotating) return;
    
    setIsRotating(true);
    let frame = 0;
    const interval = setInterval(() => {
      frame = (frame + 1) % totalFrames;
      setCurrentFrame(frame);
      
      if (frame === 0) {
        clearInterval(interval);
        setIsRotating(false);
      }
    }, 100);
  };

  // Global mouse/touch event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();
    const handleGlobalTouchMove = (e) => handleTouchMove(e);
    const handleGlobalTouchEnd = () => handleTouchEnd();

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, dragStart, currentFrame]);

  if (!images || images.length === 0) {
    return (
      <div className={`aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center ${className}`}>
        <img
          src="/placeholder-product.jpg"
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Image Container */}
      <div 
        ref={containerRef}
        className={`aspect-square bg-gray-100 rounded-xl overflow-hidden relative ${
          is360Mode ? 'cursor-grab' : 'cursor-default'
        } ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="Loader2" className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Loading {loadedImages}/{totalFrames} images...
              </p>
            </div>
          </div>
        ) : (
          <motion.img
            key={currentFrame}
            src={images[currentFrame]}
            alt={`${productName} - View ${currentFrame + 1}`}
            className="w-full h-full object-cover select-none"
            draggable={false}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          />
        )}

        {/* 360° Indicator */}
        {is360Mode && !isLoading && (
          <div className="absolute top-4 left-4">
            <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <ApperIcon name="RotateCw" className="h-3 w-3" />
              <span>360°</span>
            </div>
          </div>
        )}

        {/* Rotation Progress */}
        {is360Mode && !isLoading && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/70 rounded-full px-3 py-1">
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(totalFrames, 12) }, (_, i) => {
                  const frameIndex = Math.floor((i / 12) * totalFrames);
                  const isActive = Math.abs(currentFrame - frameIndex) <= 1 || 
                    (currentFrame === 0 && frameIndex === totalFrames - 1) ||
                    (currentFrame === totalFrames - 1 && frameIndex === 0);
                  return (
                    <div
                      key={i}
                      className={`w-1 h-1 rounded-full transition-colors ${
                        isActive ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Auto-rotate button */}
        {is360Mode && !isLoading && !isRotating && (
          <button
            onClick={autoRotate}
            className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
            title="Auto rotate"
          >
            <ApperIcon name="Play" className="h-4 w-4" />
          </button>
        )}

        {/* Drag hint */}
        {is360Mode && !isLoading && !isDragging && currentFrame === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
              <ApperIcon name="MousePointer2" className="h-4 w-4" />
              <span>Drag to rotate</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {is360Mode && images.length > 1 && (
        <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentFrame(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                currentFrame === index
                  ? "border-primary-500"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Product360Viewer;