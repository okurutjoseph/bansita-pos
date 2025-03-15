"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, getProduct } from '@/services/productService';

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock_quantity?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
  isLoading: boolean;
  checkoutCart: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Local storage key for cart
const CART_STORAGE_KEY = 'bansita_cart';

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
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart) as CartItem[];
          
          // Validate cart items against current stock
          const validatedCart: CartItem[] = [];
          
          for (const item of parsedCart) {
            // Get latest product data to check stock
            const product = await getProduct(item.product_id);
            
            if (product) {
              // Update item with latest product data
              const updatedItem = {
                ...item,
                name: product.name,
                price: parseFloat(product.price),
                image: product.images && product.images.length > 0 ? product.images[0].src : '',
                stock_quantity: product.stock_quantity
              };
              
              // Adjust quantity if it exceeds current stock
              if (product.stock_quantity !== null && product.stock_quantity !== undefined) {
                updatedItem.quantity = Math.min(updatedItem.quantity, product.stock_quantity);
              }
              
              if (updatedItem.quantity > 0) {
                validatedCart.push(updatedItem);
              }
            }
          }
          
          setCartItems(validatedCart);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      } finally {
        setInitialized(true);
      }
    };
    
    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, initialized]);

  // Calculate subtotal and total when cart items change
  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal); // Add tax calculation here if needed
  }, [cartItems]);

  const addToCart = useCallback(async (product: Product) => {
    // Check if product is in stock
    if (product.stock_quantity !== null && product.stock_quantity !== undefined && product.stock_quantity <= 0) {
      alert('This product is out of stock');
      return;
    }
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product_id === product.id);
      
      if (existingItem) {
        // Check if adding one more would exceed stock
        if (product.stock_quantity !== null && 
            product.stock_quantity !== undefined && 
            existingItem.quantity >= product.stock_quantity) {
          alert(`Cannot add more of this product. Maximum available: ${product.stock_quantity}`);
          return prevItems;
        }
        
        // Increase quantity if already in cart
        return prevItems.map(item => 
          item.id === existingItem.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: Date.now(), // temporary id
          product_id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          quantity: 1,
          image: product.images && product.images.length > 0 ? product.images[0].src : '',
          stock_quantity: product.stock_quantity
        };
        return [...prevItems, newItem];
      }
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === id) {
          // Check if new quantity exceeds stock
          if (item.stock_quantity !== null && 
              item.stock_quantity !== undefined && 
              quantity > item.stock_quantity) {
            alert(`Cannot add more of this product. Maximum available: ${item.stock_quantity}`);
            return { ...item, quantity: item.stock_quantity };
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Simulate checkout process
  const checkoutCart = useCallback(async (): Promise<boolean> => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Validate stock quantities one more time before checkout
      for (const item of cartItems) {
        const product = await getProduct(item.product_id);
        
        if (!product) {
          alert(`Product "${item.name}" is no longer available`);
          return false;
        }
        
        if (product.stock_quantity !== null && 
            product.stock_quantity !== undefined && 
            item.quantity > product.stock_quantity) {
          alert(`Not enough stock for "${item.name}". Available: ${product.stock_quantity}`);
          return false;
        }
      }
      
      // Here you would implement the actual checkout process
      // For example, creating an order in WooCommerce
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear cart after successful checkout
      clearCart();
      
      return true;
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred during checkout. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [cartItems, clearCart]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    total,
    isLoading,
    checkoutCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
