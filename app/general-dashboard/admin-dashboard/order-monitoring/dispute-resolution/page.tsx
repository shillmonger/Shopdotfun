"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, 
  MessageSquare, 
  Gavel, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw, 
  ChevronRight,
  FileText,
  User,
  Store,
  DollarSign,
  Lock,
  Search,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// Mock Dispute Data
const INITIAL_DISPUTES = [
  {
    id: "DISP-7701",
    orderId: "ORD-99290",
    buyer: "Kyle Reese",
    seller: "Resistance Gear",
    reason: "Item Not as Described",
    status: "Open",
    amount: "450.00 SOL",
    date: "2026-01-18",
    buyerNote: "The item arrived with a cracked screen and the wrong color. Seller is refusing to respond.",
    sellerNote: "The item was perfect when shipped. I believe the buyer damaged it themselves.",
    evidence: ["shipping_label.png", "damage_photo.jpg"]
  },
  {
    id: "DISP-7705",
    orderId: "ORD-99310",
    buyer: "Sarah Connor",
    seller: "TechHub",
    reason: "Non-Delivery",
    status: "Under Review",
    amount: "1,200.00 USDT",
    date: "2026-01-20",
    buyerNote: "Tracking says delivered but nothing is here.",
    sellerNote: "Carrier confirmed delivery to porch.",
    evidence: ["carrier_receipt.pdf"]
  }
];

export default function ResolveDisputesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [disputes, setDisputes] = useState(INITIAL_DISPUTES);
  const [selectedDispute, setSelectedDispute] = useState<typeof INITIAL_DISPUTES[0] | null>(null);
  const [adminNote, setAdminNote] = useState("");

  const handleResolution = (id: string, action: string) => {
    if (!adminNote) {
      return toast.error("Audit Required", {
        description: "You must provide an internal justification before closing this dispute."
      });
    }

    setDisputes(disputes.map(d => d.id === id ? { ...d, status: "Closed" } : d));
    toast.success("Final Decision Logged", {
      description: `Action &quot;${action}&quot; has been executed and funds moved.`
    });
    setSelectedDispute(null);
    setAdminNote("");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                Dispute <span className="text-primary not-italic">Tribunal</span>
              </h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                <Gavel className="w-3 h-3 text-primary" /> Arbitrating marketplace conflicts &bull; {disputes.filter(d => d.status !== "Closed").length} Active Cases
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* A. Dispute List */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search Dispute ID..." 
                    className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-xs font-bold outline-none focus:ring-2 ring-primary/20"
                  />
                </div>

                <div className="space-y-3">
                  {disputes.map((dispute) => (
                    <div 
                      key={dispute.id}
                      onClick={() => setSelectedDispute(dispute)}
                      className={`p-5 rounded-[2rem] border-2 transition-all cursor-pointer group ${
                        selectedDispute?.id === dispute.id 
                        ? "bg-primary/5 border-primary shadow-lg shadow-primary/5" 
                        : "bg-card border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-black uppercase text-muted-foreground">{dispute.id}</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                          dispute.status === "Open" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}>
                          {dispute.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-black uppercase italic tracking-tighter mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {dispute.reason}
                      </h4>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> {dispute.amount}
                        </p>
                        <ChevronRight className={`w-4 h-4 transition-transform ${selectedDispute?.id === dispute.id ? 'translate-x-1 text-primary' : 'opacity-20'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* B. & C. Detail View & Resolution */}
              <div className="lg:col-span-7">
                {selectedDispute ? (
                  <div className="bg-card border border-border rounded-[2rem] overflow-hidden sticky top-24">
                    {/* Detail Header */}
                    <div className="bg-muted/30 p-8 border-b border-border">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">Investigation Case</p>
                          <h3 className="text-2xl font-black uppercase italic tracking-tighter">Order {selectedDispute.orderId}</h3>
                        </div>
                        <div className="bg-background border border-border px-4 py-2 rounded-xl flex items-center gap-2">
                          <Lock className="w-3 h-3 text-destructive" />
                          <span className="text-[9px] font-black uppercase">Payout Frozen</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase opacity-50 flex items-center gap-1"><User className="w-2.5 h-2.5" /> Buyer</p>
                          <p className="text-xs font-black uppercase italic">{selectedDispute.buyer}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase opacity-50 flex items-center gap-1"><Store className="w-2.5 h-2.5" /> Seller</p>
                          <p className="text-xs font-black uppercase italic">{selectedDispute.seller}</p>
                        </div>
                      </div>
                    </div>

                    {/* Evidence Section */}
                    <div className="p-8 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 bg-background border border-border rounded-2xl space-y-3">
                          <p className="text-[9px] font-black uppercase text-destructive tracking-widest">Buyer Complaint</p>
                          <p className="text-[11px] font-bold leading-relaxed italic">&quot;{selectedDispute.buyerNote}&quot;</p>
                        </div>
                        <div className="p-5 bg-background border border-border rounded-2xl space-y-3">
                          <p className="text-[9px] font-black uppercase text-primary tracking-widest">Seller Response</p>
                          <p className="text-[11px] font-bold leading-relaxed italic">&quot;{selectedDispute.sellerNote}&quot;</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <FileText className="w-4 h-4" /> Evidence Attachments
                        </p>
                        <div className="flex gap-2">
                          {selectedDispute.evidence.map((file, i) => (
                            <div key={i} className="px-4 py-2 bg-muted rounded-lg text-[9px] font-black uppercase border border-border cursor-pointer hover:bg-primary hover:text-white transition-all">
                              {file}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resolution Action Area */}
                      <div className="pt-8 border-t border-border space-y-6">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest mb-3 block">Final Administrative Verdict</label>
                          <textarea 
                            className="w-full bg-background border border-border rounded-2xl p-4 text-[11px] font-bold uppercase outline-none focus:ring-2 ring-primary/20"
                            rows={3}
                            placeholder="State the final reason for this decision. This will be visible to both parties..."
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <button 
                            onClick={() => handleResolution(selectedDispute.id, "Refunded Buyer")}
                            className="bg-destructive text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                          >
                            <RefreshCcw className="w-4 h-4" /> Refund Buyer
                          </button>
                          <button 
                            onClick={() => handleResolution(selectedDispute.id, "Released to Seller")}
                            className="bg-green-500 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Release Funds
                          </button>
                          <button 
                            onClick={() => handleResolution(selectedDispute.id, "Partial Refund")}
                            className="bg-primary text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                          >
                            <DollarSign className="w-4 h-4" /> Split Refund
                          </button>
                          <button 
                            onClick={() => handleResolution(selectedDispute.id, "Rejected")}
                            className="bg-foreground text-background py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                          >
                            <XCircle className="w-4 h-4" /> Dismiss Case
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-center p-10 opacity-30">
                    <ShieldAlert className="w-16 h-16 mb-6" />
                    <h4 className="text-xl font-black uppercase italic">Judgement Pending</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest mt-2">Select a dispute from the sidebar to begin evidence review</p>
                  </div>
                )}
              </div>
            </div>

            {/* Legal / Audit Note */}
            <div className="mt-8 bg-amber-500/5 border border-amber-500/20 rounded-[2rem] p-6 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-tight leading-relaxed">
                Critical Notice: Decisions made on this panel are immutable and will trigger automatic smart-contract or payment processor reversals. Ensure you have reviewed all &quot;Evidence Attachments&quot; before committing to a resolution.
              </p>
            </div>

          </div>
        </main>

        <AdminNav />
      </div>
    </div>
  );
}