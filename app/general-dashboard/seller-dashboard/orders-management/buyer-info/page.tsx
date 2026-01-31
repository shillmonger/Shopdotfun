"use client";

import React, { useState } from "react";
import { 
  Truck, 
  Calendar, 
  Hash, 
  CheckCircle2, 
  ArrowLeft,
  Info,
  PackageCheck,
  MapPin,
  Clock,
  Send
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

// Mock Carriers List
const CARRIERS = [
  "DHL Express",
  "FedEx",
  "UPS",
  "GIG Logistics",
  "Local Courier",
  "Other"
];

export default function MarkAsShippedPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipDate, setShipDate] = useState(new Date().toISOString().split('T')[0]);

  const handleConfirmShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carrier) return toast.error("Please select a carrier");
    
    setIsSubmitting(true);
    
    // Simulate API Call
    setTimeout(() => {
      toast.success("Order Mark as Shipped!", {
        description: "Buyer has been notified and the delivery countdown started.",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 pb-32">
          <div className="max-w-4xl mx-auto">
            
            {/* Navigation & Header */}
            <div className="mb-10">
              <Link href="/general-dashboard/seller-dashboard/orders-management" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-4">
                <ArrowLeft className="w-3 h-3" /> Back to Orders
              </Link>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                Dispatch Order
              </h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                <Truck className="w-3 h-3 text-primary" /> Confirm shipment and update buyer
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Order Details Summary */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6">Order Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-black uppercase italic tracking-tighter">Premium Headphones</p>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase mt-1 tracking-tight">ID: #ORD-99821-X</p>
                      </div>
                      <p className="font-black italic text-sm">$240.00</p>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <MapPin className="w-4 h-4 opacity-40" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Shipping To</p>
                        <p className="text-[10px] font-bold uppercase">John Doe • Lagos, NG</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-[9px] font-bold leading-relaxed uppercase tracking-tighter text-primary/80">
                    Once marked as shipped, the funds will be held until the buyer confirms receipt or the delivery window expires.
                  </p>
                </div>
              </div>

              {/* Shipment Form */}
              <div className="lg:col-span-7">
                <form onSubmit={handleConfirmShipment} className="bg-card border-2 border-primary rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <PackageCheck className="w-24 h-24" />
                  </div>

                  <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4 flex items-center gap-2">
                    Shipping Information
                  </h3>

                  <div className="space-y-4 relative z-10">
                    {/* Carrier Selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Truck className="w-3 h-3" /> Shipping Carrier
                      </label>
                      <select 
                        required
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 ring-primary/20 outline-none appearance-none"
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                      >
                        <option value="">Select Carrier</option>
                        {CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
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
                        placeholder="e.g. DHL-559-001"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 ring-primary/20 outline-none transition-all"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                      />
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Dispatch Date
                      </label>
                      <input 
                        type="date" 
                        required
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 ring-primary/20 outline-none transition-all"
                        value={shipDate}
                        onChange={(e) => setShipDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground py-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>Processing... <Clock className="w-4 h-4 animate-spin" /></>
                    ) : (
                      <>Confirm Dispatch <Send className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </main>

        <SellerNav />
      </div>
    </div>
  );
}