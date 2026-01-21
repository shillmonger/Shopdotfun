"use client";

import React, { useState, useMemo } from "react";
import { 
  Wallet, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PauseCircle, 
  Search, 
  Filter, 
  Banknote, 
  User, 
  Truck, 
  FileText, 
  History, 
  ShieldCheck, 
  ArrowUpRight,
  MoreVertical,
  XCircle,
  RefreshCcw,
  Ban
} from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// Mock Payout Data
const INITIAL_PAYOUTS = [
  {
    id: "PAY-88021",
    sellerName: "TechHub Nigeria",
    sellerId: "SEL-401",
    email: "payouts@techhub.ng",
    orderId: "ORD-9902",
    gross: 50000,
    commission: 5000,
    net: 45000,
    status: "Pending",
    deliveryStatus: "Confirmed",
    disputeStatus: "None",
    eligibleDate: "2026-01-21",
    bank: { name: "Access Bank", holder: "TechHub Ltd", account: "****6672", method: "Naira Transfer" },
    tracking: { carrier: "GIG Logistics", code: "GIG-99201" }
  },
  {
    id: "PAY-88025",
    sellerName: "Sarah Fashion",
    sellerId: "SEL-102",
    email: "sarah@couture.com",
    orderId: "ORD-9915",
    gross: 12000,
    commission: 1200,
    net: 10800,
    status: "On hold",
    deliveryStatus: "In Transit",
    disputeStatus: "Open",
    eligibleDate: "2026-01-25",
    bank: { name: "Zenith Bank", holder: "Sarah Okoro", account: "****1109", method: "Naira Transfer" },
    tracking: { carrier: "DHL", code: "DHL-44102" }
  }
];

export default function AdminPayoutManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payouts, setPayouts] = useState(INITIAL_PAYOUTS);
  const [selectedPayout, setSelectedPayout] = useState<typeof INITIAL_PAYOUTS[0] | null>(null);

  // Financial Stats
  const stats = useMemo(() => ({
    totalPending: payouts.filter(p => p.status === "Pending").length,
    amountPending: payouts.reduce((acc, curr) => curr.status === "Pending" ? acc + curr.net : acc, 0),
    paidToday: 145000,
    heldCount: payouts.filter(p => p.status === "On hold").length
  }), [payouts]);

  const handlePayoutAction = (id: string, newStatus: string) => {
    // Logic: Block payout if dispute is open
    const target = payouts.find(p => p.id === id);
    if (newStatus === "Paid" && target?.disputeStatus !== "None") {
      return toast.error("Payout Blocked", {
        description: "Cannot release funds while a dispute is open &quot;Under Review&quot;."
      });
    }

    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    toast.success(`Status Updated`, {
      description: `Payout ${id} has been moved to &quot;${newStatus}&quot; status.`
    });
    setSelectedPayout(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32">
          <div className="max-w-[1600px] mx-auto">
            
            {/* 1. Top Summary Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Pending Payouts", val: stats.totalPending, icon: Clock, color: "text-amber-500" },
                { label: "Amount Pending", val: `₦${stats.amountPending.toLocaleString()}`, icon: Banknote, color: "text-primary" },
                { label: "Paid Today", val: `₦${stats.paidToday.toLocaleString()}`, icon: CheckCircle2, color: "text-green-500" },
                { label: "Held Payouts", val: stats.heldCount, icon: PauseCircle, color: "text-destructive" },
              ].map((s, i) => (
                <div key={i} className="bg-card border border-border p-6 rounded-[2.5rem] flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">{s.label}</p>
                    <p className={`text-2xl font-black italic tracking-tighter ${s.color}`}>{s.val}</p>
                  </div>
                  <s.icon className={`w-8 h-8 opacity-20 ${s.color}`} />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* 2. Payout Queue Table */}
              <div className="lg:col-span-8 bg-card border border-border rounded-[2.5rem] overflow-hidden">
                <div className="p-6 border-b border-border flex flex-wrap items-center justify-between gap-4 bg-muted/20">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder="Search Seller or Order ID..." className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold outline-none" />
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all">
                      <Filter className="w-3 h-3" /> Filter
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/10 border-b border-border">
                        <th className="px-6 py-4 text-[9px] font-black uppercase text-muted-foreground tracking-widest">Payout Info</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase text-muted-foreground tracking-widest">Financials</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase text-muted-foreground tracking-widest">Eligibility</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase text-muted-foreground tracking-widest text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {payouts.map((pay) => (
                        <tr 
                          key={pay.id} 
                          onClick={() => setSelectedPayout(pay)}
                          className={`hover:bg-muted/30 cursor-pointer transition-colors ${selectedPayout?.id === pay.id ? 'bg-primary/5' : ''}`}
                        >
                          <td className="px-6 py-5">
                            <p className="font-black text-xs uppercase italic tracking-tighter">{pay.sellerName}</p>
                            <p className="text-[9px] font-bold text-muted-foreground mt-1 uppercase">{pay.id} &bull; {pay.orderId}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-xs font-black italic">₦{pay.net.toLocaleString()}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase">Net Pay</p>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col gap-1">
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md w-fit ${pay.deliveryStatus === 'Confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                                  Ship: {pay.deliveryStatus}
                                </span>
                                {pay.disputeStatus !== "None" && (
                                  <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-destructive/10 text-destructive w-fit">
                                    Dispute: {pay.disputeStatus}
                                  </span>
                                )}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                             <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${
                               pay.status === "Paid" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                               pay.status === "On hold" ? "bg-destructive/10 text-destructive border-destructive/20" :
                               "bg-amber-500/10 text-amber-500 border-amber-500/20"
                             }`}>
                               {pay.status}
                             </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Payout Detail Panel */}
              <div className="lg:col-span-4 h-full">
                {selectedPayout ? (
                  <div className="bg-card border-2 border-primary rounded-[3rem] p-8 space-y-8 sticky top-24 shadow-2xl">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">Settlement Desk</h3>
                      <button onClick={() => setSelectedPayout(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <XCircle className="w-5 h-5 opacity-40" />
                      </button>
                    </div>

                    {/* A. Seller Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase italic tracking-tighter">{selectedPayout.sellerName}</p>
                          <p className="text-[10px] font-bold text-muted-foreground">{selectedPayout.email}</p>
                        </div>
                      </div>

                      {/* B. Bank Details */}
                      <div className="bg-background border border-border rounded-2xl p-4 space-y-3">
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                          <ShieldCheck className="w-3 h-3" /> Beneficiary Account
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase">Bank</p>
                            <p className="text-[11px] font-bold">{selectedPayout.bank.name}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase">Account</p>
                            <p className="text-[11px] font-bold">{selectedPayout.bank.account}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* D. Financial Breakdown */}
                    <div className="space-y-3 border-t border-border pt-6">
                       <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight">
                         <span className="opacity-50">Gross Sale</span>
                         <span>₦{selectedPayout.gross.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight text-destructive">
                         <span className="opacity-50">Commission (10%)</span>
                         <span>- ₦{selectedPayout.commission.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-lg font-black italic tracking-tighter pt-2">
                         <span className="uppercase text-primary">Net Payout</span>
                         <span>₦{selectedPayout.net.toLocaleString()}</span>
                       </div>
                    </div>

                    {/* E. Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-6 border-t border-border">
                       <button 
                        onClick={() => handlePayoutAction(selectedPayout.id, "On hold")}
                        className="flex items-center justify-center gap-2 border-2 border-destructive text-destructive py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-destructive hover:text-white transition-all"
                       >
                         <Ban className="w-3 h-3" /> Hold
                       </button>
                       <button 
                        onClick={() => handlePayoutAction(selectedPayout.id, "Paid")}
                        className="flex items-center justify-center gap-2 bg-foreground text-background py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all"
                       >
                         <CheckCircle2 className="w-3 h-3" /> Mark Paid
                       </button>
                    </div>
                    
                    <button className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase opacity-40 hover:opacity-100 transition-all">
                       <History className="w-3 h-3" /> View Audit Log
                    </button>
                  </div>
                ) : (
                  <div className="h-[500px] border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-center p-12 opacity-30">
                    <Banknote className="w-16 h-16 mb-6" />
                    <h4 className="text-xl font-black uppercase italic">Select Settlement</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest mt-2 leading-relaxed">
                      Choose a payout record to verify banking data and execute disbursement logic
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>

        <AdminNav />
      </div>
    </div>
  );
}