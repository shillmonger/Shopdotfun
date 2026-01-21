"use client";

import React, { useState } from "react";
import { 
  Clock, 
  CheckCircle2, 
  ArrowDownCircle, 
  Info, 
  ShieldAlert,
  Banknote,
  Download,
  AlertCircle
} from "lucide-react";
// import { toast } from "sonner";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

const PAYOUTS = [
  {
    id: "PAY-992-01",
    amount: 1450.00,
    gross: 1611.11,
    commission: 161.11,
    period: "Jan 01 - Jan 15, 2026",
    status: "Paid",
    method: "Bank Transfer (****6789)",
    date: "Jan 16, 2026"
  },
  {
    id: "PAY-995-04",
    amount: 820.00,
    gross: 911.11,
    commission: 91.11,
    period: "Jan 16 - Jan 20, 2026",
    status: "Pending",
    method: "Bank Transfer (****6789)",
    date: "Processing"
  }
];

export default function PayoutHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 pb-32">
          <div className="max-w-6xl mx-auto">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                  Payout <span className="text-primary not-italic tracking-normal">History</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <Banknote className="w-3 h-3 text-primary" /> Track your earnings and platform settlements
                </p>
              </div>
              <button className="flex items-center gap-2 bg-card border border-border px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Available for Payout</p>
                <p className="text-4xl font-black italic tracking-tighter mt-1">$4,200.50</p>
                <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-green-500 uppercase">
                  <CheckCircle2 className="w-3 h-3" /> Next payout in 2 days
                </div>
              </div>

              <div className="bg-card border border-border p-6 rounded-3xl opacity-60 italic">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Escrow / Pending</p>
                <p className="text-4xl font-black tracking-tighter mt-1">$1,150.00</p>
                <div className="mt-4 flex items-center gap-2 text-[9px] font-bold uppercase">
                  <Clock className="w-3 h-3" /> Locked until delivery confirm
                </div>
              </div>

              <div className="bg-primary text-primary-foreground p-6 rounded-3xl shadow-xl shadow-primary/20">
                <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">Total Withdrawn</p>
                <p className="text-4xl font-black italic tracking-tighter mt-1">$28,940</p>
                <ArrowDownCircle className="absolute top-4 right-4 w-8 h-8 opacity-20" />
              </div>
            </div>

            {/* Dispute Notice (Locked Payouts) */}
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center gap-4 mb-8">
              <ShieldAlert className="w-6 h-6 text-destructive shrink-0" />
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-tight text-destructive">Payout Locked (1 Order)</h4>
                <p className="text-[10px] font-bold uppercase opacity-70 tracking-tighter">
                  Earnings for #ORD-2026-881 are locked due to an active dispute. Resolve it to release funds.
                </p>
              </div>
            </div>

            {/* Payout Table */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Payout ID / Period</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Gross Amount</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Fee (10%)</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Net Payout</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {PAYOUTS.map((payout) => (
                      <tr key={payout.id} className="hover:bg-muted/20 transition-colors group">
                        <td className="px-6 py-5">
                          <p className="font-black text-sm uppercase italic tracking-tighter">{payout.id}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">{payout.period}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-1 rounded-md border ${
                            payout.status === "Paid" 
                            ? "bg-green-500/10 text-green-500 border-green-500/20" 
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}>
                            {payout.status === "Paid" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {payout.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-xs font-bold text-muted-foreground">${payout.gross.toFixed(2)}</td>
                        <td className="px-6 py-5 text-xs font-bold text-destructive">-${payout.commission.toFixed(2)}</td>
                        <td className="px-6 py-5 font-black italic text-base">${payout.amount.toFixed(2)}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase">{payout.method}</span>
                            <Info className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Commission Policy Note */}
            <div className="mt-8 flex items-start gap-3 bg-card border border-border p-6 rounded-3xl">
              <AlertCircle className="w-5 h-5 text-primary shrink-0" />
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest">Deduction Policy</p>
                <p className="text-[9px] text-muted-foreground font-medium uppercase leading-relaxed">
                  A 10% platform fee is deducted from the gross sale amount. This covers payment processing, 24/7 server maintenance, and marketing for your store. 
                  Payouts are released every Friday for orders marked as "Delivered" and outside the 3-day return window.
                </p>
              </div>
            </div>
          </div>
        </main>

        <SellerNav />
      </div>
    </div>
  );
}