import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Empty from "@/components/ui/Empty";
import useCart from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    // Simulate checkout process
    setTimeout(() => {
      toast.success("Order placed successfully! Thank you for your purchase.");
      clearCart();
      navigate("/");
      setIsProcessing(false);
    }, 2000);
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-6 pb-24 md:pb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Empty
            title="Your cart is empty"
            description="Add some fresh products to get started with your order"
            actionText="Continue Shopping"
            onAction={handleContinueShopping}
            icon="ShoppingCart"
          />
        </div>
      </div>
    );
  }

  const totalSavings = cartItems.reduce((savings, item) => {
    const baseTier = item.product.priceTiers.find(t => t.minQuantity === 1);
    const priceDiff = baseTier.price - item.selectedTier.price;
    return savings + (priceDiff * item.quantity);
  }, 0);

  return (
    <div className="min-h-screen pt-6 pb-24 md:pb-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.images?.[0] || "/placeholder-product.jpg"}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {item.product.category}
                    </p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-lg font-bold text-primary-600">
                        Rs.{item.selectedTier.price.toFixed(2)} each
                      </span>
                      {item.selectedTier.discountPercentage > 0 && (
                        <Badge variant="discount" className="text-xs">
                          {item.selectedTier.discountPercentage}% OFF
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="h-10 w-10 p-0 rounded-none"
                      >
                        <ApperIcon name="Minus" className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="h-10 w-10 p-0 rounded-none"
                      >
                        <ApperIcon name="Plus" className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">
                    {item.quantity} × Rs.{item.selectedTier.price.toFixed(2)}
                  </span>
                  <span className="text-lg font-bold gradient-text">
                    Rs.{(item.selectedTier.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rs.{getCartTotal().toFixed(2)}</span>
                </div>
                
                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Bulk Savings</span>
                    <span className="font-medium">-Rs.{totalSavings.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="gradient-text">Rs.{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {totalSavings > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="CheckCircle" className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      You saved Rs.{totalSavings.toFixed(2)} with bulk pricing!
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  loading={isProcessing}
                  className="w-full"
                >
                  <ApperIcon name="CreditCard" className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Proceed to Checkout"}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleContinueShopping}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;