"use client";

import React, { useState } from "react";
import { 
  Package, 
  Search, 
  ChevronRight, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Calendar,
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

// Mock Data
const MOCK_ORDERS = [
  {
    id: "ORD-99281",
    date: "Jan 18, 2026",
    total: 125.50,
    paymentStatus: "Paid",
    deliveryStatus: "Processing",
    canCancel: true,
    sellers: ["Elite Footwear", "Modern Home"]
  },
  {
    id: "ORD-98102",
    date: "Jan 12, 2026",
    total: 45.00,
    paymentStatus: "Paid",
    deliveryStatus: "Shipped",
    canCancel: false,
    sellers: ["Gadget Hub"]
  },
  {
    id: "ORD-97554",
    date: "Jan 05, 2026",
    total: 210.00,
    paymentStatus: "Paid",
    deliveryStatus: "Delivered",
    canCancel: false,
    sellers: ["Fashion Nova", "Beauty Bar"]
  }
];

export default function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Processing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Shipped": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Delivered": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Cancelled": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const handleCancelOrder = (id: string) => {
    toast.success(`Cancellation request sent for ${id}`, {
      description: "Our team will verify and process the refund.",
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Page Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                  Order History
                </h1>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                  <Clock className="w-3 h-3 text-primary" /> Track and manage your purchases
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveFilter(status)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      activeFilter === status 
                      ? "bg-foreground text-background border-foreground shadow-lg" 
                      : "bg-card border-border text-muted-foreground hover:border-primary"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {MOCK_ORDERS.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-card border border-border rounded-2xl cursor-pointer overflow-hidden hover:border-primary/40 transition-all group"
                >
                  {/* Order Top Bar */}
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-primary border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-lg italic tracking-tighter uppercase">{order.id}</h3>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${getStatusStyle(order.deliveryStatus)}`}>
                            {order.deliveryStatus}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase mt-0.5">
                          <Calendar className="w-3 h-3" /> Placed on {order.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Amount</p>
                        <p className="text-xl font-black italic tracking-tighter">${order.total.toFixed(2)}</p>
                      </div>
                      <Link 
                        href={`/buyer/orders/${order.id}`}
                        className="bg-muted hover:bg-foreground hover:text-background p-3 rounded-xl transition-all border border-border"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>

                  {/* Order Bottom Info */}
                  <div className="px-5 py-4 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Sellers:</span>
                      <div className="flex flex-wrap gap-2">
                        {order.sellers.map((seller, i) => (
                          <span key={i} className="text-[10px] font-bold bg-background border border-border px-2 py-1 rounded-lg">
                            {seller}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {order.canCancel && (
                        <button 
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-[10px] font-black uppercase tracking-widest text-destructive hover:bg-destructive/5 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-destructive/20"
                        >
                          Cancel Order
                        </button>
                      )}
                      <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-background transition-colors">
                        <ExternalLink className="w-3 h-3" /> Get Receipt
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State Illustration logic */}
            {MOCK_ORDERS.length === 0 && (
              <div className="text-center py-20 bg-card border border-dashed border-border rounded-3xl mt-10">
                <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">No orders found</h2>
                <p className="text-muted-foreground text-sm mt-2">Start shopping to see your history here.</p>
                <Link href="/buyer/browse" className="mt-8 inline-block bg-primary text-primary-foreground px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90">
                  Explore Marketplace
                </Link>
              </div>
            )}
          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}