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
    
    console.log('Requesting payout for:', selectedPayout);
    console.log('PaymentId being sent:', selectedPayout.paymentId);
    
    try {
      setIsUpdating(true);
      
      const response = await fetch('/api/seller/payment-history/update-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: selectedPayout.paymentId
        })
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
        
        setSelectedPayout(prev => 
          prev ? { ...prev, payoutStatus: 'requested' } : null
        );
        
        toast.success("Payout Requested", {
          description: `Request for Order ${selectedPayout.orderId} has been sent to the Settlement Desk.`
        });
      } else {
        throw new Error(data.error || 'Failed to request payout');
      }
    } catch (error) {
      console.error('Error requesting payout:', error);
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
            
            {/* 1. Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { label: "Available", val: `${stats.withdrawable.toLocaleString()}`, icon: Wallet, color: "text-primary" },
                { label: "Pending", val: `${stats.pending.toLocaleString()}`, icon: Clock, color: "text-amber-500" },
                { label: "Commission", val: `${stats.totalCommission.toLocaleString()}`, icon: ArrowRightLeft, color: "text-red-500" },
                { label: "Lifetime Paid", val: `${stats.totalPaid.toLocaleString()}`, icon: CheckCircle2, color: "text-green-500" },
              ].map((s, i) => (
                <div key={i} className="bg-card border border-border p-8 rounded-[2.5rem] flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-2">{s.label}</p>
                    <p className={`text-2xl font-black italic tracking-tighter ${s.color}`}>{s.val}</p>
                  </div>
                  <s.icon className={`w-8 h-8 opacity-20 ${s.color}`} />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* 2. Payout History Table */}
              <div className="lg:col-span-8 bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-border flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Earnings History</h3>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder="Search Order ID..." className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-bold outline-none" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/10 border-b border-border">
                        <th className="px-8 py-5 text-xs font-black uppercase text-muted-foreground tracking-widest">Order Details</th>
                        <th className="px-8 py-5 text-xs font-black uppercase text-muted-foreground tracking-widest">Amount</th>
                        <th className="px-8 py-5 text-xs font-black uppercase text-muted-foreground tracking-widest">Commission</th>
                        <th className="px-8 py-5 text-xs font-black uppercase text-muted-foreground tracking-widest text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {isLoading ? (
                        <tr>
                          <td colSpan={4} className="px-8 py-16 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span className="text-sm font-bold text-muted-foreground">Loading payment history...</span>
                            </div>
                          </td>
                        </tr>
                      ) : paymentHistory.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-8 py-16 text-center">
                            <p className="text-sm font-bold text-muted-foreground">No payment history found</p>
                          </td>
                        </tr>
                      ) : (
                        paymentHistory.map((p, index) => (
                          <tr 
                            key={`${p.paymentId}-${index}`} 
                            onClick={() => setSelectedPayout(p)}
                            className={`hover:bg-muted/30 cursor-pointer transition-colors ${selectedPayout?.paymentId === p.paymentId ? 'bg-primary/5' : ''}`}
                          >
                            <td className="px-8 py-6">
                              <p className="text-sm font-black uppercase tracking-tighter">{p.orderId}</p>
                              <p className="text-xs font-bold text-muted-foreground uppercase mt-1">ID: {p.paymentId.slice(0, 12)}...</p>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-sm font-black italic">${p.amountReceived.toLocaleString()}</p>
                              <p className="text-xs font-bold text-green-500 uppercase">Settlement: ${p.commission?.settlementAmount.toLocaleString() || p.amountReceived.toLocaleString()}</p>
                              <p className="text-xs font-bold text-muted-foreground uppercase">{p.cryptoMethod.toUpperCase()}</p>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-sm font-black text-red-500">-${p.commission?.commissionAmount.toLocaleString() || 0}</p>
                              <p className="text-xs font-bold text-muted-foreground uppercase">
                                {p.commission?.tier.type === 'percent' 
                                  ? `${p.commission.tier.value}%` 
                                  : `$${p.commission?.tier.value || 0}`
                                }
                              </p>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <span className={`text-xs font-black uppercase px-4 py-1.5 rounded-full border ${
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

              {/* 3. Settlement Desk Panel */}
              <div className="lg:col-span-4 h-full">
                {selectedPayout ? (
                  <div className="bg-card border-2 border-primary rounded-[3rem] p-8 space-y-6 sticky top-24 shadow-2xl">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">Settlement Desk</h3>
                      <button onClick={() => setSelectedPayout(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <XCircle className="w-6 h-6 opacity-40" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-background border border-border p-5 rounded-2xl">
                        <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                          <Hash className="w-4 h-4" /> Payment Identity
                        </p>
                        <p className="text-xs font-mono font-bold break-all opacity-70">
                          {selectedPayout.paymentId}
                        </p>
                      </div>

                      <div className="bg-muted/20 p-5 rounded-2xl border border-border space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                             <Banknote className="w-5 h-5 text-primary" />
                             <span className="text-xs font-black uppercase tracking-widest">Crypto Breakdown</span>
                          </div>
                          <span className="text-xs font-black uppercase px-3 py-1 bg-primary/10 text-primary rounded">
                            {selectedPayout.cryptoMethod}
                          </span>
                        </div>
                        <p className="text-xl font-black italic tracking-tighter">
                          {selectedPayout.cryptoAmount} <span className="text-xs not-italic text-muted-foreground uppercase">{selectedPayout.cryptoMethod}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background border border-border p-4 rounded-xl">
                          <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Order Total</p>
                          <p className="text-sm font-black italic">${selectedPayout.orderTotal}</p>
                        </div>
                        <div className="bg-background border border-border p-4 rounded-xl">
                          <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Received At</p>
                          <p className="text-xs font-bold">{new Date(selectedPayout.receivedAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {selectedPayout.commission && (
                        <div className="bg-red-50 border border-red-200 p-5 rounded-2xl space-y-4">
                          <p className="text-xs font-black text-red-600 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                            <ArrowRightLeft className="w-4 h-4" /> Commission Breakdown
                          </p>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-muted-foreground">Commission ({selectedPayout.commission.tier.type === 'percent' ? `${selectedPayout.commission.tier.value}%` : `$${selectedPayout.commission.tier.value}`}):</span>
                              <span className="text-xs font-black text-red-500">-${selectedPayout.commission.commissionAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-muted-foreground">Original Amount:</span>
                              <span className="text-xs font-black text-gray-600">${selectedPayout.commission.originalAmount.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-red-200 pt-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-black text-green-600">Settlement Amount:</span>
                                <span className="text-sm font-black text-green-600">${selectedPayout.commission.settlementAmount.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-border pt-6 mt-4">
                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <p className="text-xs font-black text-muted-foreground uppercase">Settlement Amount</p>
                          <p className="text-3xl font-black italic tracking-tighter text-primary">${selectedPayout.commission?.settlementAmount.toLocaleString() || selectedPayout.amountReceived.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-black text-muted-foreground uppercase">Status</p>
                           <p className="text-sm font-black uppercase text-amber-500">{selectedPayout.payoutStatus}</p>
                        </div>
                      </div>

                      <button 
                        disabled={selectedPayout.payoutStatus === "paid" || selectedPayout.payoutStatus === "requested" || isUpdating}
                        onClick={handleRequestPayout}
                        className={`w-full py-5 rounded-2xl text-xs cursor-pointer font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                          selectedPayout.payoutStatus === "paid" || selectedPayout.payoutStatus === "requested"
                          ? "bg-muted text-muted-foreground cursor-not-allowed" 
                          : "bg-foreground text-background hover:bg-primary shadow-xl"
                        }`}
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                          </>
                        ) : selectedPayout.payoutStatus === "paid" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Already Settled
                          </>
                        ) : selectedPayout.payoutStatus === "requested" ? (
                          <>
                            <Clock className="w-4 h-4" />
                            Requested
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Request Payout Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-[500px] border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-center p-12 opacity-30">
                    <FileText className="w-20 h-20 mb-6" />
                    <h4 className="text-2xl font-black uppercase italic">Settlement Desk</h4>
                    <p className="text-sm font-black uppercase tracking-widest mt-4 leading-relaxed">
                      Select a transaction to view detailed crypto breakdowns and request withdrawal to your wallet
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