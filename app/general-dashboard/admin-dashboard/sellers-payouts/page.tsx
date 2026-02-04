"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Bitcoin,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// Types
interface CryptoPayoutDetail {
  walletName: string;
  walletAddress: string;
  network: string;
  currency: string;
  isDefault: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaymentHistory {
  paymentId: string;
  amountReceived: number;
  cryptoAmount: string;
  cryptoMethod: string;
  orderTotal: number;
  orderId: string;
  payoutStatus: string;
  receivedAt: string;
  commission?: {
    tier: {
      id: string;
      min: number;
      max: number | null;
      type: string;
      value: number;
    };
    commissionAmount: number;
    settlementAmount: number;
    originalAmount: number;
  };
}

interface Seller {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  businessName: string;
  businessAddress: string;
  profileImage: string;
  status: string;
  cryptoPayoutDetails: CryptoPayoutDetail[];
  paymentHistory: PaymentHistory[];
  requestedPayments: PaymentHistory[];
}

export default function AdminPayoutManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedPayout, setSelectedPayout] = useState<{seller: Seller; payment: PaymentHistory} | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingPaymentId, setUpdatingPaymentId] = useState<string | null>(null);

  // Fetch sellers with requested payouts
  const fetchSellersWithRequestedPayouts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/sellers-payouts');
      if (!response.ok) {
        throw new Error('Failed to fetch sellers');
      }
      const data = await response.json();
      setSellers(data);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast.error('Error', {
        description: 'Failed to fetch sellers with requested payouts'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellersWithRequestedPayouts();
  }, []);

  // Flatten all requested payments from all sellers for display
  const allRequestedPayouts = useMemo(() => {
    const payouts: {seller: Seller; payment: PaymentHistory}[] = [];
    sellers.forEach(seller => {
      seller.requestedPayments.forEach(payment => {
        payouts.push({ seller, payment });
      });
    });
    return payouts;
  }, [sellers]);

  // Filter payouts based on search term
  const filteredPayouts = useMemo(() => {
    if (!searchTerm) return allRequestedPayouts;
    
    return allRequestedPayouts.filter(({ seller, payment }) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        seller.name.toLowerCase().includes(searchLower) ||
        seller.email.toLowerCase().includes(searchLower) ||
        seller.businessName.toLowerCase().includes(searchLower) ||
        payment.orderId.toLowerCase().includes(searchLower) ||
        payment.paymentId.toLowerCase().includes(searchLower)
      );
    });
  }, [allRequestedPayouts, searchTerm]);

  const stats = useMemo(() => ({
    totalPending: allRequestedPayouts.length,
    amountPending: allRequestedPayouts.reduce((acc, { payment }) => acc + (payment.commission?.settlementAmount || payment.amountReceived), 0),
    paidToday: 0, // This would need to be calculated based on today's payments
    heldCount: 0 // No held payments in requested status
  }), [allRequestedPayouts]);

  const handleMarkAsPaid = async (sellerId: string, paymentId: string) => {
    try {
      setUpdatingPaymentId(paymentId);
      
      const response = await fetch('/api/admin/sellers-payouts/update-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sellerId, paymentId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      const result = await response.json();
      
      toast.success('Payment Updated', {
        description: `Payout ${paymentId} has been marked as paid.`
      });

      // Refresh the data
      await fetchSellersWithRequestedPayouts();
      setSelectedPayout(null);
      
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Error', {
        description: 'Failed to mark payment as paid'
      });
    } finally {
      setUpdatingPaymentId(null);
    }
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
                    <input 
                      type="text" 
                      placeholder="Search Seller..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold outline-none" 
                    />
                  </div>
                  {!loading && (
                    <button
                      onClick={fetchSellersWithRequestedPayouts}
                      className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-colors"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      Refresh
                    </button>
                  )}
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
                      {loading ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-12 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span className="text-xs font-bold text-muted-foreground">Loading sellers with requested payouts...</span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredPayouts.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-12 text-center">
                            <div className="space-y-2">
                              <Banknote className="w-12 h-12 mx-auto opacity-20" />
                              <p className="text-xs font-bold text-muted-foreground">
                                {searchTerm ? 'No sellers found matching your search' : 'No sellers with requested payouts'}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredPayouts.map(({ seller, payment }) => (
                          <tr 
                            key={`${seller._id}-${payment.paymentId}`}
                            onClick={() => setSelectedPayout({ seller, payment })}
                            className={`hover:bg-muted/30 cursor-pointer transition-colors ${
                              selectedPayout?.seller._id === seller._id && selectedPayout?.payment.paymentId === payment.paymentId ? 'bg-primary/5' : ''
                            }`}
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={seller.profileImage || 'https://github.com/shadcn.png'} 
                                  alt={seller.name} 
                                  className="w-10 h-10 rounded-full border-2 border-primary/20 bg-muted" 
                                />
                                <div>
                                  <p className="font-black text-xs uppercase italic tracking-tighter">{seller.name}</p>
                                  <p className="text-[10px] font-bold text-muted-foreground">{seller.email}</p>
                                  <p className="text-[9px] text-muted-foreground mt-1">{seller.businessName}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-xs font-black italic">
                                ₦{(payment.commission?.settlementAmount || payment.amountReceived).toLocaleString()}
                              </p>
                              <p className="text-[9px] font-bold text-muted-foreground uppercase">{payment.paymentId}</p>
                              <p className="text-[8px] text-muted-foreground mt-1">{payment.orderId}</p>
                            </td>
                            <td className="px-6 py-5 text-right">
                               <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full border bg-amber-500/10 text-amber-500 border-amber-500/20">
                                 {payment.payoutStatus}
                               </span>
                            </td>
                          </tr>
                        ))
                      )}
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
                        <img 
                          src={selectedPayout.seller.profileImage || 'https://github.com/shadcn.png'} 
                          alt="Seller" 
                          className="w-14 h-14 rounded-2xl border-2 border-primary" 
                        />
                        <div className="overflow-hidden">
                          <p className="text-sm font-black uppercase italic tracking-tighter truncate">{selectedPayout.seller.name}</p>
                          <p className="text-[10px] font-bold text-muted-foreground truncate">{selectedPayout.seller.email}</p>
                          <p className="text-[9px] text-muted-foreground mt-1">{selectedPayout.seller.businessName}</p>
                          <div className="flex gap-2 mt-1">
                             <span className="flex items-center gap-1 text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase">
                               <Globe className="w-2 h-2" /> {selectedPayout.seller.country}
                             </span>
                             <span className="flex items-center gap-1 text-[8px] font-black bg-muted text-muted-foreground px-1.5 py-0.5 rounded uppercase">
                               <Phone className="w-2 h-2" /> {selectedPayout.seller.phone}
                             </span>
                          </div>
                        </div>
                    </div>

                    {/* Crypto & Wallet Details */}
                    <div className="bg-background border border-border rounded-2xl p-4 space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        <Bitcoin className="w-3 h-3" /> Crypto Settlement Address
                      </p>
                      {selectedPayout.seller.cryptoPayoutDetails && selectedPayout.seller.cryptoPayoutDetails.length > 0 ? (
                        <div className="space-y-2">
                          {selectedPayout.seller.cryptoPayoutDetails.map((wallet, index) => (
                            <div key={index} className="p-3 bg-muted/30 rounded-lg space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-primary uppercase">{wallet.walletName}</span>
                                {wallet.isDefault && (
                                  <span className="text-[7px] font-black bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded uppercase">Default</span>
                                )}
                              </div>
                              <p className="text-[10px] font-mono font-bold leading-tight break-all">{wallet.walletAddress}</p>
                              <div className="flex gap-2">
                                <span className="text-[8px] font-black bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{wallet.network}</span>
                                <span className="text-[8px] font-black bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{wallet.currency}</span>
                                {wallet.verified && (
                                  <span className="text-[8px] font-black bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded">Verified</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2.5 bg-muted/30 rounded-lg">
                           <p className="text-[10px] font-bold text-muted-foreground">No crypto payout details available</p>
                        </div>
                      )}
                    </div>

                    {/* Math Calculation: Gross - Commission */}
                    <div className="space-y-3 border-t border-border pt-6">
                       <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight">
                         <span className="opacity-50">Gross Platform Sale</span>
                         <span>₦{selectedPayout.payment.orderTotal.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight text-destructive">
                         <span className="opacity-50 italic">Platform Commission</span>
                         <span>- ₦{selectedPayout.payment.commission?.commissionAmount.toLocaleString() || '0'}</span>
                       </div>
                       <div className="h-[1px] bg-border my-2" />
                       <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Final Amount</p>
                            <p className="text-2xl font-black italic tracking-tighter text-primary leading-none">
                              ₦{(selectedPayout.payment.commission?.settlementAmount || selectedPayout.payment.amountReceived).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                             <span className="text-[8px] font-black px-2 py-1 rounded bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-widest">
                               Ready
                             </span>
                          </div>
                       </div>
                    </div>

                    {/* Payment Details */}
                    <div className="space-y-2 border-t border-border pt-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Payment Details</p>
                      <div className="grid grid-cols-2 gap-2 text-[9px]">
                        <div>
                          <span className="opacity-50">Payment ID:</span>
                          <p className="font-bold">{selectedPayout.payment.paymentId}</p>
                        </div>
                        <div>
                          <span className="opacity-50">Order ID:</span>
                          <p className="font-bold">{selectedPayout.payment.orderId}</p>
                        </div>
                        <div>
                          <span className="opacity-50">Crypto Amount:</span>
                          <p className="font-bold">{selectedPayout.payment.cryptoAmount} {selectedPayout.payment.cryptoMethod?.toUpperCase()}</p>
                        </div>
                        <div>
                          <span className="opacity-50">Received:</span>
                          <p className="font-bold">{new Date(selectedPayout.payment.receivedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-4">
                       <button 
                        className="flex items-center justify-center gap-2 border-2 border-destructive text-destructive py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-destructive hover:text-white transition-all"
                       >
                         <Ban className="w-3 h-3" /> Hold
                       </button>
                       <button 
                        onClick={() => handleMarkAsPaid(selectedPayout.seller._id, selectedPayout.payment.paymentId)}
                        disabled={updatingPaymentId === selectedPayout.payment.paymentId}
                        className="flex items-center justify-center gap-2 bg-foreground text-background py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         {updatingPaymentId === selectedPayout.payment.paymentId ? (
                           <>
                             <Loader2 className="w-3 h-3 animate-spin" /> Updating...
                           </>
                         ) : (
                           <>
                             <CheckCircle2 className="w-3 h-3" /> Mark Paid
                           </>
                         )}
                       </button>
                    </div>
                    
                    <p className="text-[8px] font-bold text-center opacity-30 uppercase tracking-[0.2em]">
                      Security Hash: {selectedPayout.payment.paymentId}-SEC-2026
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