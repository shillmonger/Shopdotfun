"use client";

import React, { useState } from "react";
import { 
  ShoppingBag, 
  User, 
  CreditCard, 
  Truck, 
  Search, 
  Filter,
  Lock,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ChevronRight,
  MoreHorizontal,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

// Mock Data - Simulating orders sorted by newest first
const INITIAL_ORDERS = [
  {
    id: "ORD-2026-9921",
    buyer: "Chidi Benson",
    date: "Jan 20, 2026",
    items: [
      { name: "Pro Gaming Mouse", qty: 1, price: 45.00 },
      { name: "XL Mousepad", qty: 2, price: 15.00 }
    ],
    total: 75.00,
    paymentStatus: "Paid", // Confirmed payment
    fulfillmentStatus: "Pending",
  },
  {
    id: "ORD-2026-9915",
    buyer: "Sarah Williams",
    date: "Jan 19, 2026",
    items: [
      { name: "Mechanical Keyboard", qty: 1, price: 120.00 }
    ],
    total: 120.00,
    paymentStatus: "Awaiting Payment", // Locked fulfillment
    fulfillmentStatus: "Pending",
  },
  {
    id: "ORD-2026-9880",
    buyer: "David Okoro",
    date: "Jan 18, 2026",
    items: [
      { name: "USB-C Hub", qty: 1, price: 35.00 }
    ],
    total: 35.00,
    paymentStatus: "Paid",
    fulfillmentStatus: "Shipped",
  }
];

export default function OrdersReceivedPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders] = useState(INITIAL_ORDERS);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 pb-32">
          <div className="max-w-6xl mx-auto">
            
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  Orders <span className="text-primary tracking-normal not-italic">Received</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-primary" /> Multi-vendor orders are split automatically
                </p>
              </div>

              <div className="flex w-full md:w-auto gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search Order ID or Buyer..." 
                    className="w-full md:w-64 bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-xs font-bold outline-none focus:ring-2 ring-primary/20"
                  />
                </div>
                <button className="bg-card border border-border p-3 rounded-xl hover:bg-muted transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orders.map((order) => {
                const isPaid = order.paymentStatus === "Paid";
                
                return (
                  <div 
                    key={order.id} 
                    className="bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/40 transition-all group shadow-sm"
                  >
                    <div className="p-6 md:p-8">
                      {/* Top Row: IDs and Status */}
                      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              {order.id}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground">• {order.date}</span>
                          </div>
                          <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" /> {order.buyer}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Payment Status Badge */}
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                            isPaid 
                            ? "bg-green-500/10 text-green-500 border-green-500/20" 
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}>
                            {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {order.paymentStatus}
                          </div>
                          
                          {/* Fulfillment Badge */}
                          <div className="bg-muted text-muted-foreground px-3 py-1.5 rounded-full border border-border text-[9px] font-black uppercase tracking-widest">
                            {order.fulfillmentStatus}
                          </div>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="bg-background/50 rounded-2xl p-4 border border-border/50 space-y-3 mb-6">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center font-black text-[10px]">
                                {item.qty}x
                              </div>
                              <span className="font-bold uppercase text-xs">{item.name}</span>
                            </div>
                            <span className="font-black italic">${(item.price * item.qty).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Row: Action & Total */}
                      <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-border/50">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Earnings</p>
                          <p className="text-2xl font-black italic tracking-tighter">${order.total.toFixed(2)}</p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <Link 
                            href={`/seller/orders/${order.id}`}
                            className="flex-1 md:flex-none border border-border text-center px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all"
                          >
                            Details
                          </Link>

                          {isPaid ? (
                            <Link 
                              href={`/seller/orders/${order.id}/ship`}
                              className="flex-1 md:flex-none bg-primary text-primary-foreground text-center px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                            >
                              Mark as Shipped <Truck className="w-4 h-4" />
                            </Link>
                          ) : (
                            <button 
                              disabled 
                              className="flex-1 md:flex-none bg-muted text-muted-foreground/50 border border-border px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed"
                            >
                              Wait for Payment <Lock className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        <SellerNav />
      </div>
    </div>
  );
}