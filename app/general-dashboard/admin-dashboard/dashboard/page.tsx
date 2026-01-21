"use client";

import React, { useState } from "react";
import { 
  Users, 
  Store, 
  Clock, 
  ShoppingBag, 
  DollarSign, 
  ShieldAlert, 
  ArrowUpRight, 
  CheckCircle2, 
  Mail, 
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Activity
} from "lucide-react";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

export default function AdminOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Aggregated Platform Stats
  const platformStats = [
    { label: "Total Buyers", value: "12,840", icon: Users, trend: "+12%" },
    { label: "Total Sellers", value: "1,205", icon: Store, trend: "+5%" },
    { label: "Orders Today", value: "482", icon: ShoppingBag, trend: "+18%" },
    { label: "Total Revenue", value: "$1.2M", icon: DollarSign, trend: "+24%" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 pb-32">
          <div className="max-w-7xl mx-auto">
            
            {/* Header & Quick Sync */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  Admin <span className="text-primary not-italic">Terminal</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <Activity className="w-3 h-3 text-primary" /> Live platform heartbeat &bull; Jan 2026
                </p>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none bg-foreground text-background px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" /> Broadcast Email
                </button>
              </div>
            </div>

            {/* A. Platform Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {platformStats.map((stat, i) => (
                <div key={i} className="bg-card border border-border p-6 rounded-[2rem] shadow-sm relative overflow-hidden group">
                  <stat.icon className="absolute -right-2 -bottom-2 w-20 h-20 opacity-5 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-black italic tracking-tighter">{stat.value}</h3>
                    <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {stat.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* B. Alerts & Urgent Actions */}
              <div className="lg:col-span-8 space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 px-2">
                  <ShieldAlert className="w-4 h-4 text-primary" /> Urgent Priority Items
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Seller Approvals */}
                  <div className="bg-card border-2 border-primary/20 rounded-[2rem] p-6 hover:border-primary transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <Clock className="w-6 h-6" />
                      </div>
                      <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">12 Pending</span>
                    </div>
                    <h4 className="text-lg font-black uppercase italic tracking-tighter">Seller Approvals</h4>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Review merchant KYC &amp; store details</p>
                    <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
                      Go to Queue <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Open Disputes */}
                  <div className="bg-card border-2 border-destructive/20 rounded-[2rem] p-6 hover:border-destructive transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-destructive/10 rounded-2xl text-destructive">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <span className="bg-destructive text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">8 Active</span>
                    </div>
                    <h4 className="text-lg font-black uppercase italic tracking-tighter">Open Disputes</h4>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Resolve buyer-seller escrow conflicts</p>
                    <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-destructive group-hover:gap-4 transition-all">
                      Review Tickets <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* System Alerts */}
                <div className="bg-muted/30 border border-border rounded-[2rem] p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xs font-black uppercase tracking-widest">System Health Alerts</h4>
                    <span className="text-[9px] font-black text-muted-foreground uppercase px-2 py-1 bg-muted rounded-lg">Last 24 Hours</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { msg: "Failed Payout to ID #SEL-990 (Invalid Wallet)", time: "2h ago", type: "error" },
                      { msg: "Platform Reserve Balance below $50k threshold", time: "5h ago", type: "warning" },
                      { msg: "Spike in &quot;Item Not Received&quot; reports from Region: West", time: "8h ago", type: "warning" }
                    ].map((alert, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
                        <div className="flex items-center gap-3">
                          <AlertCircle className={`w-4 h-4 ${alert.type === 'error' ? 'text-destructive' : 'text-amber-500'}`} />
                          <p className="text-[11px] font-bold uppercase tracking-tight">{alert.msg}</p>
                        </div>
                        <span className="text-[9px] font-black text-muted-foreground">{alert.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* C. Quick Actions & Balance */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Platform Balance */}
                <div className="bg-foreground text-background rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1">Platform Revenue (Net)</p>
                    <h3 className="text-4xl font-black italic tracking-tighter">$248,390.00</h3>
                    <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase opacity-60">Admin Fees Collected</span>
                        <span className="text-xs font-black italic text-primary">+$12,400</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase opacity-60">Withdrawals Processed</span>
                        <span className="text-xs font-black italic">-$8,200</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                </div>

                {/* Quick Task List */}
                <div className="bg-card border border-border rounded-[2rem] p-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" /> Admin Tasks
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Update Platform Fees",
                      "View User Logs",
                      "Manage Categories",
                      "Maintenance Mode"
                    ].map((task) => (
                      <button key={task} className="w-full text-left p-3 rounded-xl hover:bg-muted transition-colors text-[10px] font-bold uppercase flex justify-between items-center border border-transparent hover:border-border">
                        {task} <ArrowUpRight className="w-3 h-3 opacity-30" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>

        <AdminNav />
      </div>
    </div>
  );
}