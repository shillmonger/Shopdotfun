"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Store, 
  Clock, 
  ShoppingBag, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle2, 
  Mail, 
  AlertCircle,
  ChevronRight,
  Activity,
  Globe,
  Phone
} from "lucide-react";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

interface PlatformStats {
  totalBuyers: number;
  totalSellers: number;
  totalOrders: number;
  pendingPayments: number;
  pendingProductApprovals: number;
  pendingPayouts: number;
  platformRevenue: number;
  // Updated type to reflect the user table structure
  systemAlerts: Array<{
    name: string;
    email: string;
    country: string;
    balance: number;
    phone: string;
    type: 'Buyer' | 'Seller';
    roles: string[];
    profileImage?: string;
  }>;
}

export default function AdminOverviewPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<PlatformStats>({
    totalBuyers: 0,
    totalSellers: 0,
    totalOrders: 0,
    pendingPayments: 0,
    pendingProductApprovals: 0,
    pendingPayouts: 0,
    platformRevenue: 0,
    systemAlerts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else if (response.status === 403) {
          setError('Access denied. Admin privileges required.');
        } else {
          setError('Failed to load dashboard data.');
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleBroadcastEmail = () => {
    console.log('Broadcast email clicked');
  };

  const platformStats = [
    { label: "Total Buyers", value: loading ? "..." : stats.totalBuyers.toLocaleString(), icon: Users},
    { label: "Total Sellers", value: loading ? "..." : stats.totalSellers.toLocaleString(), icon: Store},
    { label: "Overall Orders", value: loading ? "..." : stats.totalOrders.toLocaleString(), icon: ShoppingBag},
    { label: "Pending Payments", value: loading ? "..." : `$${stats.pendingPayments.toLocaleString()}`, icon: DollarSign},
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 pb-32">
          <div className="max-w-[1600px] mx-auto w-full">
            
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <p className="text-sm font-bold text-destructive">{error}</p>
                </div>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  Admin <span className="text-primary not-italic">Terminal</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <Activity className="w-3 h-3 text-primary" /> Live platform heartbeat &bull; 2026
                </p>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={handleBroadcastEmail}
                  className="flex-1 md:flex-none bg-foreground text-background px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Broadcast Email
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {platformStats.map((stat, i) => (
                <div key={i} className="bg-card border border-border p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                  <stat.icon className="absolute -right-2 -bottom-2 w-20 h-20 opacity-5 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black italic tracking-tighter">{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* Urgent Priority Items */}
            <div className="space-y-6 mb-10">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 px-2">
                <ShieldAlert className="w-4 h-4 text-primary" /> Urgent Priority Items
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Approvals - Updated Link */}
                <div 
                  onClick={() => handleNavigation('/general-dashboard/admin-dashboard/product-control')}
                  className="bg-card border-2 border-primary/20 rounded-[2rem] p-6 hover:border-primary transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <span className="bg-primary text-white dark:text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">
  {loading ? '...' : `${stats.pendingProductApprovals} Pending`}
</span>

                  </div>
                  <h4 className="text-lg font-black uppercase italic tracking-tighter">Product Approval</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Review product listings & details</p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
                    Go to Queue <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Pending Payouts - Link stays the same as requested */}
                <div 
                  onClick={() => handleNavigation('/general-dashboard/admin-dashboard/sellers-payouts')}
                  className="bg-card border-2 border-destructive/20 rounded-[2rem] p-6 hover:border-destructive transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-destructive/10 rounded-2xl text-destructive">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <span className="bg-destructive text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                      {loading ? '...' : `${stats.pendingPayouts} Pending`}
                    </span>
                  </div>
                  <h4 className="text-lg font-black uppercase italic tracking-tighter">Pending Payout</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Process seller withdrawal requests</p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-destructive group-hover:gap-4 transition-all">
                    Review Payouts <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* User Health Table - 100% Width */}
            <div className="w-full bg-card border border-border rounded-[2.5rem] overflow-hidden">
              <div className="p-8 border-b border-border flex items-center justify-between bg-muted/20">
                <div>
                  <h4 className="text-lg font-black uppercase italic tracking-tighter italic">Platform User Directory</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">System Health & Live User Monitoring</p>
                </div>
                <Activity className="w-6 h-6 text-primary animate-pulse" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/10 border-b border-border">
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest">User Profile</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Role</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Location</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Contact</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <div className="animate-spin w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full" />
                        </td>
                      </tr>
                    ) : stats.systemAlerts.length > 0 ? (
                      stats.systemAlerts.map((user, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <img 
                                src={user.profileImage || "https://github.com/shadcn.png"} 
                                alt="avatar" 
                                className="w-12 h-12 rounded-2xl border-2 border-border group-hover:border-primary transition-all" 
                              />
                              <div>
                                <p className="text-sm font-black uppercase italic tracking-tighter">{user.name}</p>
                                <span className="text-[10px] font-bold text-muted-foreground lowercase">{user.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col gap-1">
                              <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded w-fit ${user.type === 'Seller' ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-500'}`}>
                                {user.type}
                              </span>
                              {user.roles.includes('admin') && (
                                <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded w-fit bg-purple-500/10 text-purple-500">
                                  Admin
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                              <p className="text-[11px] font-bold uppercase">{user.country}</p>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                              <p className="text-[11px] font-mono font-bold tracking-tight text-muted-foreground">{user.phone}</p>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <p className="text-lg font-black italic tracking-tighter">${user.balance?.toLocaleString() || '0'}</p>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-20 text-center text-muted-foreground uppercase text-[10px] font-black tracking-widest">
                          No active users found in heartbeat log
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>

        <AdminNav />
      </div>
    </div>
  );
}