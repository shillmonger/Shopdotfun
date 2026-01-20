"use client";

import React, { useState } from "react";
import { 
  MapPin, 
  CreditCard, 
  Building2, 
  Wallet, 
  Plus, 
  Truck, 
  ShieldCheck, 
  Lock,
  ChevronRight,
  Info
} from "lucide-react";
import Link from "next/link";

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

export default function CheckoutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedAddress, setSelectedAddress] = useState(1);

  // Mock Data
  const addresses = [
    { id: 1, label: "Home", address: "123 Lagos Street, Ikeja, Lagos", isDefault: true },
    { id: 2, label: "Office", address: "45 Business Way, Victoria Island", isDefault: false },
  ];

  const orderGroups = [
    {
      seller: "Elite Footwear",
      items: [{ name: "Classic Leather Sneakers", price: 85.00, qty: 1 }],
      shipping: 10.00,
      estArrival: "Jan 22 - Jan 25"
    },
    {
      seller: "Modern Home",
      items: [{ name: "Minimalist Desk Lamp", price: 45.50, qty: 2 }],
      shipping: 5.00,
      estArrival: "Jan 21 - Jan 23"
    }
  ];

  const subtotal = 176.00;
  const totalShipping = 15.00;
  const platformFee = 2.50;
  const grandTotal = subtotal + totalShipping + platformFee;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 pt-8 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Title */}
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                Secure Checkout
              </h1>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center justify-center md:justify-start gap-2">
                <Lock className="w-3 h-3 text-primary" /> Encrypted Transaction
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* LEFT COLUMN: Details */}
              <div className="lg:col-span-7 space-y-10">
                
                {/* A. Delivery Address */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                      <span className="bg-foreground text-background w-6 h-6 flex items-center justify-center rounded-full text-[10px]">01</span>
                      Delivery Address
                    </h2>
                    <button className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:underline">
                      <Plus className="w-3 h-3" /> Add New
                    </button>
                  </div>
                  
                  <div className="grid gap-4">
                    {addresses.map((addr) => (
                      <div 
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr.id)}
                        className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                          selectedAddress === addr.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-muted-foreground/30 bg-card"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <MapPin className={`w-5 h-5 mt-0.5 ${selectedAddress === addr.id ? "text-primary" : "text-muted-foreground"}`} />
                            <div>
                              <p className="font-black uppercase text-xs tracking-tighter">{addr.label}</p>
                              <p className="text-sm text-muted-foreground mt-1">{addr.address}</p>
                            </div>
                          </div>
                          {selectedAddress === addr.id && (
                            <div className="bg-primary text-primary-foreground p-1 rounded-full">
                              <ShieldCheck className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* B. Order Summary (Grouped) */}
                <section>
                  <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6">
                    <span className="bg-foreground text-background w-6 h-6 flex items-center justify-center rounded-full text-[10px]">02</span>
                    Review Order
                  </h2>
                  <div className="space-y-6">
                    {orderGroups.map((group, idx) => (
                      <div key={idx} className="bg-card border border-border rounded-2xl overflow-hidden">
                        <div className="bg-muted/50 px-5 py-3 border-b border-border flex justify-between items-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary">{group.seller}</p>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
                            <Truck className="w-3 h-3" /> {group.estArrival}
                          </div>
                        </div>
                        <div className="p-5 space-y-4">
                          {group.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-bold uppercase italic tracking-tighter">{item.name}</p>
                                <p className="text-[10px] text-muted-foreground font-bold">QTY: {item.qty}</p>
                              </div>
                              <p className="text-sm font-black">${item.price.toFixed(2)}</p>
                            </div>
                          ))}
                          <div className="pt-4 border-t border-dashed border-border flex justify-between items-center">
                            <p className="text-[10px] font-black uppercase text-muted-foreground">Shipping for this seller</p>
                            <p className="text-xs font-bold">${group.shipping.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* C. Payment Method */}
                <section>
                  <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6">
                    <span className="bg-foreground text-background w-6 h-6 flex items-center justify-center rounded-full text-[10px]">03</span>
                    Payment Method
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: "card", icon: CreditCard, label: "Credit Card" },
                      { id: "bank", icon: Building2, label: "Bank Transfer" },
                      { id: "wallet", icon: Wallet, label: "Wallet" },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                          paymentMethod === method.id 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-border hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <method.icon className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN: Final Confirmation */}
              <div className="lg:col-span-5">
                <div className="bg-foreground text-background rounded-3xl p-8 sticky top-8 shadow-2xl">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8 border-b border-background/20 pb-4">
                    Final Amount
                  </h3>
                  
                  <div className="space-y-4 mb-10">
                    <div className="flex justify-between opacity-70">
                      <span className="text-xs font-black uppercase tracking-widest">Subtotal</span>
                      <span className="text-sm font-bold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between opacity-70">
                      <span className="text-xs font-black uppercase tracking-widest">Shipping Total</span>
                      <span className="text-sm font-bold">${totalShipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between opacity-70">
                      <span className="text-xs font-black uppercase tracking-widest">Processing Fee</span>
                      <span className="text-sm font-bold">${platformFee.toFixed(2)}</span>
                    </div>
                    <div className="h-[1px] bg-background/20 my-4" />
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-black uppercase tracking-widest">Grand Total</span>
                      <span className="text-4xl font-black italic tracking-tighter">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-background/10 rounded-2xl p-4 mb-8 flex items-start gap-3 border border-background/10">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    <p className="text-[10px] leading-relaxed font-medium uppercase tracking-tighter">
                      By clicking "Confirm Order", you agree to our Terms of Service. Your card will be charged immediately.
                    </p>
                  </div>

                  <button className="w-full bg-primary text-primary-foreground py-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 cursor-pointer">
                    Confirm & Place Order <ChevronRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-[9px] font-black uppercase tracking-widest mt-6 opacity-40 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3 h-3" /> SSL Secure Checkout
                  </p>
                </div>
              </div>

            </div>
          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}