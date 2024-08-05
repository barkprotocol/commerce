"use client";

import React, { createContext, ReactNode, useContext, useState, useEffect, useMemo } from "react";
import { useLocalStorage } from "../hooks/localStorage";

// Define types for props and state
type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  quantity: number;
};

type ShoppingCartContextType = {
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartQuantity: number;
  cartItems: CartItem[];
  isLoading: boolean;
};

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export function useShoppingCart() {
  const context = useContext(ShoppingCartContext);
  if (context === undefined) {
    throw new Error("useShoppingCart must be used within a ShoppingCartProvider");
  }
  return context;
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart", []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay for demonstration purposes
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate total quantity of items in the cart
  const cartQuantity = useMemo(
    () => cartItems.reduce((total, item) => item.quantity + total, 0),
    [cartItems]
  );

  // Get the quantity of a specific item in the cart
  const getItemQuantity = (id: number) => {
    const item = cartItems.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  // Increase the quantity of a specific item in the cart
  const increaseCartQuantity = (id: number) => {
    setCartItems((currentItems) => {
      const itemExists = currentItems.some((item) => item.id === id);
      if (itemExists) {
        return currentItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...currentItems, { id, quantity: 1 }];
      }
    });
  };

  // Decrease the quantity of a specific item in the cart
  const decreaseCartQuantity = (id: number) => {
    setCartItems((currentItems) => {
      return currentItems.reduce((acc, item) => {
        if (item.id === id) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
          // If quantity is 1, it should not be added to the accumulator
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]);
    });
  };

  // Remove a specific item from the cart
  const removeFromCart = (id: number) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  // Clear all items from the cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(() => ({
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    clearCart,
    cartItems,
    cartQuantity,
    isLoading,
  }), [cartItems, cartQuantity, isLoading]);

  return (
    <ShoppingCartContext.Provider value={contextValue}>
      {children}
    </ShoppingCartContext.Provider>
  );
}
