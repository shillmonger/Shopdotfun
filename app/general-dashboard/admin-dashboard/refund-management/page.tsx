"use client";

import React, { useState } from "react";
import { 
  RotateCcw, 
  Search, 
  Filter, 
  ArrowLeftRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  FileText,
  DollarSign,
  History,
  Lock,
  ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// Mock Refund Data
const INITIAL_REFUNDS = [
  {
    id: "REF-44091",
    orderId: "ORD-5520",
    buyer: "Samuel Eto",
    amount: "450.00 USDT",
    reason: "Damaged Item on Arrival",
    status: "Pending",
    date: "Jan 21, 2026",
    paymentMethod: "Crypto Transfer"
  },
  {
    id: "REF-44095",
    orderId: "ORD-6612",
    buyer: "Janet Jackson",
    amount: "120.00 USDT",
    reason: "Order Cancellation",
    status: "Processed",
    date: "Jan 19, 2026",
    paymentMethod: "Wallet Balance"
  }
];

export default function AdminRefundPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refunds, setRefunds] = useState(INITIAL_REFUNDS);
  const [selectedRefund, setSelectedRefund] = useState<typeof INITIAL_REFUNDS[0] | null>(null);
  const [processing, setProcessing] = useState(false);

  const triggerRefund = async (id: string) => {
    setProcessing(true);
    // Simulate Gateway API Call
    setTimeout(() => {
      setRefunds(prev => prev.map(r => r.id === id ? { ...r, status: "Processed" } : r));
      setProcessing(false);
      setSelectedRefund(null);
      toast.success("Reversal Successful", {
        description: `Refund &quot;${id}&quot; has been executed via the original payment gateway.`
      });
    }, 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  Refund <span className="text-primary not-italic">Engine</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <RotateCcw className="w-3 h-3 text-primary" /> Financial Reversals &bull; Ledger Management
                </p>
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search Refund ID..." 
                    className="bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-xs font-bold outline-none w-64 focus:ring-2 ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* A. Refund List Table */}
              <div className="lg:col-span-8 bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                   <div className="flex items-center gap-2">
                     <History className="w-4 h-4 opacity-50" />
                     <h3 className="text-[10px] font-black uppercase tracking-widest">Active Requests</h3>
                   </div>
                   <Filter className="w-4 h-4 opacity-30 cursor-pointer hover:opacity-100" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/10 border-b border-border">
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Reference</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Order</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Amount</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {refunds.map((refund) => (
                        <tr key={refund.id} className={`group hover:bg-muted/30 transition-colors ${selectedRefund?.id === refund.id ? 'bg-primary/5' : ''}`}>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="font-black text-xs uppercase italic tracking-tighter">{refund.id}</span>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase">{refund.date}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                             <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                               <FileText className="w-3 h-3 opacity-30" /> {refund.orderId}
                             </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="font-black text-sm italic">{refund.amount}</span>
                          </td>
                          <td className="px-6 py-5 text-right">
                             <button 
                               onClick={() => setSelectedRefund(refund)}
                               className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${
                                 refund.status === "Processed" 
                                 ? "bg-green-500/10 text-green-500 border-green-500/20 cursor-default" 
                                 : "bg-background border-border hover:border-primary"
                               }`}
                             >
                               {refund.status === "Processed" ? "Processed" : "Review"}
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* B. Process Panel */}
              <div className="lg:col-span-4">
                {selectedRefund ? (
                  <div className="bg-card border-2 border-primary rounded-[3rem] p-8 space-y-6 sticky top-24 shadow-2xl">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">Execute Reversal</h3>
                      <button onClick={() => setSelectedRefund(null)}><XCircle className="w-5 h-5 opacity-40 hover:opacity-100"/></button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between p-4 bg-muted/30 rounded-2xl border border-border">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase opacity-50">Refund Amount</p>
                          <p className="text-xl font-black italic text-primary">{selectedRefund.amount}</p>
                        </div>
                        <DollarSign className="w-8 h-8 opacity-10" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                          <span className="opacity-50">Buyer:</span>
                          <span>{selectedRefund.buyer}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                          <span className="opacity-50">Method:</span>
                          <span>{selectedRefund.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight text-destructive">
                          <span className="opacity-50">Reason:</span>
                          <span className="italic">{selectedRefund.reason}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border space-y-4">
                      <div className="flex items-center gap-3 bg-primary/5 p-4 rounded-xl border border-primary/10">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <p className="text-[9px] font-bold uppercase leading-tight">
                          Payment Gateway is online. Verification of &quot;Original TxID&quot; completed.
                        </p>
                      </div>

                      <button 
                        disabled={processing}
                        onClick={() => triggerRefund(selectedRefund.id)}
                        className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl ${
                          processing ? "bg-muted cursor-not-allowed" : "bg-foreground text-background hover:bg-primary shadow-primary/10"
                        }`}
                      >
                        {processing ? (
                          <> <RotateCcw className="w-4 h-4 animate-spin" /> Communicating...</>
                        ) : (
                          <> <ArrowLeftRight className="w-4 h-4" /> Trigger Gateway Refund</>
                        )}
                      </button>

                      <p className="text-[8px] text-center font-bold text-muted-foreground uppercase">
                        Action will update order records and seller payouts automatically.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-center p-12 opacity-30">
                    <Lock className="w-12 h-12 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                      Select a request to initiate secure financial reversal logic
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Anti-Double Refund Guard */}
            <div className="mt-8 bg-amber-500/5 border border-amber-500/20 rounded-[2rem] p-6 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <h4 className="text-[11px] font-black uppercase text-amber-500 mb-1">Double-Refund Guard Active</h4>
                <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-tight leading-relaxed">
                  System prevents multiple refund executions for the same Order ID. Status &quot;Processed&quot; is terminal. All gateway responses are logged for reconciliation audits.
                </p>
              </div>
            </div>

          </div>
        </main>

        <AdminNav />
      </div>
    </div>
  );
}