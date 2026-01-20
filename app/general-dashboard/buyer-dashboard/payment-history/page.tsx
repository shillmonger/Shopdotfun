"use client";

import React, { useState } from "react";
import { 
  Download, 
  Receipt, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Building2, 
  Wallet,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Calendar,
  Filter
} from "lucide-react";

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

// Mock Transaction Data
const TRANSACTIONS = [
  {
    id: "TXN-77281902",
    orderId: "ORD-99281",
    amount: 193.50,
    method: "Visa •••• 4242",
    date: "Jan 18, 2026",
    status: "Success",
    type: "Payment"
  },
  {
    id: "TXN-77281554",
    orderId: "ORD-98102",
    amount: 45.00,
    method: "Bank Transfer",
    date: "Jan 12, 2026",
    status: "Success",
    type: "Payment"
  },
  {
    id: "TXN-REF-1120",
    orderId: "ORD-96550",
    amount: 85.00,
    method: "Wallet",
    date: "Jan 08, 2026",
    status: "Refunded",
    type: "Refund"
  },
  {
    id: "TXN-77281001",
    orderId: "ORD-95442",
    amount: 120.00,
    method: "Mastercard •••• 8812",
    date: "Jan 02, 2026",
    status: "Failed",
    type: "Payment"
  }
];

export default function PaymentHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Success": return { color: "text-green-500 bg-green-500/10", icon: CheckCircle2 };
      case "Refunded": return { color: "text-blue-500 bg-blue-500/10", icon: RotateCcw };
      case "Failed": return { color: "text-destructive bg-destructive/10", icon: XCircle };
      default: return { color: "text-muted-foreground bg-muted", icon: Receipt };
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                  Payment History
                </h1>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                  <Receipt className="w-3 h-3 text-primary" /> View all your marketplace transactions
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search Transaction ID..."
                    className="bg-card border border-border rounded-xl pl-10 pr-4 py-2 text-xs font-bold focus:ring-2 ring-primary/20 outline-none w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="p-2 border border-border rounded-xl hover:bg-muted transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats Overview (Optional Mini Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
               <div className="bg-card border border-border p-5 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Spent</p>
                  <p className="text-2xl font-black italic tracking-tighter mt-1">$2,450.00</p>
               </div>
               <div className="bg-card border border-border p-5 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Refunds</p>
                  <p className="text-2xl font-black italic tracking-tighter mt-1 text-blue-500">$85.00</p>
               </div>
               <div className="bg-card border border-border p-5 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Rewards Earned</p>
                  <p className="text-2xl font-black italic tracking-tighter mt-1 text-primary">$12.40</p>
               </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Transaction / Order</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Method</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {TRANSACTIONS.map((txn) => {
                      const StatusIcon = getStatusConfig(txn.status).icon;
                      return (
                        <tr key={txn.id} className="hover:bg-muted/30 transition-colors group">
                          <td className="px-6 py-5">
                            <p className="font-black text-sm uppercase tracking-tighter">{txn.id}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{txn.orderId}</p>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-1.5">
                              {txn.type === "Refund" ? (
                                <ArrowDownLeft className="w-3 h-3 text-blue-500" />
                              ) : (
                                <ArrowUpRight className="w-3 h-3 text-primary" />
                              )}
                              <span className={`font-black italic ${txn.type === "Refund" ? "text-blue-500" : ""}`}>
                                {txn.type === "Refund" ? "+" : ""}${txn.amount.toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-[10px] font-black uppercase flex items-center gap-2">
                              {txn.method.includes("Visa") || txn.method.includes("Mastercard") ? <CreditCard className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                              {txn.method}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase">
                              <Calendar className="w-3 h-3" /> {txn.date}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${getStatusConfig(txn.status).color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {txn.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button 
                              className="p-2 rounded-lg border border-border hover:bg-foreground hover:text-background transition-all"
                              disabled={txn.status === "Failed"}
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-8 flex items-center justify-between">
              <p className="text-[10px] font-black uppercase text-muted-foreground">Showing 4 of 24 transactions</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-border rounded-xl text-[10px] font-black uppercase hover:bg-muted disabled:opacity-50">Prev</button>
                <button className="px-4 py-2 border border-border rounded-xl text-[10px] font-black uppercase hover:bg-muted">Next</button>
              </div>
            </div>

          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}