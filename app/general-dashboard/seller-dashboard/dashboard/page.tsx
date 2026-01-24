"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Truck,
  AlertCircle,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

export default function SellerOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // Mock verification status
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Mock Stats
  const stats = [
    { label: "Total Sales", value: "$12,450", icon: DollarSign, trend: "+12%" },
    { label: "Orders Today", value: "8", icon: Package, trend: "+2" },
    { label: "Pending Ship", value: "3", icon: Clock, trend: "Urgent" },
    { label: "Available", value: "$4,200", icon: CheckCircle2, trend: "Ready" },
  ];

  const recentOrders = [
    { id: "ORD-1120", buyer: "Alex Johnson", total: 125.0, status: "Pending" },
    { id: "ORD-1118", buyer: "Sarah Smith", total: 85.5, status: "Shipped" },
    { id: "ORD-1115", buyer: "Mike Ross", total: 210.0, status: "Delivered" },
  ];

  // Check wallet connection status
  useEffect(() => {
    const checkWalletStatus = async () => {
      try {
        const response = await fetch('/api/seller/wallet-status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store', // Prevent caching
        });

        if (!response.ok) {
          throw new Error('Failed to fetch wallet status');
        }

        const data = await response.json();
        console.log('Wallet status response:', data); // Debug log
        setIsWalletConnected(data.isConnected);
      } catch (error) {
        console.error('Error checking wallet status:', error);
        // Default to false if there's an error
        setIsWalletConnected(false);
      }
    };
    
    // Initial check
    checkWalletStatus();
    
    // Set up polling to check every 5 seconds (optional, remove if not needed)
    const interval = setInterval(checkWalletStatus, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SellerSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* A. Welcome & Store Status */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  Elite Gear Hub
                </h1>
                <div className="flex items-center gap-4 mt-3">
                  <span
                    className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${
                      isVerified
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}
                  >
                    <ShieldAlert className="w-3 h-3" />{" "}
                    {isVerified ? "Verified Seller" : "Verification Pending"}
                  </span>
                  {!isVerified && (
                    <span className="text-[10px] font-bold text-destructive uppercase tracking-widest flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Payouts Restricted
                    </span>
                  )}
                </div>
              </div>
              <Link
                href="general-dashboard/seller-dashboard/add-product"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
              >
                + Add New Product
              </Link>
            </section>

            {/* D. Alerts & Actions (Sticky Notifications) */}
            <section className="space-y-4">
              {!isWalletConnected ? (
                <div className="bg-amber-500 text-black p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg border-2 border-black/10">
                  <div className="flex gap-4">
                    <AlertCircle className="w-6 h-6 shrink-0 mt-1" />
                    <div>
                      <h3 className="font-black uppercase italic text-sm tracking-tight">
                        Add your crypto wallet for payouts
                      </h3>
                      <p className="text-[10px] font-bold uppercase opacity-80">
                        Connect a valid cryptocurrency wallet to receive payout
                        withdrawals.
                      </p>
                    </div>
                  </div>
                  <Link href="/general-dashboard/seller-dashboard/profile-settings">
                    <button className="w-full md:w-auto cursor-pointer bg-black text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      Complete Now
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="bg-green-500 text-black p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg border-2 border-black/10">
                  <div className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 shrink-0 mt-1" />
                    <div>
                      <h3 className="font-black uppercase italic text-sm tracking-tight">
                        Crypto Wallet Connected
                      </h3>
                      <p className="text-[10px] font-bold uppercase opacity-80">
                        Your wallet is ready to receive payouts.
                      </p>
                    </div>
                  </div>
                  <button 
                    className="w-full md:w-auto cursor-pointer bg-black text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest"
                    disabled
                  >
                    Connected
                  </button>
                </div>
              )}
            </section>

            {/* B. Key Metrics (Stat Cards) */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-card border border-border p-5 rounded-3xl relative overflow-hidden group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-2 bg-muted rounded-xl text-primary">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-tighter bg-foreground/5 px-2 py-0.5 rounded-full">
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-black italic tracking-tighter mt-1">
                    {stat.value}
                  </p>
                  <div className="absolute bottom-0 left-0 h-1 bg-primary w-0 group-hover:w-full transition-all duration-500" />
                </div>
              ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* C. Recent Orders Table */}
              <div className="lg:col-span-8">
                <div className="bg-card border border-border rounded-3xl overflow-hidden">
                  <div className="p-6 border-b border-border flex justify-between items-end">
                    <h2 className="text-sm font-black uppercase tracking-widest">
                      Recent Orders
                    </h2>
                    <Link
                      href="/seller/orders"
                      className="text-[10px] font-black uppercase text-primary hover:underline"
                    >
                      View All Orders
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-muted/30 border-b border-border">
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">
                            Order ID
                          </th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">
                            Buyer
                          </th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">
                            Status
                          </th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {recentOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="hover:bg-muted/20 transition-colors group"
                          >
                            <td className="px-6 py-5 font-black text-sm uppercase tracking-tighter italic">
                              {order.id}
                            </td>
                            <td className="px-6 py-5 text-xs font-bold">
                              {order.buyer}
                            </td>
                            <td className="px-6 py-5 font-black italic">
                              ${order.total.toFixed(2)}
                            </td>
                            <td className="px-6 py-5">
                              <span
                                className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border ${
                                  order.status === "Pending"
                                    ? "border-amber-500/20 text-amber-500 bg-amber-500/5"
                                    : "border-green-500/20 text-green-500 bg-green-500/5"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <Link
                                href={`/seller/orders/${order.id}`}
                                className="p-2 inline-block bg-muted rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Sidebar info (Account Health / Stock) */}
              <div className="lg:col-span-4 space-y-8">
                {/* Low Stock Warning */}
                <section className="bg-card border border-border rounded-3xl p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xs font-black uppercase tracking-widest">
                      Inventory Alerts
                    </h2>
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-destructive/5 rounded-2xl border border-destructive/10">
                      <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center text-destructive">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-tighter">
                          Hyper-X Keyboard
                        </p>
                        <p className="text-[9px] font-bold text-destructive uppercase">
                          Only 2 left in stock
                        </p>
                      </div>
                    </div>
                    <button className="w-full py-3 text-[10px] font-black uppercase tracking-widest border border-border rounded-xl hover:bg-muted transition-colors">
                      Manage Inventory
                    </button>
                  </div>
                </section>

                {/* Account Health */}
                <section className="bg-foreground text-background rounded-3xl p-6">
                  <h2 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 opacity-60">
                    Account Health
                  </h2>
                  <div className="flex items-end justify-between">
                    <p className="text-4xl font-black italic tracking-tighter">
                      98%
                    </p>
                    <span className="text-[10px] font-black uppercase text-primary">
                      Excellent
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-background/20 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-primary w-[98%]" />
                  </div>
                  <p className="text-[9px] font-medium uppercase mt-4 opacity-50 leading-relaxed">
                    Maintain a high health score to get boosted in search
                    results.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </main>

        <SellerNav />
      </div>
    </div>
  );
}
