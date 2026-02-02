"use client";

import React, { useState } from "react";
import { 
  AlertOctagon, 
  MessageSquare, 
  ShieldAlert, 
  History,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Camera,
  FileText,
  Send,
  UserCircle2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

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
                {isCreating ? "Back to Chat" : "Open New Dispute"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* LEFT: Resolution Chat */}
              <div className={`lg:col-span-7 flex flex-col h-[600px] bg-card border border-border rounded-3xl overflow-hidden shadow-sm ${isCreating ? "opacity-40 pointer-events-none" : ""}`}>
                {/* Chat Header */}
                <div className="p-5 border-b border-border bg-muted/30 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-widest">Case #DIS-4401</h2>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Chatting with: <span className="text-foreground">Urban_Vault_Store</span></p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500">
                    Under Review
                  </span>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Seller Message */}
                  <div className="flex flex-col items-start max-w-[80%]">
                    <div className="flex items-center gap-2 mb-1">
                      <UserCircle2 className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[9px] font-black uppercase text-muted-foreground">Urban_Vault_Store</span>
                    </div>
                    <div className="bg-muted border border-border p-4 rounded-2xl rounded-tl-none">
                      <p className="text-sm font-medium leading-relaxed">
                        Hello! I'm sorry the item arrived damaged. Could you please send a photo of the shipping label on the box so I can file a claim with the courier?
                      </p>
                    </div>
                    <span className="text-[8px] font-bold text-muted-foreground mt-1 uppercase">Today • 2:14 PM</span>
                  </div>

                  {/* Buyer Message (You) */}
                  <div className="flex flex-col items-end ml-auto max-w-[80%]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black uppercase text-primary">You</span>
                    </div>
                    <div className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-none">
                      <p className="text-sm font-medium leading-relaxed">
                        Sure, I have attached the label photo below. The box was quite crushed on the left side.
                      </p>
                    </div>
                    <span className="text-[8px] font-bold text-muted-foreground mt-1 uppercase">Today • 2:45 PM</span>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-5 border-t border-border bg-muted/20">
                  <div className="relative flex items-center gap-3">
                    <button className="p-3 bg-background border border-border rounded-xl hover:text-primary transition-colors">
                      <Camera className="w-5 h-5" />
                    </button>
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        placeholder="Discuss resolution with seller..." 
                        className="w-full bg-background border border-border rounded-xl py-4 px-4 pr-12 text-xs font-bold outline-none focus:ring-2 ring-primary/20"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary rounded-lg text-primary-foreground hover:scale-105 transition-transform">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Creation Form / Dispute Info */}
              <div className="lg:col-span-5">
                {isCreating ? (
                  <div className="bg-card border-2 border-primary rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                      <AlertOctagon className="w-5 h-5 text-primary" /> File a Complaint
                    </h3>

                    <form onSubmit={handleSubmitDispute} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Order</label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold text-left focus:ring-2 ring-primary/20 outline-none">
                              ORD-99281 (Jan 18) – $193.50
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full">
                            <DropdownMenuItem>ORD-99281 (Jan 18) – $193.50</DropdownMenuItem>
                            <DropdownMenuItem>ORD-98102 (Jan 12) – $45.00</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

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

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Describe the Issue</label>
                        <textarea 
                          className="w-full bg-background border border-border rounded-xl p-4 text-sm min-h-[100px] outline-none focus:ring-2 ring-primary/20"
                          placeholder="Please provide as much detail as possible..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Attach Evidence</label>
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
                  <div className="space-y-6">
                    {/* Case Status Sidebar */}
                    <div className="bg-card border border-border rounded-3xl p-8">
                      <h3 className="text-lg font-black uppercase italic tracking-tighter mb-4">Case Summary</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                          <p className="text-[9px] font-black uppercase text-muted-foreground">Currently With</p>
                          <p className="text-xs font-bold flex items-center gap-2 mt-1">
                             <Clock className="w-3 h-3 text-primary" /> Waiting for Seller Response
                          </p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                          <p className="text-[9px] font-black uppercase text-muted-foreground">Resolution Deadline</p>
                          <p className="text-xs font-bold mt-1">Jan 22, 2026 (48h left)</p>
                        </div>
                      </div>
                      <div className="mt-8 pt-8 border-t border-border">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-4">Escalation</p>
                        <button className="w-full bg-red-500/10 text-red-500 border border-red-500/20 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                          Escalate to Admin
                        </button>
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
                      <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                        <ShieldAlert className="w-3 h-3 text-primary" /> Buyer Tip
                      </h4>
                      <p className="text-[9px] font-bold text-muted-foreground leading-relaxed uppercase">
                        Communicating clearly with the seller often leads to faster refunds than waiting for admin intervention.
                      </p>
                    </div>
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