import { motion } from "framer-motion";

const Loading = ({ variant = "default" }) => {
  if (variant === "products") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === "deals") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <div className="animate-pulse">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4"></div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 8 }).map((_, imgIndex) => (
                  <div key={imgIndex} className="bg-gray-200 aspect-square rounded-md"></div>
                ))}
              </div>
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mt-4"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
      />
    </div>
  );
};

export default Loading;