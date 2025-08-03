import { cn } from "@/utils/cn";

const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800",
    secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800",
    error: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
    discount: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-semibold",
    vegan: "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200",
    organic: "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border border-emerald-200",
    vegetarian: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200",
    halal: "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border border-purple-200",
    glutenFree: "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 border border-orange-200",
    trending: "bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold animate-pulse",
    lowStock: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 font-semibold animate-pulse"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;