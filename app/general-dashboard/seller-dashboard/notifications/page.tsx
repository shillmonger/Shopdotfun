"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Package, 
  ArrowRight, 
  Inbox,
  TrendingUp,
  ShieldAlert,
  Lightbulb,
  Zap,
  ChevronRight,
  Calendar,
  Loader2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";
import { useAuth } from "@/hooks/useAuth";

interface Notification {
  id: string;
  productId: string;
  productName: string;
  status: "Approved" | "Rejected";
  reason: string;
  date: string;
  isRead: boolean;
}

const fetchNotifications = async () => {
  const response = await fetch('/api/seller/notifications');
  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }
  const result = await response.json();
  return result.data || [];
};

export default function SellerNotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotificationsData = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchNotificationsData();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
                Feed<span className="text-primary not-italic">back</span>
              </h1>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Merchant Health: <span className="text-green-500">Excellent</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* LEFT COLUMN: NOTIFICATIONS */}
              <div className="lg:col-span-8 space-y-4">
                {loading ? (
                  <div className="py-16 bg-card border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-10 h-10 mb-3 animate-spin opacity-50" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Loading notifications...</p>
                  </div>
                ) : error ? (
                  <div className="py-16 bg-card border-2 border-dashed border-red-500/30 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                    <AlertCircle className="w-10 h-10 mb-3 text-red-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Error loading notifications</p>
                    <p className="text-[9px] text-muted-foreground">{error}</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-16 bg-card border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                    <Inbox className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Zero notifications</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`group relative bg-card border transition-all duration-200 rounded-2xl p-5 md:p-6 cursor-pointer hover:border-primary/50 ${
                        notif.isRead 
                          ? "border-border opacity-75" 
                          : "border-primary/60 shadow-md"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="shrink-0">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${ 
                            notif.status === "Approved" 
                              ? "bg-green-500/10 border-green-500/30" 
                              : "bg-red-500/10 border-red-500/30"
                          }`}>
                            {notif.status === "Approved" ? (
                              <CheckCircle2 className="w-7 h-7 text-green-500" />
                            ) : (
                              <XCircle className="w-7 h-7 text-red-500" />
                            )}
                          </div>
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-primary" />
                              <h3 className="text-base font-black uppercase italic tracking-tight">
                                {notif.productName}
                              </h3>
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                              {notif.date}
                            </span>
                          </div>

                          <div className="bg-muted/40 border-primary/60 p-3 rounded-lg">
                            <p className="text-[11px] font-medium leading-relaxed text-foreground/90">
                              {notif.reason}
                            </p>
                          </div>

                          {notif.status === "Rejected" && (
                            <Link 
                              href={`/general-dashboard/seller-dashboard/my-products/${notif.productId}`}
                              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-primary hover:underline"
                            >
                              Edit Listing <ChevronRight className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>




              {/* RIGHT COLUMN: ANALYTICS & TIPS */}
              <div className="lg:col-span-4 space-y-5">
                
                {/* Status Card */}
                <div className="bg-primary text-primary-foreground p-6 rounded-[2.5rem] shadow-lg relative overflow-hidden">
                  <TrendingUp className="absolute -right-6 -bottom-6 w-28 h-28 opacity-10" />
                  <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-85">Approval Rating</h4>
                  <div className="text-5xl font-black italic tracking-tight mb-2">88%</div>
                  <p className="text-[10px] font-bold uppercase leading-relaxed opacity-90">
                    Your listings are performing above average. Keep following the image guidelines!
                  </p>
                </div>

                {/* Quick Help Card */}
                <div className="bg-muted/30 border border-border p-6 rounded-[2.5rem] space-y-4">
                  <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center border border-border">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest italic">Pro Tip</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed">
                    Products with at least 4 images and a description longer than 200 characters have a <span className="text-primary font-black">95% approval rate</span>.
                  </p>
                  <button className="w-full py-3.5 bg-foreground text-background border border-border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" /> View Guide
                  </button>
                </div>

              </div>
            </div>

          </div>
        </main>

        <SellerNav />
      </div>
    </div>
  );
}