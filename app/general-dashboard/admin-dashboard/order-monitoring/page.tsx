"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  User, 
  Store, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert,
  ArrowUpRight,
  Download,
  Calendar,
  CreditCard,
  Truck,
  MoreVertical
} from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// Mock Order Data
const INITIAL_ORDERS = [
  {
    id: "ORD-99281",
    buyer: "John Doe",
    seller: "Elite Tech",
    amount: "1,200.00 USDT",
    paymentStatus: "Completed",
    fulfillmentStatus: "Shipped",
    date: "2026-01-20",
    isDisputed: false
  },
  {
    id: "ORD-99285",
    buyer: "Sarah Connor",
    seller: "Cyberdyne Systems",
    amount: "0.05 BTC",
    paymentStatus: "Pending",
    fulfillmentStatus: "Processing",
    date: "2026-01-21",
    isDisputed: false
  },
  {
    id: "ORD-99290",
    buyer: "Kyle Reese",
    seller: "Resistance Gear",
    amount: "450.00 SOL",
    paymentStatus: "Completed",
    fulfillmentStatus: "Delayed",
    date: "2026-01-18",
    isDisputed: true
  }
];

export default function MonitorOrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders] = useState(INITIAL_ORDERS);

  const handleExport = () => {
    toast.success("Generating Export", {
      description: "Order logs for the selected period are being compiled into CSV."
    });
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
                  Order <span className="text-primary not-italic">Logs</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <ShoppingBag className="w-3 h-3 text-primary" /> Global transaction monitoring &bull; Real-time
                </p>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={handleExport}
                  className="bg-card border border-border px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export logs
                </button>
              </div>
            </div>

            {/* B. Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Order ID / Wallet..." 
                  className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-xs font-bold outline-none focus:ring-2 ring-primary/20"
                />
              </div>
              
              <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <select className="bg-transparent text-[10px] font-black uppercase outline-none flex-1">
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Custom Range</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <select className="bg-transparent text-[10px] font-black uppercase outline-none flex-1">
                  <option>All Payments</option>
                  <option>Completed</option>
                  <option>Pending</option>
                  <option>Refunded</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select className="bg-transparent text-[10px] font-black uppercase outline-none flex-1">
                  <option>All Orders</option>
                  <option>Disputed Only</option>
                  <option>Delayed Fulfillment</option>
                </select>
              </div>
            </div>

            {/* A. Orders Table */}
            <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">ID &amp; Date</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Stakeholders</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/10 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-black text-sm uppercase italic tracking-tighter group-hover:text-primary transition-colors">
                              {order.id}
                            </span>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" /> {order.date}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                              <User className="w-3 h-3 opacity-40" /> <span className="text-muted-foreground">B:</span> {order.buyer}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                              <Store className="w-3 h-3 opacity-40" /> <span className="text-muted-foreground">S:</span> {order.seller}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-black italic">{order.amount}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                              order.paymentStatus === "Completed" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            }`}>
                              {order.paymentStatus === "Completed" ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                              Pay: {order.paymentStatus}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                              order.fulfillmentStatus === "Shipped" ? "bg-primary/10 text-primary border-primary/20" : 
                              order.fulfillmentStatus === "Delayed" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-muted text-muted-foreground"
                            }`}>
                              <Truck className="w-2.5 h-2.5" /> Ship: {order.fulfillmentStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end items-center gap-2">
                            {order.isDisputed && (
                              <div className="p-2 bg-destructive/10 text-destructive rounded-lg animate-pulse" title="Active Dispute">
                                <ShieldAlert className="w-4 h-4" />
                              </div>
                            )}
                            <button className="p-2 border border-border rounded-lg hover:bg-foreground hover:text-background transition-all">
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                            <button className="p-2 border border-border rounded-lg hover:bg-muted">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lifecycle Investigation Helper */}
            <div className="mt-8 bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase italic tracking-tighter">Stuck Order Detection</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight max-w-lg leading-relaxed mt-1">
                    Orders marked as &quot;Delayed&quot; or with &quot;Completed&quot; payment but no shipping update for 72+ hours are automatically flagged. Use the audit tool to contact both parties.
                  </p>
                </div>
              </div>
              <button className="whitespace-nowrap px-8 py-4 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-primary/10">
                Run Health Check
              </button>
            </div>

          </div>
        </main>

        <AdminNav />
      </div>
    </div>
  );
}