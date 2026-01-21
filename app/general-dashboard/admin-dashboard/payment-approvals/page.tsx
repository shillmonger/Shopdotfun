"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Clock, 
  Wallet, 
  User, 
  Hash, 
  AlertCircle,
  Eye,
  ShieldCheck,
  Search,
  Filter,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// Mock Data for Crypto Manual Payments
const INITIAL_PAYMENTS = [
  {
    id: "PAY-9901",
    orderId: "ORD-5520",
    buyer: "Samuel Eto",
    amount: "0.045 BTC",
    currency: "Bitcoin",
    proof: "/api/placeholder/600/400", // Representative of a transaction screenshot
    txHash: "bc1qxy2kgdy6yn3ayf373ck99f2709cvc0",
    date: "Jan 21, 2026 - 08:30 AM",
    status: "Pending"
  },
  {
    id: "PAY-9905",
    orderId: "ORD-5528",
    buyer: "Anita Baker",
    amount: "1,200.00 USDT",
    currency: "Tether (TRC20)",
    proof: "/api/placeholder/600/400",
    txHash: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    date: "Jan 20, 2026 - 11:15 PM",
    status: "Pending"
  }
];

export default function ApproveManualPaymentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [selectedPayment, setSelectedPayment] = useState<typeof INITIAL_PAYMENTS[0] | null>(null);

  const handleDecision = (id: string, decision: "Approved" | "Rejected") => {
    // Audit Requirement
    const confirmAction = window.confirm(`Are you sure you want to ${decision} this crypto payment? This action is irreversible.`);
    
    if (confirmAction) {
      setPayments(payments.map(p => p.id === id ? { ...p, status: decision } : p));
      
      if (decision === "Approved") {
        toast.success("Payment Confirmed", {
          description: `Order &quot;${selectedPayment?.orderId}&quot; has been moved to &quot;Paid&quot; status.`
        });
      } else {
        toast.error("Payment Rejected", {
          description: "Buyer has been notified to re-submit valid proof."
        });
      }
      setSelectedPayment(null);
    }
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
                Crypto <span className="text-primary not-italic">Payments</span>
              </h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                <Wallet className="w-3 h-3 text-primary" /> Arbitrating Manual Blockchain Transfers
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* A. Pending Payments List */}
              <div className="lg:col-span-7 bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Queue: {payments.filter(p => p.status === "Pending").length} Items</h3>
                  <div className="flex gap-2">
                    <button className="p-2 border border-border rounded-lg"><Search className="w-4 h-4" /></button>
                    <button className="p-2 border border-border rounded-lg"><Filter className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/10 border-b border-border">
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Order / Buyer</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Crypto Amount</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground text-right">Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {payments.map((pay) => (
                        <tr key={pay.id} className={`group hover:bg-muted/30 transition-colors ${selectedPayment?.id === pay.id ? 'bg-primary/5' : ''}`}>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="font-black text-xs uppercase italic tracking-tighter">{pay.orderId}</span>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                <User className="w-2 h-2" /> {pay.buyer}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="font-black text-sm text-primary italic">{pay.amount}</span>
                              <span className="text-[8px] font-bold opacity-50 uppercase">{pay.currency}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button 
                              onClick={() => setSelectedPayment(pay)}
                              className="p-2.5 bg-background border border-border rounded-xl group-hover:border-primary transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* B. Detail View & Decision Panel */}
              <div className="lg:col-span-5">
                {selectedPayment ? (
                  <div className="bg-card border-2 border-primary rounded-[3rem] p-8 space-y-6 sticky top-24 shadow-2xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[9px] font-black uppercase text-primary tracking-widest">Verification Desk</p>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Reviewing {selectedPayment.id}</h3>
                      </div>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 bg-muted px-2 py-1 rounded-lg">
                        <Clock className="w-3 h-3" /> {selectedPayment.date}
                      </span>
                    </div>

                    {/* Proof Image */}
                    <div className="relative group cursor-zoom-in">
                      <img 
                        src={selectedPayment.proof} 
                        className="w-full h-48 object-cover rounded-2xl border border-border" 
                        alt="Proof of transfer" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-background border border-border rounded-xl p-4">
                        <p className="text-[9px] font-black uppercase opacity-40 mb-2 flex items-center gap-1">
                          <Hash className="w-3 h-3" /> Transaction Hash
                        </p>
                        <div className="flex items-center justify-between">
                          <code className="text-[10px] font-bold text-primary break-all">{selectedPayment.txHash}</code>
                          <ExternalLink className="w-3 h-3 opacity-30 cursor-pointer hover:opacity-100" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <button 
                        onClick={() => handleDecision(selectedPayment.id, "Rejected")}
                        className="flex items-center justify-center gap-2 border-2 border-destructive text-destructive py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-destructive hover:text-white transition-all"
                      >
                        <XCircle className="w-4 h-4" /> Reject Proof
                      </button>
                      <button 
                        onClick={() => handleDecision(selectedPayment.id, "Approved")}
                        className="flex items-center justify-center gap-2 bg-green-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-green-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Confirm Payment
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-center p-12 opacity-30">
                    <ShieldCheck className="w-16 h-16 mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-[200px]">
                      Select a pending transfer to verify blockchain evidence
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Warning Section */}
            <div className="mt-8 bg-destructive/5 border border-destructive/20 rounded-[2rem] p-6 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              <p className="text-[10px] font-bold text-destructive/80 uppercase tracking-tight leading-relaxed">
                Platform Security Protocol: Manual crypto approvals bypass the automated gateway. Once an admin confirms a payment, the order is permanently marked as &quot;Paid&quot; and funds cannot be auto-reclaimed. Verify the TxHash on the block explorer before final confirmation.
              </p>
            </div>

          </div>
        </main>

        <AdminNav />
      </div>
    </div>
  );
}