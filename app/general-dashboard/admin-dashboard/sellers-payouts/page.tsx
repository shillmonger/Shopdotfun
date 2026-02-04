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
  Ban,
  Globe,
  Phone,
  Bitcoin
} from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// Mock Payout Data updated with more user details
const INITIAL_PAYOUTS = [
  {
    id: "PAY-88021",
    sellerName: "TechHub Nigeria",
    sellerId: "SEL-401",
    email: "payouts@techhub.ng",
    phone: "+234 812 345 6789",
    country: "Nigeria",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechHub",
    orderId: "ORD-9902",
    gross: 50000,
    commission: 5000,
    net: 45000,
    status: "Pending",
    deliveryStatus: "Confirmed",
    disputeStatus: "None",
    eligibleDate: "2026-01-21",
    cryptoAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    bank: { name: "Access Bank", holder: "TechHub Ltd", account: "****6672", method: "Naira Transfer" },
    tracking: { carrier: "GIG Logistics", code: "GIG-99201" }
  },
  {
    id: "PAY-88025",
    sellerName: "Sarah Fashion",
    sellerId: "SEL-102",
    email: "sarah@couture.com",
    phone: "+234 901 222 3344",
    country: "Ghana",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    orderId: "ORD-9915",
    gross: 12000,
    commission: 1200,
    net: 10800,
    status: "On hold",
    deliveryStatus: "In Transit",
    disputeStatus: "Open",
    eligibleDate: "2026-01-25",
    cryptoAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    bank: { name: "Zenith Bank", holder: "Sarah Okoro", account: "****1109", method: "Naira Transfer" },
    tracking: { carrier: "DHL", code: "DHL-44102" }
  }
];

export default function AdminPayoutManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payouts, setPayouts] = useState(INITIAL_PAYOUTS);
  const [selectedPayout, setSelectedPayout] = useState<typeof INITIAL_PAYOUTS[0] | null>(null);

  const stats = useMemo(() => ({
    totalPending: payouts.filter(p => p.status === "Pending").length,
    amountPending: payouts.reduce((acc, curr) => curr.status === "Pending" ? acc + curr.net : acc, 0),
    paidToday: 145000,
    heldCount: payouts.filter(p => p.status === "On hold").length
  }), [payouts]);

  const handlePayoutAction = (id: string, newStatus: string) => {
    const target = payouts.find(p => p.id === id);
    if (newStatus === "Paid" && target?.disputeStatus !== "None") {
      return toast.error("Payout Blocked", {
        description: "Cannot release funds while a dispute is open."
      });
    }

    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    toast.success(`Status Updated`, {
      description: `Payout ${id} has been moved to "${newStatus}" status.`
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
                    <input type="text" placeholder="Search Seller..." className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold outline-none" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/10 border-b border-border">
                        <th className="px-6 py-4 text-[9px] font-black uppercase text-muted-foreground tracking-widest">Seller Details</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase text-muted-foreground tracking-widest">Payout Amount</th>
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
                            <div className="flex items-center gap-3">
                              <img src={pay.image} alt={pay.sellerName} className="w-10 h-10 rounded-full border-2 border-primary/20 bg-muted" />
                              <div>
                                <p className="font-black text-xs uppercase italic tracking-tighter">{pay.sellerName}</p>
                                <p className="text-[10px] font-bold text-muted-foreground">{pay.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-xs font-black italic">₦{pay.net.toLocaleString()}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase">{pay.id}</p>
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

              {/* 3. Settlement Desk */}
              <div className="lg:col-span-4 h-full">
                {selectedPayout ? (
                  <div className="bg-card border-2 border-primary rounded-[3rem] p-8 space-y-6 sticky top-24 shadow-2xl">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">Settlement Desk</h3>
                      <button onClick={() => setSelectedPayout(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <XCircle className="w-5 h-5 opacity-40" />
                      </button>
                    </div>

                    {/* Profile & Identity Section */}
                    <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-3xl border border-border">
                        <img src={selectedPayout.image} alt="Seller" className="w-14 h-14 rounded-2xl border-2 border-primary" />
                        <div className="overflow-hidden">
                          <p className="text-sm font-black uppercase italic tracking-tighter truncate">{selectedPayout.sellerName}</p>
                          <p className="text-[10px] font-bold text-muted-foreground truncate">{selectedPayout.email}</p>
                          <div className="flex gap-2 mt-1">
                             <span className="flex items-center gap-1 text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase">
                               <Globe className="w-2 h-2" /> {selectedPayout.country}
                             </span>
                             <span className="flex items-center gap-1 text-[8px] font-black bg-muted text-muted-foreground px-1.5 py-0.5 rounded uppercase">
                               <Phone className="w-2 h-2" /> {selectedPayout.phone}
                             </span>
                          </div>
                        </div>
                    </div>

                    {/* Crypto & Wallet Details */}
                    <div className="bg-background border border-border rounded-2xl p-4 space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        <Bitcoin className="w-3 h-3" /> Crypto Settlement Address
                      </p>
                      <div className="p-2.5 bg-muted/30 rounded-lg break-all">
                         <p className="text-[10px] font-mono font-bold leading-tight">{selectedPayout.cryptoAddress}</p>
                      </div>
                    </div>

                    {/* Math Calculation: Gross - Commission */}
                    <div className="space-y-3 border-t border-border pt-6">
                       <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight">
                         <span className="opacity-50">Gross Platform Sale</span>
                         <span>₦{selectedPayout.gross.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight text-destructive">
                         <span className="opacity-50 italic">Platform Commission (10%)</span>
                         <span>- ₦{selectedPayout.commission.toLocaleString()}</span>
                       </div>
                       <div className="h-[1px] bg-border my-2" />
                       <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Final Amount</p>
                            <p className="text-2xl font-black italic tracking-tighter text-primary leading-none">
                              ₦{selectedPayout.net.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                             <span className="text-[8px] font-black px-2 py-1 rounded bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-widest">
                               Ready
                             </span>
                          </div>
                       </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-4">
                       <button 
                        onClick={() => handlePayoutAction(selectedPayout.id, "On hold")}
                        className="flex items-center justify-center gap-2 border-2 border-destructive text-destructive py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-destructive hover:text-white transition-all"
                       >
                         <Ban className="w-3 h-3" /> Hold
                       </button>
                       <button 
                        onClick={() => handlePayoutAction(selectedPayout.id, "Paid")}
                        className="flex items-center justify-center gap-2 bg-foreground text-background py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg"
                       >
                         <CheckCircle2 className="w-3 h-3" /> Mark Paid
                       </button>
                    </div>
                    
                    <p className="text-[8px] font-bold text-center opacity-30 uppercase tracking-[0.2em]">
                      Security Hash: {selectedPayout.id}-SEC-2026
                    </p>
                  </div>
                ) : (
                  <div className="h-[500px] border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-center p-12 opacity-30">
                    <Banknote className="w-16 h-16 mb-6" />
                    <h4 className="text-xl font-black uppercase italic">Awaiting Selection</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest mt-2 leading-relaxed">
                      Select a pending request to verify seller credentials and initiate crypto or bank settlement
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