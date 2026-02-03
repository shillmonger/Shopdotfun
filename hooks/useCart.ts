"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import React from 'react';
import { toast } from 'sonner';

interface CartItem {
  productId: string;
  productName: string;
  sellerName: string;
  price: number;
  discount: number;
  quantity: number;
  stock: number;
  shippingFee: number;
  image: string;
  addedAt: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCartFromStorage();
    
    const handleStorageChange = () => {
      loadCartFromStorage();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadCartFromStorage = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateCart = (updatedCart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event('storage'));
  };

  const addToCart = (product: any) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      const existingItem = cart.find((item: any) => item.productId === product._id);
      
      // Check if product is out of stock
      if (product.stock <= 0) {
        toast.error('This product is out of stock');
        return;
      }
      
      if (existingItem) {
        // Check if adding one more would exceed stock
        if (existingItem.quantity >= product.stock) {
          toast.error('Cannot add more. Product is out of stock!');
          return;
        }
        existingItem.quantity += 1;
        toast.success('Product quantity updated in cart');
      } else {
        const cartItem = {
          productId: product._id,
          productName: product.name,
          sellerName: product.sellerName,
          price: product.price,
          discount: product.discount,
          quantity: 1,
          stock: product.stock || 1,
          shippingFee: product.shippingFee || 0,
          image: product.images[0]?.url || '',
          addedAt: new Date().toISOString()
        };
        
        cart.push(cartItem);
        toast.success('Product added to cart');
      }
      
      updateCart(cart);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    updateCart(updatedCart);
    toast.success('Product removed from cart');
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cartItems.map(item => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    updateCart(updatedCart);
    toast.success('Cart updated');
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCartItems([]);
    window.dispatchEvent(new Event('storage'));
    toast.success('Cart cleared');
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  return React.createElement(
    CartContext.Provider,
    {
      value: {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
        loading
      }
    },
    children
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
