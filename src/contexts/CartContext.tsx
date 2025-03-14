"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/services/productService';

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Calculate subtotal and total when cart items change
    const newSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal); // Add tax calculation here if needed
  }, [cartItems]);

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.product_id === product.id);

    if (existingItem) {
      // Increase quantity if already in cart
      updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      // Add new item
      const newItem: CartItem = {
        id: Date.now(), // temporary id
        product_id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity: 1,
        image: product.images && product.images.length > 0 ? product.images[0].src : '',
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems(
        cartItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
} 