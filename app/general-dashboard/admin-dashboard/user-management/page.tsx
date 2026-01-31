"use client";

import React, { useState, useMemo } from "react";
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Filter, 
  UserX, 
  ShieldAlert,
  Clock,
  ArrowRightLeft,
  ChevronRight,
  UserCircle,
  UserCog,
  Eye,
  CheckCircle2,
  ChevronDown,
  Mail,
  Phone,
  Globe,
  Wallet,
  MapPin,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";

// Shadcn UI Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// Mock Data structure based on your JSON
const INITIAL_USERS = [
  { 
    _id: "697631f018a6fccafd099ba5", 
    name: "Shillmonger Buyer", 
    email: "shillmonger0@gmail.com", 
    phone: "+2348059268860",
    country: "Nigeria",
    roles: ["buyer"], 
    status: "Active", 
    image: "https://github.com/shadcn.png",
    userBalance: 284.68,
    addresses: [{ street: "33/34 Ogbuozo street", city: "Enugu", state: "Ebonyi" }],
    paymentHistory: [{ amountPaid: 142.34, cryptoMethod: "usdt" }],
    createdAt: "2026-01-25T15:08:31.904Z"
  },
  { 
    _id: "69762e2c67e2d514e2dedfc2", 
    name: "Shillmonger Seller", 
    email: "seller@gmail.com", 
    phone: "+2348059268860",
    country: "Nigeria",
    businessName: "Shillmonger Products",
    businessAddress: "33/34 Ogbuozo street",
    roles: ["seller", "admin"], 
    status: "Active", 
    image: "", 
    cryptoPayoutDetails: [{ walletName: "Solana", currency: "SOL" }],
    createdAt: "2026-01-25T14:52:28.244Z"
  },
];

export default function UserRBACPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const stats = useMemo(() => ({
    total: users.length,
    sellers: users.filter(u => u.roles.includes("seller")).length,
    buyers: users.filter(u => u.roles.includes("buyer")).length,
    admins: users.filter(u => u.roles.includes("admin")).length,
  }), [users]);

  const toggleAdminRole = (userId: string) => {
    setUsers(users.map(u => {
      if (u._id === userId) {
        const hasAdmin = u.roles.includes("admin");
        const newRoles = hasAdmin 
          ? u.roles.filter(r => r !== "admin") 
          : [...u.roles, "admin"];
        
        toast.success(hasAdmin ? "Admin Access Revoked" : "Admin Access Granted");
        return { ...u, roles: newRoles };
      }
      return u;
    }));
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
                Identity <span className="text-primary not-italic">Manager</span>
              </h1>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {[
                  { label: "Total Users", val: stats.total, icon: Users },
                  { label: "Sellers", val: stats.sellers, icon: UserPlus },
                  { label: "Buyers", val: stats.buyers, icon: UserCircle },
                  { label: "Admins", val: stats.admins, icon: ShieldCheck },
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
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border">
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">User</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Assigned Roles</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-muted/10 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-primary/20">
                                <AvatarImage src={user.image} />
                                <AvatarFallback className="font-black text-xs">{user.name.substring(0,2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-black text-sm uppercase italic tracking-tighter">{user.name}</p>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-wrap gap-1">
                              {user.roles.map(role => (
                                <span key={role} className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                  role === 'admin' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border'
                                }`}>
                                  {role}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex justify-end gap-2">
                              {/* Manage Admin Rights */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase">
                                    Role Action <ChevronDown className="ml-2 w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="font-black uppercase text-[10px]">
                                  <DropdownMenuLabel>Modify Privileges</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {user.roles.includes("admin") ? (
                                    <DropdownMenuItem className="text-destructive" onClick={() => toggleAdminRole(user._id)}>
                                      Remove Admin Role
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem className="text-primary" onClick={() => toggleAdminRole(user._id)}>
                                      Make Admin
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>

                              <button 
                                onClick={() => setSelectedUser(user)}
                                className="p-2 border border-border rounded-lg hover:bg-foreground hover:text-background transition-all"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Deep View Panel */}
              <div className="lg:col-span-4">
                {selectedUser ? (
                  <div className="bg-card border-2 border-primary rounded-[2rem] p-6 sticky top-24 space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">Deep View</h3>
                      <button onClick={() => setSelectedUser(null)} className="text-[10px] font-bold uppercase opacity-50 underline">Close</button>
                    </div>

                    {/* Profile Header */}
                    <div className="flex flex-col items-center text-center space-y-3">
                      <Avatar className="h-20 w-20 border-4 border-primary">
                        <AvatarImage src={selectedUser.image} />
                        <AvatarFallback className="text-2xl font-black">{selectedUser.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-black uppercase text-lg italic tracking-tighter">{selectedUser.name}</h4>
                        <div className="flex gap-2 justify-center mt-1">
                           {selectedUser.roles.includes("seller") ? <span className="bg-blue-500/10 text-blue-500 text-[8px] px-2 py-0.5 rounded-full font-bold uppercase">Seller Account</span> : <span className="bg-orange-500/10 text-orange-500 text-[8px] px-2 py-0.5 rounded-full font-bold uppercase">Buyer Account</span>}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                       <div className="flex items-center gap-3 text-[10px] font-bold uppercase">
                          <Mail className="w-4 h-4 text-primary" /> {selectedUser.email}
                       </div>
                       <div className="flex items-center gap-3 text-[10px] font-bold uppercase">
                          <Phone className="w-4 h-4 text-primary" /> {selectedUser.phone}
                       </div>
                       <div className="flex items-center gap-3 text-[10px] font-bold uppercase">
                          <Globe className="w-4 h-4 text-primary" /> {selectedUser.country}
                       </div>
                    </div>

                    {/* Conditional Data based on Role */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      {selectedUser.roles.includes("buyer") ? (
                        <>
                          <div className="bg-muted/50 p-4 rounded-xl">
                            <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Available Balance</p>
                            <p className="text-2xl font-black italic text-primary">${selectedUser.userBalance.toFixed(2)}</p>
                          </div>
                          <div className="space-y-2">
                             <p className="text-[10px] font-black uppercase flex items-center gap-2"><MapPin className="w-3 h-3"/> Shipping Address</p>
                             <p className="text-[10px] text-muted-foreground leading-tight">{selectedUser.addresses[0]?.street}, {selectedUser.addresses[0]?.city}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-muted/50 p-4 rounded-xl">
                            <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Business Name</p>
                            <p className="text-lg font-black italic text-primary uppercase">{selectedUser.businessName}</p>
                          </div>
                          <div className="space-y-2">
                             <p className="text-[10px] font-black uppercase flex items-center gap-2"><Wallet className="w-3 h-3"/> Payout Wallet</p>
                             <p className="text-[10px] text-muted-foreground font-mono">{selectedUser.cryptoPayoutDetails[0]?.walletName} ({selectedUser.cryptoPayoutDetails[0]?.currency})</p>
                          </div>
                        </>
                      )}
                    </div>

                    <p className="text-[8px] font-bold text-center text-muted-foreground uppercase">Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                ) : (
                  <div className="h-full border-2 border-dashed border-border rounded-[2rem] flex items-center justify-center p-10 text-center">
                    <p className="text-[10px] font-black uppercase text-muted-foreground italic">Select a user to inspect deep metadata</p>
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