"use client";

import React, { useState } from "react";
import { 
  AlertOctagon, 
  Search, 
  Upload, 
  MessageSquare, 
  ShieldAlert, 
  History,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Camera,
  FileText
} from "lucide-react";
import { toast } from "sonner";

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

// Mock Data
const DISPUTE_REASONS = [
  "Item not delivered",
  "Damaged on arrival",
  "Wrong item received",
  "Significantly not as described",
  "Counterfeit item"
];

const EXISTING_DISPUTES = [
  {
    id: "DIS-4401",
    orderId: "ORD-8821",
    reason: "Damaged on arrival",
    status: "Under Review",
    date: "Jan 15, 2026",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
  },
  {
    id: "DIS-3990",
    orderId: "ORD-7712",
    reason: "Item not delivered",
    status: "Resolved",
    date: "Dec 28, 2025",
    color: "text-green-500 bg-green-500/10 border-green-500/20"
  }
];

export default function DisputesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Dispute Filed Successfully", {
      description: "Seller payout has been locked. Admin will review within 48 hours.",
      icon: <ShieldAlert className="w-4 h-4 text-primary" />
    });
    setIsCreating(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                  Resolution Center
                </h1>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3 text-primary" /> Protect your purchases & resolve issues
                </p>
              </div>
              <button 
                onClick={() => setIsCreating(!isCreating)}
                className="bg-foreground text-background px-8 py-4 cursor-pointer rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all shadow-xl active:scale-95"
              >
                {isCreating ? "View My Cases" : "Open New Dispute"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* LEFT: History & Status */}
              <div className={`lg:col-span-7 space-y-6 ${isCreating ? "opacity-40 pointer-events-none" : ""}`}>
                <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-4">
                  <History className="w-4 h-4 text-primary" /> Recent Disputes
                </h2>

                {EXISTING_DISPUTES.map((dispute) => (
                  <div key={dispute.id} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{dispute.id}</p>
                        <h3 className="font-bold text-lg italic uppercase tracking-tighter mt-1">{dispute.reason}</h3>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${dispute.color}`}>
                        {dispute.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex gap-4">
                        <div>
                          <p className="text-[9px] font-black uppercase text-muted-foreground">Order ID</p>
                          <p className="text-xs font-bold">{dispute.orderId}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase text-muted-foreground">Filed On</p>
                          <p className="text-xs font-bold">{dispute.date}</p>
                        </div>
                      </div>
                      <button className="p-2 bg-muted rounded-lg group-hover:bg-primary cursor-pointer group-hover:text-primary-foreground transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT: Creation Form */}
              <div className="lg:col-span-5">
                {isCreating ? (
                  <div className="bg-card border-2 border-primary rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                      <AlertOctagon className="w-5 h-5 text-primary" /> File a Complaint
                    </h3>

                    <form onSubmit={handleSubmitDispute} className="space-y-5">
                      {/* Order Selection */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Order</label>
                        <select className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 ring-primary/20 outline-none appearance-none">
                          <option>ORD-99281 (Jan 18) - $193.50</option>
                          <option>ORD-98102 (Jan 12) - $45.00</option>
                        </select>
                      </div>

                      {/* Reason */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reason for Dispute</label>
                        <div className="grid grid-cols-1 gap-2">
                          {DISPUTE_REASONS.map((r) => (
                            <label key={r} className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-muted transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                              <input type="radio" name="reason" className="accent-primary" />
                              <span className="text-xs font-bold uppercase">{r}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Describe the Issue</label>
                        <textarea 
                          className="w-full bg-background border border-border rounded-xl p-4 text-sm min-h-[100px] outline-none focus:ring-2 ring-primary/20"
                          placeholder="Please provide as much detail as possible..."
                        />
                      </div>

                      {/* Evidence Upload */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Attach Evidence (Images/Video)</label>
                        <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer">
                          <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Click to upload files</p>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-5 cursor-pointer rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        Submit Case to Admin
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="bg-muted/10 border border-border border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                    <div className="bg-background p-6 rounded-full shadow-sm border border-border mb-6">
                      <ShieldAlert className="w-12 h-12 text-primary opacity-20" />
                    </div>
                    <h3 className="text-lg font-black uppercase italic tracking-tighter">Buyer Protection</h3>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-2 max-w-[250px] leading-relaxed">
                      If your order hasn't arrived or is not as described, you can open a dispute here.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}