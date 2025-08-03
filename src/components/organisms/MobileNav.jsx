import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import useCart from "@/hooks/useCart";

const MobileNav = () => {
  const location = useLocation();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  const navItems = [
    { name: "Home", path: "/", icon: "Home" },
    { name: "Categories", path: "/categories", icon: "Grid3X3" },
    { name: "Cart", path: "/cart", icon: "ShoppingCart", badge: cartItemCount },
    { name: "Admin", path: "/admin", icon: "Settings" }
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden"
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                active
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-500 hover:text-primary-600"
              }`}
            >
              <div className="relative">
                <ApperIcon 
                  name={item.icon} 
                  className={`h-5 w-5 ${active ? "scale-110" : ""} transition-transform`}
                />
                {item.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center"
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </motion.span>
                )}
              </div>
              <span className={`text-xs font-medium mt-1 ${active ? "font-semibold" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MobileNav;