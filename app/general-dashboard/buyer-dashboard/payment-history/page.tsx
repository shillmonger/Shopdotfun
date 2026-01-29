"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Download, 
  Receipt, 
  Search, 
  ArrowUpRight, 
  PiggyBank, 
  CreditCard, 
  Building2,
  Wallet,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Calendar,
  Filter,
  Loader2
} from "lucide-react";

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

interface Payment {
  _id: string;
  buyerInfo: {
    orderTotal: number;
    amountToPay: number;
    username: string;
    email: string;
    phoneNumber: string;
    country: string;
    cryptoMethodUsed: string;
    timePaid: string;
  };
  productsInfo: Array<{
    productCode: string;
    name: string;
    price: number;
    sellerInfo: {
      sellerName: string;
      sellerEmail: string;
    };
  }>;
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled' | 'approved' | 'rejected';
  cryptoAmount: string;
  cryptoAddress: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentStats {
  totalApproved: number;
  pendingCount: number;
  rejectedCount: number;
  approvedCount: number;
}

export default function PaymentHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalApproved: 0,
    pendingCount: 0,
    rejectedCount: 0,
    approvedCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch payments and stats on component mount
  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/buyer/payments');
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      const data = await response.json();
      setPayments(data.payments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/buyer/payments/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "confirmed":
      case "approved":
        return { color: "text-green-500 bg-green-500/10", icon: CheckCircle2, label: "Approved" };
      case "pending":
        return { color: "text-yellow-500 bg-yellow-500/10", icon: RotateCcw, label: "Pending" };
      case "rejected":
        return { color: "text-red-500 bg-red-500/10", icon: XCircle, label: "Rejected" };
      case "failed":
      case "cancelled":
        return { color: "text-destructive bg-destructive/10", icon: XCircle, label: "Rejected" };
      default:
        return { color: "text-muted-foreground bg-muted", icon: Receipt, label: status };
    }
  };

  const getCryptoMethodDisplay = (method: string) => {
    const methodMap: { [key: string]: string } = {
      'btc': 'Bitcoin',
      'eth': 'Ethereum',
      'usdt': 'USDT',
      'vtc': 'Vertcoin',
      'ltc': 'Litecoin'
    };
    return methodMap[method.toLowerCase()] || method.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const filteredPayments = payments.filter(payment => 
    payment._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.buyerInfo.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <PiggyBank className="w-3 h-3 text-primary" /> View all your transactions
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
                <button className="p-2 border border-border cursor-pointer rounded-xl hover:bg-muted transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {/* Total Approved Amount */}
              <div className="bg-card border border-border p-5 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Totals
                </p>
                <p className="text-2xl font-black italic tracking-tighter mt-1">
                  ${stats.totalApproved.toFixed(2)}
                </p>
              </div>

              {/* Pending Payments */}
              <div className="bg-card border border-border p-5 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Pending
                </p>
                <p className="text-2xl font-black italic tracking-tighter mt-1 text-yellow-500">
                  {stats.pendingCount}
                </p>
              </div>

              {/* Rejected Payments */}
              <div className="bg-card border border-border p-5 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Rejected
                </p>
                <p className="text-2xl font-black italic tracking-tighter mt-1 text-red-500">
                  {stats.rejectedCount}
                </p>
              </div>

              {/* Approved Payments */}
              <div className="bg-card border border-border p-5 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Approved
                </p>
                <p className="text-2xl font-black italic tracking-tighter mt-1 text-green-500">
                  {stats.approvedCount}
                </p>
              </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-20">
                  <p className="text-destructive">{error}</p>
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="bg-card border border-dashed border-border rounded-3xl py-20 px-10 text-center flex flex-col items-center justify-center">
                <div className="relative mb-8 group flex flex-col items-center">
                  <img
                    src="https://i.postimg.cc/268cCWkr/Electric-Socket-With-A-Plug-Voltage-Adapter-Unplug-PNG-and-Vector-with-Transparent-Background-for.png"
                    alt="Empty payment History"
                    className="w-44 h-44 object-contain cursor-pointer grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out relative z-10"
                  />
                </div>

                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Your Payment History is empty</h2>
                <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest mt-2 mb-8">
                  Looks like your Payment History is empty.
                </p>
                
                <Link 
                  href="/general-dashboard/buyer-dashboard/cart" 
                  className="inline-block bg-foreground text-background cursor-pointer px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground hover:shadow-[0_10px_30px_rgba(var(--primary),0.3)] transition-all"
                >
                  Make First Payment 
                </Link>
              </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment ID</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Method</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredPayments.map((payment) => {
                        const statusConfig = getStatusConfig(payment.status);
                        const StatusIcon = statusConfig.icon;
                        return (
                          <tr key={payment._id} className="hover:bg-muted/30 transition-colors group">
                            <td className="px-6 py-5">
                              <p className="font-black text-sm uppercase tracking-tighter">{payment._id.slice(-8)}</p>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase">{payment.buyerInfo.email}</p>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-1.5">
                                <ArrowUpRight className="w-3 h-3 text-primary" />
                                <span className="font-black italic">
                                  ${payment.buyerInfo.amountToPay.toFixed(2)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-[10px] font-black uppercase flex items-center gap-2">
                                <Wallet className="w-3 h-3" />
                                {getCryptoMethodDisplay(payment.buyerInfo.cryptoMethodUsed)}
                              </p>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase">
                                <Calendar className="w-3 h-3" /> {formatDate(payment.createdAt)}
                              </p>
                            </td>
                            <td className="px-6 py-5">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${statusConfig.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusConfig.label}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <button 
                                className="p-2 rounded-lg border cursor-pointer border-border hover:bg-foreground hover:text-background transition-all"
                                disabled={payment.status === 'failed' || payment.status === 'cancelled'}
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
              )}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <p className="text-[10px] font-black uppercase text-muted-foreground">
                Showing {filteredPayments.length} of {payments.length} payments
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-border rounded-xl text-[10px] font-black uppercase hover:bg-muted disabled:opacity-50" disabled>
                  Prev
                </button>
                <button className="px-4 py-2 border border-border rounded-xl text-[10px] font-black uppercase hover:bg-muted" disabled>
                  Next
                </button>
              </div>
            </div>

          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}