"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Calendar, 
  Download, 
  ArrowUpRight, 
  Filter,
  Package,
  ArrowDownRight,
  PieChart,
  RefreshCcw
} from "lucide-react";
import { toast } from "sonner";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

export default function SalesAnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("Last 30 Days");

  // Mock Data for Analytics
  const stats = [
    { label: "Total Revenue", value: "$12,450.00", trend: "+12.5%", isUp: true },
    { label: "Total Orders", value: "148", trend: "+8.2%", isUp: true },
    { label: "Avg. Order Value", value: "$84.12", trend: "-2.1%", isUp: false },
    { label: "Conversion Rate", value: "3.2%", trend: "+0.4%", isUp: true },
  ];

  const bestSellers = [
    { name: "Pro Mechanical Keyboard", sales: 42, revenue: "$5,040", growth: 15 },
    { name: "Wireless Ergonomic Mouse", sales: 38, revenue: "$3,230", growth: 12 },
    { name: "USB-C Multiport Hub", sales: 29, revenue: "$1,015", growth: -5 },
    { name: "Leather Desk Mat", sales: 24, revenue: "$960", growth: 8 },
  ];

  const handleExport = () => {
    toast.success("Preparing CSV Report", {
      description: "Refunded orders have been excluded from this export.",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 pb-32">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Header & Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
              <div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">
                  Sales <span className="text-primary not-italic">Analytics</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <BarChart3 className="w-3 h-3 text-primary" /> Tracking performance excluding all refunded transactions
                </p>
              </div>

              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                <div className="flex bg-card border border-border rounded-xl p-1">
                  {["7D", "30D", "90D", "ALL"].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-4 py-2 text-[10px] font-black uppercase transition-all rounded-lg ${
                        timeRange === range ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-muted"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleExport}
                  className="bg-foreground text-background px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
            </div>

            {/* High-Level Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {stats.map((stat, i) => (
                <div key={i} className="bg-card border border-border p-6 rounded-3xl shadow-sm group hover:border-primary/50 transition-all">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-black italic tracking-tighter">{stat.value}</h3>
                    <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${
                      stat.isUp ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
                    }`}>
                      {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
              
              {/* Revenue Chart Placeholder */}
<div className="lg:col-span-8 bg-card border border-border rounded-[2rem] p-8 shadow-sm">
  <div className="flex justify-between items-center mb-10">
    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
      <TrendingUp className="w-4 h-4 text-primary" /> Revenue Flow
    </h3>
    <div className="flex items-center gap-4 text-[9px] font-black uppercase opacity-50">
      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Sales</div>
      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-muted-foreground" /> Prev Period</div>
    </div>
  </div>
  
  {/* FIXED Chart Section */}
  <div className="h-[300px] w-full flex items-end justify-between gap-3 px-2">
    {[40, 70, 45, 90, 65, 80, 50, 95, 60, 85, 40, 100].map((height, i) => (
      <div key={i} className="flex-1 flex flex-col justify-end h-full group relative">
        {/* Previous Period Bar (Ghost bar) */}
        <div 
          className="w-full bg-muted/20 absolute bottom-0 rounded-t-lg transition-all" 
          style={{ height: `${height - 15}%` }} 
        />
        {/* Actual Sales Bar */}
        <div 
          className="w-full bg-primary/40 group-hover:bg-primary transition-all rounded-t-lg relative z-10" 
          style={{ height: `${height}%` }} 
        />
        {/* Month Label */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-tighter opacity-40">
          Jan
        </div>
      </div>
    ))}
  </div>
</div>

              {/* Best Sellers Leaderboard */}
              <div className="lg:col-span-4 bg-card border border-border rounded-[2rem] p-8 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" /> Top Performers
                </h3>
                
                <div className="space-y-6">
                  {bestSellers.map((item, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-[10px] font-black italic">
                          0{i+1}
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">
                            {item.name}
                          </p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">{item.sales} Units Sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black italic">{item.revenue}</p>
                        <p className={`text-[8px] font-black ${item.growth > 0 ? "text-green-500" : "text-destructive"}`}>
                          {item.growth > 0 ? "+" : ""}{item.growth}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-10 py-4 border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all flex items-center justify-center gap-2">
                  View Full Catalog <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Refund & Dispute Notice */}
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <RefreshCcw className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase italic tracking-tighter">Refund Policy Integrity</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight max-w-md">
                    Analytics automatically deducts refunded amounts to give you the most accurate representation of your actual take-home profit.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase text-muted-foreground">Adjusted for Refunds</p>
                  <p className="text-xl font-black italic">-$1,020.00</p>
                </div>
                <div className="h-10 w-[1px] bg-primary/20" />
                <PieChart className="w-8 h-8 text-primary opacity-50" />
              </div>
            </div>

          </div>
        </main>

        <SellerNav />
      </div>
    </div>
  );
}