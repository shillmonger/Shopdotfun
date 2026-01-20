"use client";

import React, { useState } from "react";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  Circle
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

export default function OrderTrackingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  // Mock Data for tracking
  const orderDetails = {
    id: "ORD-99281",
    status: "In Transit",
    courier: "Global Express Logistics",
    trackingNumber: "GEX-8829-1102",
    estArrival: "Jan 24, 2026",
    currentStep: 3, // Out of 5
  };

  const timeline = [
    { title: "Order Placed", date: "Jan 18, 10:30 AM", icon: CheckCircle2, completed: true },
    { title: "Payment Confirmed", date: "Jan 18, 10:35 AM", icon: ShieldCheck, completed: true },
    { title: "Seller Shipped", date: "Jan 19, 02:15 PM", icon: Package, completed: true },
    { title: "In Transit", date: "Jan 20, 09:00 AM", icon: Truck, completed: false },
    { title: "Delivered", date: "Estimated Jan 24", icon: Circle, completed: false },
  ];

  const handleConfirmDelivery = () => {
    setHasConfirmed(true);
    toast.success("Delivery Confirmed!", {
      description: "Seller payout has been triggered successfully.",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-10">
              <Link href="/buyer/orders" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-4">
                <ChevronLeft className="w-3 h-3" /> Back to Orders
              </Link>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                Track Order
              </h1>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">
                ID: <span className="text-foreground">{orderDetails.id}</span> • Status: <span className="text-primary">{orderDetails.status}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* A. Order Timeline */}
              <div className="lg:col-span-7">
                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-10 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Progress Timeline
                  </h3>
                  
                  <div className="space-y-0">
                    {timeline.map((step, idx) => (
                      <div key={idx} className="relative flex gap-6 pb-10 last:pb-0">
                        {/* Line Connector */}
                        {idx !== timeline.length - 1 && (
                          <div className={`absolute left-[11px] top-6 w-[2px] h-full ${step.completed ? "bg-primary" : "bg-border"}`} />
                        )}
                        
                        {/* Icon Node */}
                        <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-background ${step.completed ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
                          {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                        </div>

                        {/* Content */}
                        <div className="-mt-1">
                          <p className={`text-sm font-black uppercase italic tracking-tighter ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.title}
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground mt-1">
                            {step.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* B. Shipping Information & Actions */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-card border border-border rounded-3xl p-6">
                  <h3 className="text-xs font-black uppercase tracking-widest mb-6">Courier Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Courier</p>
                      <p className="text-sm font-bold text-right">{orderDetails.courier}</p>
                    </div>
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Tracking #</p>
                      <div className="text-right">
                        <p className="text-sm font-black tracking-widest">{orderDetails.trackingNumber}</p>
                        <button className="text-[9px] font-black cursor-pointer uppercase text-primary flex items-center gap-1 ml-auto mt-1 hover:underline">
                          Copy <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border flex justify-between items-center">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Est. Arrival</p>
                      <p className="text-sm font-black italic">{orderDetails.estArrival}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Confirmation Action */}
                <div className={`rounded-3xl p-6 border-2 transition-all ${hasConfirmed ? "bg-green-500/5 border-green-500/20" : "bg-foreground text-background border-foreground shadow-2xl"}`}>
                  <h3 className="text-xs font-black uppercase tracking-widest mb-4">Confirm Delivery</h3>
                  <p className={`text-[10px] font-medium leading-relaxed mb-6 ${hasConfirmed ? "text-green-700" : "opacity-70"}`}>
                    Only confirm if you have physically received the items and are satisfied with the quality. Confirmation releases funds to the seller.
                  </p>
                  
                  {!hasConfirmed ? (
                    <div className="space-y-3">
                      <button 
                        onClick={handleConfirmDelivery}
                        className="w-full bg-primary text-primary-foreground py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-primary/20"
                      >
                        I've Received the Order
                      </button>
                      <button className="w-full bg-background/10 cursor-pointer text-background py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-background/20 hover:bg-background/20 transition-all">
                        Report an Issue
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-widest">
                      <CheckCircle2 className="w-5 h-5" /> Transaction Finalized
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-2xl border border-border">
                  <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-[9px] text-muted-foreground font-medium leading-relaxed">
                    Auto-confirmation will occur in 7 days if no dispute is raised. Dispute period ends on Jan 31.
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