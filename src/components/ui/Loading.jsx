import { motion } from "framer-motion";

const Loading = ({ variant = "default", className = "" }) => {
  const variants = {
    default: (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    ),
    products: (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-lg animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    ),
    deals: (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-4 gap-2 mb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded" />
              ))}
            </div>
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  };

  return variants[variant] || variants.default;
};

export default Loading;