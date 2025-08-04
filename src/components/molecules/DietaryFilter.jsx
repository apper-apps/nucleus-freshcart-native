import { useState } from "react";
import Badge from "@/components/atoms/Badge";

const DietaryFilter = ({ filters = [], onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const availableFilters = [
    { id: 'vegan', label: 'Vegan', variant: 'vegan' },
    { id: 'organic', label: 'Organic', variant: 'organic' },
    { id: 'vegetarian', label: 'Vegetarian', variant: 'vegetarian' },
    { id: 'halal', label: 'Halal', variant: 'halal' },
    { id: 'glutenFree', label: 'Gluten-Free', variant: 'glutenFree' }
  ];

  const handleFilterToggle = (filterId) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(f => f !== filterId)
      : [...selectedFilters, filterId];
    
    setSelectedFilters(newFilters);
    onFilterChange && onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {availableFilters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => handleFilterToggle(filter.id)}
          className={`transition-all duration-200 ${
            selectedFilters.includes(filter.id) ? 'scale-105' : 'hover:scale-105'
          }`}
        >
          <Badge
            variant={selectedFilters.includes(filter.id) ? filter.variant : 'default'}
            className={`cursor-pointer ${
              selectedFilters.includes(filter.id) 
                ? 'ring-2 ring-offset-1 ring-primary-300' 
                : 'hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </Badge>
        </button>
      ))}
    </div>
  );
};

export default DietaryFilter;