"use client";

import React, { useState } from "react";
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  ChevronLeft,
  Truck,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

// Mock Data for the UI
const initialCartItems = [
  {
    id: "1",
    name: "Classic Leather Sneakers",
    seller: "Elite Footwear",
    price: 85.00,
    quantity: 1,
    stock: 5,
    image: "https://i.postimg.cc/pLD6CsVc/download-(5).jpg",
  },
  {
    id: "2",
    name: "Minimalist Desk Lamp",
    seller: "Modern Home",
    price: 45.50,
    quantity: 2,
    stock: 10,
    image: "https://i.postimg.cc/t4jj9ZY5/Luminaria-de-Mesa-Preta-Aluminio-e-Plastico-Flex-Kian.jpg",
  },
];

export default function CartPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState(initialCartItems);

  // Math Logic
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal > 0 ? 15.00 : 0;
  const platformFee = subtotal > 0 ? 2.50 : 0;
  const totalAmount = subtotal + shippingFee + platformFee;

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, Math.min(item.stock, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
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
              <Link href="/buyer/browse" className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">
                <ChevronLeft className="w-4 h-4" /> Continue Shopping
              </Link>
            </div>

            {cartItems.length === 0 ? (
              <div className="bg-card border border-dashed border-border rounded-3xl p-20 text-center">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold uppercase italic">Your cart is empty</h2>
                <p className="text-muted-foreground text-sm mt-2 mb-6">Looks like you haven&apos;t added anything yet.</p>
                <Link href="/buyer/browse" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all">
                  Start Discovering
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* A. Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-card border border-border rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row gap-6 group hover:border-primary/50 transition-colors">
                      {/* Image */}
                      <div className="w-full sm:w-32 h-32 bg-muted rounded-xl overflow-hidden shrink-0 border border-border">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{item.seller}</p>
                            <h3 className="font-bold text-lg leading-tight uppercase italic tracking-tighter">{item.name}</h3>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-end justify-between gap-4 mt-6">
                          {/* Quantity Selector */}
                          <div className="flex items-center bg-muted/50 border border-border rounded-xl p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-2 hover:bg-background rounded-lg transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-black text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-2 hover:bg-background rounded-lg transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Unit Price: ${item.price.toFixed(2)}</p>
                            <p className="text-xl font-black italic tracking-tighter">${(item.price * item.quantity).toFixed(2)}</p>
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

                {/* B & C. Summary & Actions */}
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
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Platform Fee</span>
                        <span className="font-bold">${platformFee.toFixed(2)}</span>
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
                      <Link href="/buyer/browse" className="w-full border border-border py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-muted transition-all">
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