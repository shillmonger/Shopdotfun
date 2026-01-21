"use client";

import React, { useState, useMemo } from "react";
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  UserX, 
  ShieldAlert,
  Clock,
  ArrowRightLeft,
  ChevronRight,
  UserCircle,
  Activity,
  UserCog
} from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// Mock User Data
const INITIAL_USERS = [
  { id: "U-882", name: "Chidi Benson", email: "chidi@example.com", role: "Buyer", status: "Active", lastLogin: "2h ago" },
  { id: "U-901", name: "Sarah Williams", email: "sarah@store.io", role: "Seller", status: "Active", lastLogin: "5m ago" },
  { id: "U-001", name: "Super Admin", email: "admin@platform.com", role: "Admin", status: "Active", lastLogin: "Now" },
  { id: "U-442", name: "David Okoro", email: "david@test.com", role: "Buyer", status: "Suspended", lastLogin: "3 days ago" },
];

export default function UserRBACPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [selectedUser, setSelectedUser] = useState<typeof INITIAL_USERS[0] | null>(null);

  // Stats Logic
  const stats = useMemo(() => ({
    total: users.length,
    sellers: users.filter(u => u.role === "Seller").length,
    buyers: users.filter(u => u.role === "Buyer").length,
    suspended: users.filter(u => u.status === "Suspended").length,
  }), [users]);

  const handleRoleChange = (userId: string, currentRole: string, newRole: string) => {
    // SECURITY RULE: Prevent self-downgrading (Assuming U-001 is current session)
    if (userId === "U-001" && newRole !== "Admin") {
      return toast.error("Privilege Lock", {
        description: "You cannot remove your own &quot;Admin&quot; privileges for security reasons."
      });
    }

    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    toast.success("Role Updated", {
      description: `User &quot;${userId}&quot; has been assigned the &quot;${newRole}&quot; role.`
    });
  };

  const handleStatusUpdate = (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Active" ? "Suspended" : "Active";
    setUsers(users.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    toast.warning(`User ${nextStatus}`, {
      description: `Account access has been ${nextStatus === "Active" ? "restored" : "revoked"}.`
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32">
          <div className="max-w-7xl mx-auto">
            
            {/* Header & Stats */}
            <div className="mb-10">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                Access <span className="text-primary not-italic">Control</span>
              </h1>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {[
                  { label: "Total Users", val: stats.total, icon: Users },
                  { label: "Total Sellers", val: stats.sellers, icon: UserPlus },
                  { label: "Total Buyers", val: stats.buyers, icon: UserCircle },
                  { label: "Suspended", val: stats.suspended, icon: ShieldAlert },
                ].map((s, i) => (
                  <div key={i} className="bg-card border border-border p-5 rounded-[2rem] flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{s.label}</p>
                      <p className="text-2xl font-black italic tracking-tighter">{s.val}</p>
                    </div>
                    <s.icon className="w-8 h-8 opacity-10 text-primary" />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* User List Table */}
              <div className="lg:col-span-8 bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder="Search by name/email..." className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-xs font-bold outline-none" />
                  </div>
                  <button className="p-2.5 bg-background border border-border rounded-xl hover:bg-muted transition-all">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border">
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">User Profile</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Role</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground text-right">Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/10 transition-colors group">
                          <td className="px-6 py-5">
                            <p className="font-black text-sm uppercase italic tracking-tighter">{user.name}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase">{user.email}</p>
                          </td>
                          <td className="px-6 py-5">
                            <select 
                              value={user.role} 
                              onChange={(e) => handleRoleChange(user.id, user.role, e.target.value)}
                              className="bg-background border border-border rounded-lg px-2 py-1 text-[10px] font-black uppercase outline-none focus:ring-1 ring-primary cursor-pointer"
                            >
                              <option value="Buyer">Buyer</option>
                              <option value="Seller">Seller</option>
                              <option value="Admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${
                              user.status === "Active" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => setSelectedUser(user)}
                                className="p-2 border border-border rounded-lg hover:bg-foreground hover:text-background transition-all"
                              >
                                <Activity className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(user.id, user.status)}
                                className={`p-2 border border-border rounded-lg transition-all ${user.status === 'Active' ? 'hover:bg-destructive hover:text-white' : 'hover:bg-green-500 hover:text-white'}`}
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Role Context & Audit Panel */}
              <div className="lg:col-span-4 space-y-6">
                {selectedUser ? (
                  <div className="bg-card border-2 border-primary rounded-[2rem] p-8 space-y-6 sticky top-24">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">Deep View</h3>
                      <button onClick={() => setSelectedUser(null)} className="text-[10px] font-bold uppercase opacity-50 underline">Close</button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <span>User UUID</span>
                        <span className="text-foreground">{selectedUser.id}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <span>Last Login</span>
                        <span className="text-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedUser.lastLogin}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">Role Permissions</p>
                      <div className="bg-background rounded-xl p-4 border border-border space-y-3">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          <span className="text-[9px] font-bold uppercase">Access to platform logs</span>
                        </div>
                        {selectedUser.role === "Admin" && (
                          <div className="flex items-center gap-3">
                            <UserCog className="w-4 h-4 text-primary" />
                            <span className="text-[9px] font-bold uppercase">Can modify seller fees</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button className="w-full py-4 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2">
                      View Linked Orders <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="bg-primary/5 border border-dashed border-primary/30 rounded-[2rem] p-10 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                      <ArrowRightLeft className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase italic tracking-tighter">Security Protocol</h4>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase leading-relaxed mt-2">
                        Admin delegations require active 2FA. Changes to &quot;Admin&quot; roles are logged in the immutable audit trail.
                      </p>
                    </div>
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