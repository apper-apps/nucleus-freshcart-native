import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("freshcart-cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("freshcart-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const bestTier = getBestTierForQuantity(product.priceTiers, quantity);
    
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.productId === product.Id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
        const newBestTier = getBestTierForQuantity(product.priceTiers, newQuantity);
        
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity,
          selectedTier: newBestTier,
          product: product
        };
        
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, {
          productId: product.Id,
          quantity: quantity,
          selectedTier: bestTier,
          product: product
        }];
      }
    });

    toast.success(`Added ${product.name} to cart!`);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.productId === productId) {
          const newBestTier = getBestTierForQuantity(item.product.priceTiers, newQuantity);
          return {
            ...item,
            quantity: newQuantity,
            selectedTier: newBestTier
          };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
    toast.info("Item removed from cart");
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.selectedTier.price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getBestTierForQuantity = (priceTiers, quantity) => {
    // Sort tiers by minQuantity in descending order
    const sortedTiers = [...priceTiers].sort((a, b) => b.minQuantity - a.minQuantity);
    
    // Find the best tier for this quantity
    for (const tier of sortedTiers) {
      if (quantity >= tier.minQuantity) {
        return tier;
      }
    }
    
    // Return the base tier if no tier matches
    return priceTiers.find(tier => tier.minQuantity === 1) || priceTiers[0];
  };

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getBestTierForQuantity
  };
};

export default useCart;