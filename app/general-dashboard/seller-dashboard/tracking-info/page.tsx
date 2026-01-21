"use client";

import React, { useState } from "react";
import { 
  Truck, 
  Hash, 
  Link as LinkIcon, 
  CheckCircle2, 
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from "lucide-react";

import { toast } from "sonner";
import Link from "next/link";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

export default function UploadTrackingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Form States
  const [trackingData, setTrackingData] = useState({
    courier: "",
    trackingNumber: "",
    trackingUrl: "",
  });

  const handleSyncTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingData.courier || !trackingData.trackingNumber) {
      return toast.error("Courier and Tracking Number are required");
    }

    setIsSyncing(true);

    // Simulate Validation & Sync Logic
    setTimeout(() => {
      toast.success("Tracking Synced Successfully!", {
        description: "Order status updated and buyer timeline refreshed.",
      });
      setIsSyncing(false);
    }, 1800);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 pb-32">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="mb-10">
              <Link href="/seller/orders" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-4">
                <ArrowLeft className="w-3 h-3" /> Back to Dispatch
              </Link>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                Sync <span className="text-primary not-italic">Tracking</span>
              </h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                <Hash className="w-3 h-3 text-primary" /> Provide shipping visibility to Order #ORD-2026-9921
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Form Section */}
              <div className="lg:col-span-7">
                <form onSubmit={handleSyncTracking} className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  
                  {/* Courier Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Truck className="w-3 h-3" /> Select Courier
                    </label>
                    <select 
                      required
                      className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-2 ring-primary/20 outline-none appearance-none cursor-pointer"
                      value={trackingData.courier}
                      onChange={(e) => setTrackingData({...trackingData, courier: e.target.value})}
                    >
                      <option value="">Choose Courier Company</option>
                      <option value="dhl">DHL Express</option>
                      <option value="fedex">FedEx</option>
                      <option value="ups">UPS Logistics</option>
                      <option value="gig">GIG Logistics</option>
                      <option value="other">Other / Local Delivery</option>
                    </select>
                  </div>

                  {/* Tracking Number */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Hash className="w-3 h-3" /> Tracking Number
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter ID provided by courier"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-2 ring-primary/20 outline-none transition-all uppercase placeholder:normal-case"
                      value={trackingData.trackingNumber}
                      onChange={(e) => setTrackingData({...trackingData, trackingNumber: e.target.value})}
                    />
                  </div>

                  {/* Tracking URL */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <LinkIcon className="w-3 h-3" /> Tracking URL (Optional)
                    </label>
                    <input 
                      type="url" 
                      placeholder="https://courier.com/track/..."
                      className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-2 ring-primary/20 outline-none transition-all"
                      value={trackingData.trackingUrl}
                      onChange={(e) => setTrackingData({...trackingData, trackingUrl: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSyncing}
                    className="w-full bg-foreground text-background py-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all shadow-xl disabled:opacity-50"
                  >
                    {isSyncing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Sync Tracking Info <CheckCircle2 className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              </div>

              {/* Sidebar Preview & Info */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Visual Timeline Preview */}
                <div className="bg-primary text-primary-foreground rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-6">Buyer-Side Preview</h3>
                  
                  <div className="relative pl-6 border-l-2 border-white/20 space-y-8">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-white ring-4 ring-primary" />
                      <p className="text-[10px] font-black uppercase tracking-tight">Shipped</p>
                      <p className="text-[9px] opacity-70 uppercase font-bold">Jan 20, 2026 • 2:45 PM</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-white/30" />
                      <p className="text-[10px] font-black uppercase tracking-tight opacity-50 italic">In Transit</p>
                      <p className="text-[9px] opacity-30 uppercase font-bold">Awaiting {trackingData.courier || "Courier"} Scan</p>
                    </div>
                  </div>

                  {trackingData.trackingNumber && (
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Live Tracking ID</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-lg font-black italic uppercase">{trackingData.trackingNumber}</span>
                        <ExternalLink className="w-4 h-4 opacity-50" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Advice */}
                <div className="bg-card border border-border rounded-3xl p-6">
                  <div className="flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-tight mb-1">Status Syncing</h4>
                      <p className="text-[10px] text-muted-foreground font-medium leading-relaxed uppercase">
                        Adding a valid tracking number allows the system to automatically mark the order as &quot;Delivered&quot; once the courier API confirms arrival.
                      </p>
                    </div>
                  </div>
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