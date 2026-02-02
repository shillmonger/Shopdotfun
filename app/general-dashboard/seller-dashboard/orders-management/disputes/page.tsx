"use client";

import React, { useState } from "react";
import { 
  AlertOctagon, 
  MessageSquare, 
  ShieldAlert, 
  History,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Camera,
  FileText,
  User,
  Mail,
  Phone,
  Clock,
  Send
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import { toast } from "sonner";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

// Mock Data for Active Dispute
const ACTIVE_DISPUTE = {
  id: "DIS-4401",
  orderId: "ORD-8821",
  productName: "Vintage Leather Jacket - '92 Edition",
  productImage: "/api/placeholder/80/80",
  buyer: {
    name: "Alex Thompson",
    email: "a.thompson@email.com",
    phone: "+1 (555) 012-3456"
  },
  reason: "Damaged on arrival",
  description: "The left sleeve has a significant tear near the cuff that wasn't shown in the listing photos. The packaging was also crushed.",
  evidence: ["/api/placeholder/200/200", "/api/placeholder/200/200"],
  deadline: "22h 45m left",
  status: "Action Required"
};

export default function SellerDisputesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isResponding, setIsResponding] = useState(false);

  const handleAction = (action: string) => {
    toast.success(`Action: ${action}`, {
      description: "Response sent to buyer and logged for admin review.",
      icon: <CheckCircle2 className="w-4 h-4 text-primary" />
    });
    setIsResponding(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                  Seller Disputes
                </h1>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3 text-red-500" /> Respond to buyer claims immediately
                </p>
              </div>
              <div className="flex gap-4">
                <div className="bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-xl">
                  <p className="text-[10px] font-black uppercase text-red-500 mb-1">Critical Action</p>
                  <p className="text-sm font-bold tracking-tight">1 Dispute Awaiting Response</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* LEFT: Dispute Details & Buyer Info */}
              <div className="lg:col-span-7 space-y-8">
                {/* Order & Buyer Info Card */}
                <div className="bg-card border border-border rounded-3xl overflow-hidden">
                  <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img src={ACTIVE_DISPUTE.productImage} alt="product" className="w-16 h-16 rounded-xl object-cover border border-border" />
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{ACTIVE_DISPUTE.orderId}</p>
                        <h2 className="text-lg font-bold italic uppercase">{ACTIVE_DISPUTE.productName}</h2>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase text-muted-foreground">Deadline</p>
                       <p className="text-sm font-black text-red-500 flex items-center gap-1 justify-end">
                         <Clock className="w-3 h-3" /> {ACTIVE_DISPUTE.deadline}
                       </p>
                    </div>
                  </div>

                  <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" /> Buyer
                      </p>
                      <p className="text-sm font-bold">{ACTIVE_DISPUTE.buyer.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Email
                      </p>
                      <p className="text-sm font-bold">{ACTIVE_DISPUTE.buyer.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Phone
                      </p>
                      <p className="text-sm font-bold">{ACTIVE_DISPUTE.buyer.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Dispute Reason & Evidence */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-primary" /> Buyer Claim
                  </h3>
                  <div className="bg-muted/20 border border-border rounded-2xl p-6">
                    <p className="text-[10px] font-black text-red-500 uppercase mb-2">Reason: {ACTIVE_DISPUTE.reason}</p>
                    <p className="text-sm font-medium leading-relaxed italic text-muted-foreground">
                      "{ACTIVE_DISPUTE.description}"
                    </p>
                    
                    <div className="mt-6 flex gap-3">
                      {ACTIVE_DISPUTE.evidence.map((img, i) => (
                        <div key={i} className="w-24 h-24 rounded-lg border-2 border-border overflow-hidden hover:border-primary transition-all cursor-zoom-in">
                          <img src={img} alt="evidence" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Thread / Messages */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest">Resolution Chat</span>
                  </div>
                  <div className="space-y-4 max-h-[200px] overflow-y-auto mb-6 pr-4">
                    <div className="flex flex-col items-end">
                      <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none text-xs font-medium max-w-[80%]">
                        Hello Alex, I'm sorry to hear about the jacket. Can you confirm if the outer shipping box was damaged too?
                      </div>
                      <span className="text-[9px] font-bold uppercase text-muted-foreground mt-1">You • 2:15 PM</span>
                    </div>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Type message to buyer..." 
                      className="w-full bg-background border border-border rounded-xl py-4 px-4 pr-12 text-xs font-bold outline-none focus:ring-2 ring-primary/20"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary rounded-lg text-primary-foreground">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT: Action Center */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-foreground text-background rounded-3xl p-8 shadow-2xl">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                    Resolution Center
                  </h3>

                  <div className="space-y-4">
                    {/* Action 1: Accept */}
                    <button 
                      onClick={() => handleAction("Fault Accepted")}
                      className="w-full group flex items-center justify-between p-4 bg-background/10 border border-background/20 rounded-2xl hover:bg-green-500 hover:text-white transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-green-500 p-2 rounded-lg text-white">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black uppercase">Accept Fault</p>
                          <p className="text-[9px] font-bold opacity-60">Offer full refund/replacement</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                    </button>

                    {/* Action 2: Reject */}
                    <button 
                       onClick={() => handleAction("Dispute Rejected")}
                       className="w-full group flex items-center justify-between p-4 bg-background/10 border border-background/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-red-500 p-2 rounded-lg text-white">
                          <XCircle className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black uppercase">Reject Claim</p>
                          <p className="text-[9px] font-bold opacity-60">Escalate to Admin review</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  </div>

                  <div className="mt-8 pt-8 border-t border-background/10 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-background/60">Upload Counter-Evidence</p>
                    <div className="border-2 border-dashed border-background/20 rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-background/5 transition-all cursor-pointer">
                      <Camera className="w-8 h-8 mb-2 opacity-40" />
                      <p className="text-[9px] font-black uppercase opacity-60">Delivery Receipts / Pre-shipment Photos</p>
                    </div>
                  </div>
                  
                  <button className="w-full mt-6 bg-primary text-primary-foreground py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">
                    Submit Response
                  </button>
                </div>

                <div className="bg-muted/30 border border-border border-dashed rounded-3xl p-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-3 h-3 text-primary" /> Dispute Policy
                  </h4>
                  <ul className="space-y-3">
                    <li className="text-[9px] font-bold uppercase text-muted-foreground leading-tight">
                      • Funds are held in escrow until the dispute is resolved.
                    </li>
                    <li className="text-[9px] font-bold uppercase text-muted-foreground leading-tight">
                      • Failure to respond within 48h results in an automatic refund.
                    </li>
                  </ul>
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