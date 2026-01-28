"use client";

import React, { useState, useEffect } from "react";
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  ChevronLeft,
  Truck,
  ShieldCheck,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { toast } from 'sonner';

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

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

export default function CartPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Fetch cart data
  const fetchCart = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/buyer/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (response.ok) {
        setCartItems(data.items || []);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        if (response.status === 401) {
          console.error('Authentication required');
        } else {
          console.error('Failed to fetch cart:', data.error);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Math Logic
  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.discount > 0 
      ? item.price * (1 - item.discount / 100) 
      : item.price;
    return acc + itemPrice * item.quantity;
  }, 0);
  const shippingFee = cartItems.reduce((acc, item) => acc + item.shippingFee, 0);
  const totalAmount = subtotal + shippingFee;

  const updateQuantity = async (productId: string, delta: number) => {
    const item = cartItems.find(item => item.productId === productId);
    if (!item) return;

    const newQty = item.quantity + delta;
    
    // Check if trying to add more than available stock
    if (newQty > item.stock) {
      toast.error('Damn you bought buying it all!');
      return;
    }
    
    const finalQty = Math.max(1, Math.min(item.stock, newQty));
    if (finalQty === item.quantity) return;

    setUpdating(productId);
    
    try {
      const response = await fetch('/api/buyer/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: finalQty
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCartItems(data.items || []);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        if (response.status === 401) {
          toast.error('Please login to update your cart');
        } else {
          toast.error(data.error || 'Failed to update cart');
        }
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (productId: string) => {
    setUpdating(productId);
    
    try {
      const response = await fetch(`/api/buyer/cart?productId=${encodeURIComponent(productId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCartItems(data.items || []);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        if (response.status === 401) {
          toast.error('Please login to update your cart');
        } else {
          toast.error(data.error || 'Failed to remove item from cart');
        }
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-24 lg:pb-10">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">
                  Shopping Cart
                </h1>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                  <ShoppingBag className="w-3 h-3" /> {cartItems.length} Items in your bag
                </p>
              </div>
              <Link href="/general-dashboard/buyer-dashboard/browse-product" className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">
                <ShoppingBag className="w-4 h-4" /> Continue Shopping
              </Link>
            </div>

            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">
                  Loading Cart...
                </p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="bg-card border border-dashed border-border rounded-3xl py-20 px-10 text-center flex flex-col items-center justify-center">
                <div className="relative mb-8 group flex flex-col items-center">
                  <img
                    src="https://i.postimg.cc/LXSKYHG4/empty-box-removebg-preview.png"
                    alt="Empty Box"
                    className="w-44 h-44 object-contain cursor-pointer grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out relative z-10"
                  />
                </div>

                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Your cart is empty</h2>
                <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest mt-2 mb-8">
                  Looks like you haven&apos;t added anything yet.
                </p>
                
                <Link 
                  href="/general-dashboard/buyer-dashboard/browse-product" 
                  className="inline-block bg-foreground text-background cursor-pointer px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground hover:shadow-[0_10px_30px_rgba(var(--primary),0.3)] transition-all"
                >
                  Start Discovering
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* A. Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="bg-card border border-border rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row gap-6 group hover:border-primary/50 transition-colors">
                      {/* Image */}
                      <div className="w-full sm:w-32 h-32 bg-muted rounded-xl overflow-hidden shrink-0 border border-border">
                        <img src={item.image} alt={item.productName} className="w-full h-full cursor-pointer object-cover" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{item.sellerName}</p>
                            <h3 className="font-bold text-lg leading-tight uppercase italic tracking-tighter">{item.productName}</h3>
                          </div>
                          <button 
                            onClick={() => removeItem(item.productId)}
                            disabled={updating === item.productId}
                            className="p-2 text-muted-foreground hover:text-destructive cursor-pointer hover:bg-destructive/5 rounded-lg transition-all disabled:opacity-50"
                          >
                            {updating === item.productId ? (
                              <div className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        <div className="flex flex-wrap items-end justify-between gap-4 mt-6">
                          {/* Quantity Selector */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center bg-muted/50 border border-border rounded-xl p-1">
                              <button 
                                onClick={() => updateQuantity(item.productId, -1)}
                                disabled={updating === item.productId}
                                className="p-2 hover:bg-background cursor-pointer rounded-lg transition-colors disabled:opacity-50"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-10 text-center font-black text-sm">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.productId, 1)}
                                disabled={updating === item.productId}
                                className="p-2 hover:bg-background cursor-pointer rounded-lg transition-colors disabled:opacity-50"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-medium">
                              Stock: {item.stock} available
                            </p>
                          </div>
                          <div className="text-right">
                             {item.discount > 0 && (
                               <p className="text-[10px] text-muted-foreground line-through font-bold">${item.price.toFixed(2)}</p>
                              )}
                             <p className="text-lg font-black italic tracking-tighter">
                                ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                             </p>
                             <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Shipping: ${item.shippingFee.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Price Alert Note */}
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    <p className="text-[11px] text-amber-700 font-medium">
                      Prices and availability are subject to change. Your cart is saved, but items are not reserved until checkout is complete.
                    </p>
                  </div>
                </div>

                {/* Summary & Actions */}
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-6">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-border pb-4">Order Summary</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Subtotal</span>
                        <span className="font-bold">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Shipping Fee</span>
                        <span className="font-bold">${shippingFee.toFixed(2)}</span>
                      </div>
                      
                      <div className="h-[1px] bg-border my-4" />
                      
                      <div className="flex justify-between items-end">
                        <span className="text-lg font-black uppercase italic tracking-tighter">Total</span>
                        <span className="text-2xl font-black italic tracking-tighter text-primary">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-8 space-y-3">
                      <button className="w-full bg-foreground text-background py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl active:scale-95 cursor-pointer">
                        Proceed to Checkout <ArrowRight className="w-4 h-4" />
                      </button>
                      <Link href="/general-dashboard/buyer-dashboard/browse-product" className="w-full border border-border py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-muted transition-all">
                        Keep Shopping
                      </Link>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-muted-foreground" />
                        <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground">Fast Delivery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                        <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground">Secure Payment</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}