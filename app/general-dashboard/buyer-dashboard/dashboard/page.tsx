"use client";

import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Package, 
  CheckCircle2, 
  CreditCard, 
  AlertCircle, 
  ChevronRight, 
  ArrowRight,
  MapPin,
  Bell,
  HelpCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { getGreeting } from "@/lib/utils";

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

interface UserData {
  name: string;
  email: string;
  country?: string;
  image?: string;
}

export default function BuyerOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/buyer/profile');
        if (response.ok) {
          const data = await response.json();
          setUserData({
            name: data.name || 'User',
            email: data.email,
            country: data.country || 'Unknown Location',
            image: data.image
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Mock Stats
  const stats = [
    { label: "Items in Cart", value: "3", icon: ShoppingBag, link: "/buyer/cart" },
    { label: "Active Orders", value: "2", icon: Clock, link: "/buyer/orders" },
    { label: "Completed", value: "24", icon: CheckCircle2, link: "/buyer/orders" },
    { label: "Total Spent", value: "$1.2k", icon: CreditCard, link: "/buyer/payments" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* 1️⃣ Welcome & Account Snapshot */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic leading-none">
                  {loading ? (
                    <div className="h-10 w-64 bg-muted rounded animate-pulse"></div>
                  ) : (
                    getGreeting(userData?.name || 'User')
                  )}
                </h1>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 px-2 py-1 rounded-md border border-green-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Status: Active
                  </span>
                  {loading ? (
                    <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <MapPin className="w-3 h-3" /> {userData?.country || 'Unknown Location'}
                    </span>
                  )}
                </div>
              </div>
              <Link href="/general-dashboard/buyer-dashboard/browse-product" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                Continue Shopping
              </Link>
            </section>

            {/* 2️⃣ Quick Stats Summary */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <Link key={i} href={stat.link} className="bg-card border border-border p-5 rounded-2xl group hover:border-primary transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black italic tracking-tighter mt-1">{stat.value}</p>
                </Link>
              ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Orders & Actions */}
              <div className="lg:col-span-8 space-y-10">
                
                {/* 4️⃣ Orders That Need Action (Alerts) */}
                <section className="space-y-4">
                  <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-primary" /> Attention Required
                  </h2>
                  <div className="bg-foreground text-background p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
                    <div className="flex gap-4">
                      <div className="bg-primary p-3 rounded-2xl shrink-0">
                        <Package className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest opacity-70">Order #ORD-99281</p>
                        <h3 className="text-lg font-black uppercase italic tracking-tighter">Confirm your delivery</h3>
                        <p className="text-[10px] font-medium opacity-60 mt-1 uppercase">Item reached your local hub 2 hours ago.</p>
                      </div>
                    </div>
                    <Link href="/buyer/orders/tracking" className="w-full md:w-auto bg-background text-foreground px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all text-center">
                      Confirm Now
                    </Link>
                  </div>
                </section>

                {/* 3️⃣ Recent Orders Section */}
                <section className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h2 className="text-sm font-black uppercase tracking-widest">Recent Orders</h2>
                    <Link href="/buyer/orders" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All</Link>
                  </div>
                  <div className="bg-card border border-border rounded-3xl overflow-hidden divide-y divide-border">
                    {[1, 2].map((_, i) => (
                      <div key={i} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center font-black text-xs">
                            IMG
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase italic tracking-tighter">Premium Wireless Headphones</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">ORD-7728 • Jan 18, 2026</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="hidden md:block text-[9px] font-black uppercase px-2 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500">Shipped</span>
                          <p className="font-black italic">$299.00</p>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Wallet & Notifications */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* 6️⃣ Wallet / Payment Summary */}
                <section className="bg-card border border-border rounded-3xl p-6">
                  <h2 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" /> Payment Summary
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Last Payment</span>
                      <span className="font-black">$193.50</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Refund Status</span>
                      <span className="text-blue-500 font-black uppercase text-[10px]">None Pending</span>
                    </div>
                    <Link href="/buyer/payments" className="block w-full text-center py-3 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-colors mt-4">
                      View Payment Ledger
                    </Link>
                  </div>
                </section>

                {/* 7️⃣ Notifications Panel */}
                <section className="bg-card border border-border rounded-3xl p-6">
                  <h2 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" /> Notifications
                  </h2>
                  <div className="space-y-6">
                    {[
                      { title: "Price Drop", desc: "An item in your cart is now 10% off", time: "2h ago" },
                      { title: "Order Update", desc: "ORD-99281 has been shipped", time: "5h ago" },
                    ].map((n, i) => (
                      <div key={i} className="flex gap-3 relative">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-tight">{n.title}</p>
                          <p className="text-xs text-muted-foreground leading-tight mt-0.5">{n.desc}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 8️⃣ Help & Support Shortcut */}
                <section className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
                  <HelpCircle className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-sm font-black uppercase italic tracking-tighter">Need Assistance?</h3>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase mt-2 leading-relaxed">
                    Our support team is available 24/7 for disputes or questions.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-6">
                    <Link href="/buyer/disputes" className="bg-foreground text-background text-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:opacity-90">Open Dispute</Link>
                    <button className="border border-border text-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-background">Help Center</button>
                  </div>
                </section>

              </div>
            </div>

            {/* 5️⃣ Continue Shopping / Recommendations */}
            <section className="pt-10 border-t border-border">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl font-black uppercase italic tracking-tighter">Recommended For You</h2>
                <Link href="/buyer/browse" className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group">
                  Explore More <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-3 hover:shadow-xl transition-all group cursor-pointer">
                    <div className="aspect-square bg-muted rounded-xl mb-3 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase opacity-20 group-hover:scale-110 transition-transform">Product Image</div>
                    </div>
                    <p className="text-[10px] font-black text-primary uppercase mb-1">Tech Store</p>
                    <p className="text-xs font-bold truncate">Wireless Smart Keyboard</p>
                    <p className="text-sm font-black italic mt-2">$89.00</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}