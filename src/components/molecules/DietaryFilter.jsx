import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const DietaryFilter = ({ onFilterChange, selectedFilters = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dietaryOptions = [
    { id: 'vegan', label: 'Vegan', icon: 'Leaf', color: 'vegan' },
    { id: 'vegetarian', label: 'Vegetarian', icon: 'Sprout', color: 'vegetarian' },
    { id: 'organic', label: 'Organic', icon: 'Sparkles', color: 'organic' },
    { id: 'halal', label: 'Halal', icon: 'Award', color: 'halal' },
    { id: 'glutenFree', label: 'Gluten-Free', icon: 'Shield', color: 'glutenFree' }
  ];

  const handleFilterToggle = (filterId) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(id => id !== filterId)
      : [...selectedFilters, filterId];
    
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange([]);
  };

  return (
    <div className="relative">
      {/* Filter Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-primary-200 hover:border-primary-300 rounded-full"
      >
        <ApperIcon name="Filter" className="h-4 w-4" />
        <span className="font-medium">Dietary Preferences</span>
        {selectedFilters.length > 0 && (
          <Badge variant="primary" className="ml-2 px-2 py-0.5 text-xs">
            {selectedFilters.length}
          </Badge>
        )}
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          className="h-4 w-4 ml-1" 
        />
      </Button>

      {/* Filter Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filter by Diet</h3>
                {selectedFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {dietaryOptions.map((option) => (
                  <motion.div
                    key={option.id}
                    whileHover={{ x: 2 }}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedFilters.includes(option.id)
                        ? 'bg-primary-50 border border-primary-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleFilterToggle(option.id)}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedFilters.includes(option.id)
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedFilters.includes(option.id) && (
                        <ApperIcon name="Check" className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <ApperIcon name={option.icon} className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">{option.label}</span>
                    <Badge variant={option.color} className="ml-auto text-xs px-2 py-0.5">
                      Popular
                    </Badge>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Filter products based on your dietary preferences and lifestyle choices
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Filters Display */}
      {selectedFilters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mt-3"
        >
          {selectedFilters.map((filterId) => {
            const option = dietaryOptions.find(opt => opt.id === filterId);
            return option ? (
              <Badge
                key={filterId}
                variant={option.color}
                className="flex items-center space-x-1 px-3 py-1 cursor-pointer"
                onClick={() => handleFilterToggle(filterId)}
              >
                <span>{option.label}</span>
                <ApperIcon name="X" className="h-3 w-3 ml-1 hover:text-red-600" />
              </Badge>
            ) : null;
          })}
        </motion.div>
      )}
    </div>
  );
};

export default DietaryFilter;