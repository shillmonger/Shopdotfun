"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Wallet, 
  Clock, 
  CheckCircle2, 
  History, 
  Banknote, 
  Search, 
  Plus, 
  Info,
  XCircle,
  Hash,
  Bitcoin,
  Calendar,
  ArrowRightLeft,
  FileText,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";
import { useAuth } from "@/hooks/useAuth";

interface PaymentHistory {
  paymentId: string;
  amountReceived: number;
  cryptoAmount: string;
  cryptoMethod: string;
  orderTotal: number;
  orderId: string;
  receivedAt: string;
  payoutStatus: 'pending' | 'requested' | 'paid';
  commission?: {
    tier: {
      id: string;
      min: number;
      max: number | null;
      type: 'percent' | 'flat';
      value: number;
    };
    commissionAmount: number;
    settlementAmount: number;
    originalAmount: number;
  };
}

export default function SellerPayoutRequest() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<PaymentHistory | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  const stats = useMemo(() => {
    const pendingPayments = paymentHistory.filter(p => p.payoutStatus === 'pending');
    const requestedPayments = paymentHistory.filter(p => p.payoutStatus === 'requested');
    const paidPayments = paymentHistory.filter(p => p.payoutStatus === 'paid');
    
    const pending = pendingPayments.reduce((sum, p) => sum + (p.commission?.settlementAmount || p.amountReceived), 0);
    const totalCommission = paymentHistory.reduce((sum, p) => sum + (p.commission?.commissionAmount || 0), 0);
    const totalPaid = paidPayments.reduce((sum, p) => sum + (p.commission?.settlementAmount || p.amountReceived), 0);
    
    return {
      withdrawable: pending,
      pending,
      totalCommission,
      totalPaid,
      processing: requestedPayments.length
    };
  }, [paymentHistory]);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!isAuthenticated || !user?.email) return;
      
      try {
        setIsLoading(true);
        const response = await fetch('/api/seller/payment-history');
        
        if (!response.ok) {
          throw new Error('Failed to fetch payment history');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setPaymentHistory(data.paymentHistory.map((p: any) => ({
            ...p,
            paymentId: p.paymentId.toString(),
            receivedAt: p.receivedAt
          })));
        } else {
          throw new Error(data.error || 'Failed to fetch payment history');
        }
      } catch (error) {
        console.error('Error fetching payment history:', error);
        toast.error('Failed to load payment history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [isAuthenticated, user]);

  const handleRequestPayout = async () => {
    if (!selectedPayout) return;
    
    try {
      setIsUpdating(true);
      const response = await fetch('/api/seller/payment-history/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: selectedPayout.paymentId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to request payout');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPaymentHistory(prev => 
          prev.map(p => 
            p.paymentId === selectedPayout.paymentId 
              ? { ...p, payoutStatus: 'requested' }
              : p
          )
        );
        setSelectedPayout(prev => prev ? { ...prev, payoutStatus: 'requested' } : null);
        toast.success("Payout Requested", {
          description: `Request for Order ${selectedPayout.orderId} has been sent.`
        });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to request payout');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32">
          <div className="max-w-[1600px] mx-auto">
            
            {/* 1. Statistics Cards - Font Updated */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Available", val: `$${stats.withdrawable.toLocaleString()}`, icon: Wallet, color: "text-primary" },
                { label: "Pending", val: `$${stats.pending.toLocaleString()}`, icon: Clock, color: "text-amber-500" },
                { label: "Commission", val: `$${stats.totalCommission.toLocaleString()}`, icon: ArrowRightLeft, color: "text-red-500" },
                { label: "Lifetime Paid", val: `$${stats.totalPaid.toLocaleString()}`, icon: CheckCircle2, color: "text-green-500" },
              ].map((s, i) => (
                <div key={i} className="bg-card border border-border p-6 rounded-[1rem] flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">{s.label}</p>
                    <p className={`text-2xl font-black italic tracking-tighter ${s.color}`}>{s.val}</p>
                  </div>
                  <s.icon className={`w-8 h-8 opacity-20 ${s.color}`} />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* 2. Payout History Table - Font Updated */}
              <div className="lg:col-span-8 bg-card border border-border rounded-[2.5rem] overflow-hidden">
                <div className="p-6 border-b border-border flex flex-wrap items-center justify-between gap-4 bg-muted/20">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Earnings History</h3>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder="Search Order ID..." className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold outline-none" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/10 border-b border-border">
                        <th className="px-6 py-4 text-[9px] font-black uppercase text-muted-foreground tracking-widest">Order Details</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase text-muted-foreground tracking-widest">Amount</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase text-muted-foreground tracking-widest">Commission</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase text-muted-foreground tracking-widest text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {isLoading ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span className="text-xs font-bold text-muted-foreground">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paymentHistory.map((p, index) => (
                          <tr 
                            key={`${p.paymentId}-${index}`} 
                            onClick={() => setSelectedPayout(p)}
                            className={`hover:bg-muted/30 cursor-pointer transition-colors ${selectedPayout?.paymentId === p.paymentId ? 'bg-primary/5' : ''}`}
                          >
                            <td className="px-6 py-5">
                              <p className="text-xs font-black uppercase italic tracking-tighter">{p.orderId}</p>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase">ID: {p.paymentId.slice(0, 12)}</p>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-xs font-black italic">${p.amountReceived.toLocaleString()}</p>
                              <p className="text-[9px] font-bold text-green-500 uppercase">Settlement: ${p.commission?.settlementAmount.toLocaleString() || p.amountReceived.toLocaleString()}</p>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-xs font-black text-red-500">${p.commission?.commissionAmount.toLocaleString() || 0}</p>
                              <p className="text-[9px] font-bold text-muted-foreground uppercase">
                                {p.commission?.tier.type === 'percent' ? `${p.commission.tier.value}%` : `$${p.commission?.tier.value || 0}`}
                              </p>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${
                                p.payoutStatus === "paid" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                p.payoutStatus === "requested" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              }`}>
                                {p.payoutStatus}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Settlement Desk Panel - Font Updated */}
              <div className="lg:col-span-4 h-full">
                {selectedPayout ? (
                  <div className="bg-card border-2 border-primary rounded-[3rem] p-8 space-y-6 sticky top-24 shadow-2xl">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">Settlement Desk</h3>
                      <button onClick={() => setSelectedPayout(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <XCircle className="w-5 h-5 opacity-40" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-background border border-border p-4 rounded-2xl">
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Hash className="w-3 h-3" /> Payment Identity
                        </p>
                        <p className="text-[10px] font-mono font-bold break-all opacity-70">
                          {selectedPayout.paymentId}
                        </p>
                      </div>

                      <div className="bg-muted/20 p-4 rounded-2xl border border-border space-y-2">
                         <div className="flex items-center gap-2">
                            {/* <Bitcoin className="w-4 h-4 text-primary" /> */}
                            <span className="text-[9px] font-black uppercase tracking-widest">Crypto Breakdown</span>
                         </div>
                        <p className="text-xl font-black italic tracking-tighter">
                          {selectedPayout.cryptoAmount} <span className="text-[10px] not-italic text-muted-foreground uppercase">{selectedPayout.cryptoMethod}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-background border border-border p-3 rounded-xl">
                          <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Order Total</p>
                          <p className="text-xs font-black italic">${selectedPayout.orderTotal.toLocaleString()}</p>
                        </div>
                        <div className="bg-background border border-border p-3 rounded-xl">
                          <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Received At</p>
                          <p className="text-[10px] font-bold">{new Date(selectedPayout.receivedAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {selectedPayout.commission && (
                        <div className="bg-muted/10 border border-border p-4 rounded-2xl space-y-3">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <ArrowRightLeft className="w-3 h-3" /> Commission Breakdown
                          </p>
                          <div className="space-y-2 text-[10px]">
                            <div className="flex justify-between items-center">
                              <span className="font-bold opacity-50 uppercase">Platform Fee:</span>
                              <span className="font-black text-destructive">-${selectedPayout.commission.commissionAmount.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-border pt-2 flex justify-between items-center">
                              <span className="font-black text-primary uppercase">Net Settlement:</span>
                              <span className="font-black text-primary text-xs italic">${selectedPayout.commission.settlementAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-border pt-6">
                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Final Amount</p>
                          <p className="text-3xl font-black italic tracking-tighter text-primary">
                            ${(selectedPayout.commission?.settlementAmount || selectedPayout.amountReceived).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <button 
                        disabled={selectedPayout.payoutStatus !== "pending" || isUpdating}
                        onClick={handleRequestPayout}
                        className={`w-full py-4 rounded-2xl text-[10px] cursor-pointer font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                          selectedPayout.payoutStatus !== "pending"
                          ? "bg-muted text-muted-foreground cursor-not-allowed" 
                          : "bg-foreground text-background hover:bg-primary shadow-xl"
                        }`}
                      >
                        {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                        {selectedPayout.payoutStatus === "pending" ? "Request Payout Now" : selectedPayout.payoutStatus}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-[500px] border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-center p-12 opacity-30">
                    <FileText className="w-16 h-16 mb-4" />
                    <h4 className="text-xl font-black uppercase italic">Settlement Desk</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest mt-2 leading-relaxed">
                      Select a transaction to initiate withdrawal
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>

        <SellerNav />
      </div>
    </div>
  );
}