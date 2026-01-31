"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Filter, 
  UserX, 
  ShieldAlert,
  Clock,
  ChevronRight,
  UserCircle,
  Eye,
  CheckCircle2,
  ChevronDown,
  Mail,
  Phone,
  Globe,
  Wallet,
  MapPin,
  Lock,
  Unlock,
  ShieldQuestion
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// Types
interface Buyer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  roles: string[];
  status?: string;
  profileImage?: string;
  userBalance?: number;
  addresses?: Array<{
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    isDefault: boolean;
  }>;
  paymentHistory?: Array<{
    paymentId: string;
    amountPaid: number;
    cryptoAmount: string;
    cryptoMethod: string;
    orderTotal: number;
    approvedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  userType?: 'buyer';
}

interface Seller {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  businessName?: string;
  businessAddress?: string;
  roles: string[];
  status?: string;
  profileImage?: string;
  cryptoPayoutDetails?: Array<{
    walletName: string;
    walletAddress: string;
    network: string;
    currency: string;
    isDefault: boolean;
    verified: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
  userType?: 'seller';
}

type User = Buyer | Seller;

// Fallback profile image
const FALLBACK_IMAGE = "https://github.com/shadcn.png";

export default function UserRBACPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both buyers and sellers
      const [buyersResponse, sellersResponse] = await Promise.all([
        fetch('/api/admin/users/buyers'),
        fetch('/api/admin/users/sellers')
      ]);

      if (!buyersResponse.ok || !sellersResponse.ok) {
        throw new Error('Failed to fetch users');
      }

      const buyers = await buyersResponse.json();
      const sellers = await sellersResponse.json();

      // Combine and add default status if not present
      const allUsers = [
        ...buyers.map((buyer: Buyer) => ({ 
          ...buyer, 
          userType: 'buyer',
          status: buyer.status || 'Active',
          profileImage: buyer.profileImage || FALLBACK_IMAGE
        })),
        ...sellers.map((seller: Seller) => ({ 
          ...seller, 
          userType: 'seller',
          status: seller.status || 'Active',
          profileImage: seller.profileImage || FALLBACK_IMAGE
        }))
      ];

      setUsers(allUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminRole = async (userId: string, userType: 'buyer' | 'seller') => {
    try {
      const user = users.find(u => u._id === userId);
      const hasAdmin = user?.roles.includes("admin");
      
      const response = await fetch('/api/admin/users/update-role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userType: userType + 's', // buyers or sellers
          action: hasAdmin ? 'remove' : 'add'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      // Update local state
      setUsers(users.map(u => {
        if (u._id === userId) {
          const newRoles = hasAdmin 
            ? u.roles.filter(r => r !== "admin") 
            : [...u.roles, "admin"];
          toast.success(hasAdmin ? "Admin Privileges Removed" : "Admin Privileges Granted");
          return { ...u, roles: newRoles };
        }
        return u;
      }));
    } catch (err) {
      console.error('Error updating role:', err);
      toast.error('Failed to update role');
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string, userType: 'buyer' | 'seller') => {
    try {
      const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
      
      const response = await fetch('/api/admin/users/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userType: userType + 's', // buyers or sellers
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update local state
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      toast(newStatus === "Suspended" ? "User Suspended" : "User Activated", {
        description: `Account status updated to ${newStatus}`,
        icon: newStatus === "Active" ? <Unlock className="w-4 h-4"/> : <Lock className="w-4 h-4"/>
      });
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32">
          <div className="max-w-7xl mx-auto">
            
            <div className="mb-10">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                Control <span className="text-primary not-italic">Center</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-8 bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center space-y-2">
                      <Clock className="w-8 h-8 mx-auto animate-spin opacity-50" />
                      <p className="text-[10px] font-black uppercase text-muted-foreground italic">Loading users...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center space-y-2">
                      <ShieldAlert className="w-8 h-8 mx-auto opacity-20" />
                      <p className="text-[10px] font-black uppercase text-destructive italic">{error}</p>
                      <Button onClick={fetchUsers} size="sm" className="text-[10px] font-black uppercase">
                        Retry
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-muted/30 border-b border-border">
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Identity</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Status</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Role Action</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground text-right">Status Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {users.map((user) => (
                          <tr key={user._id} className="hover:bg-muted/5 transition-colors group">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border-2 border-primary/20">
                                  <AvatarImage src={user.profileImage} />
                                  <AvatarFallback className="font-black text-xs">{user.name.substring(0,2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-black text-sm uppercase italic tracking-tighter leading-tight">{user.name}</p>
                                  <div className="flex gap-1 mt-0.5">
                                    {user.roles.map(r => (
                                      <span key={r} className={`text-[7px] font-black uppercase px-1.5 py-0 rounded border ${r === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{r}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                            
                            <td className="px-6 py-5">
                              <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${
                                user.status === "Active" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
                              }`}>
                                {user.status}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase border-dashed">
                                    <ShieldQuestion className="w-3 h-3 mr-2" /> Permissions <ChevronDown className="ml-2 w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="font-black uppercase text-[10px]">
                                  {user.roles.includes("admin") ? (
                                    <DropdownMenuItem onClick={() => toggleAdminRole(user._id, user.userType!)} className="text-destructive">
                                      Remove Admin
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => toggleAdminRole(user._id, user.userType!)} className="text-primary">
                                      Set as Admin
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>

                            <td className="px-6 py-5 text-right flex justify-end gap-2">
                               <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase">
                                      Access <ChevronDown className="ml-2 w-3 h-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="font-black uppercase text-[10px]">
                                    {user.status === "Active" ? (
                                      <DropdownMenuItem onClick={() => toggleUserStatus(user._id, user.status!, user.userType!)} className="text-destructive">
                                        <UserX className="w-3 h-3 mr-2" /> Suspend User
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={() => toggleUserStatus(user._id, user.status!, user.userType!)} className="text-green-500">
                                        <CheckCircle2 className="w-3 h-3 mr-2" /> Activate User
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Deep View */}
              <div className="lg:col-span-4">
                {(() => {
                  if (!selectedUser) {
                    return (
                      <div className="h-[400px] border-2 border-dashed border-border rounded-[2rem] flex items-center justify-center p-10 text-center">
                        <div className="space-y-2">
                          <ShieldAlert className="w-8 h-8 mx-auto opacity-20" />
                          <p className="text-[10px] font-black uppercase text-muted-foreground italic">Select user for deep inspection</p>
                        </div>
                      </div>
                    );
                  }

                  // TypeScript now knows selectedUser is not null
                  const isBuyer = selectedUser.roles.includes("buyer");
                  
                  return (
                    <div className="bg-card border-2 border-primary rounded-[2rem] p-6 sticky top-24 space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Deep View</h3>
                        <button onClick={() => setSelectedUser(null)} className="text-[10px] font-bold uppercase opacity-50 underline">Close</button>
                      </div>

                      <div className="flex flex-col items-center text-center space-y-3">
                        <Avatar className="h-20 w-20 border-4 border-primary shadow-xl">
                          <AvatarImage src={selectedUser.profileImage} />
                          <AvatarFallback className="text-2xl font-black">{selectedUser.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-black uppercase text-lg italic tracking-tighter">{selectedUser.name}</h4>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">{selectedUser._id}</p>
                          <p className="text-[8px] font-bold text-muted-foreground uppercase mt-1">{selectedUser.userType || (isBuyer ? 'buyer' : 'seller')}</p>
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
                         <div className="flex items-center gap-3 text-[10px] font-bold uppercase">
                            <Clock className="w-4 h-4 text-primary" /> {new Date(selectedUser.createdAt).toLocaleDateString()}
                         </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-border">
                        {isBuyer ? (
                          <>
                            <div className="bg-muted/50 p-4 rounded-xl">
                              <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Buyer Balance</p>
                              <p className="text-2xl font-black italic text-primary">${(selectedUser as Buyer).userBalance?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-black uppercase flex items-center gap-2"><MapPin className="w-3 h-3 text-primary"/> Address</p>
                               <p className="text-[10px] text-muted-foreground leading-tight">
                                 {(selectedUser as Buyer).addresses && (selectedUser as Buyer).addresses.length > 0 
                                   ? `${(selectedUser as Buyer).addresses[0]?.street}, ${(selectedUser as Buyer).addresses[0]?.city}`
                                   : 'No address on file'
                                 }
                               </p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-black uppercase flex items-center gap-2"><Wallet className="w-3 h-3 text-primary"/> Payment History</p>
                               <p className="text-[10px] text-muted-foreground">
                                 {(selectedUser as Buyer).paymentHistory?.length ?? 0} transactions
                               </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-muted/50 p-4 rounded-xl">
                              <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Business</p>
                              <p className="text-lg font-black italic text-primary uppercase leading-none">{(selectedUser as Seller).businessName || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-black uppercase flex items-center gap-2"><MapPin className="w-3 h-3 text-primary"/> Business Address</p>
                               <p className="text-[10px] text-muted-foreground leading-tight">{(selectedUser as Seller).businessAddress || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-black uppercase flex items-center gap-2"><Wallet className="w-3 h-3 text-primary"/> Payout Details</p>
                               <p className="text-[10px] text-muted-foreground font-mono">
                                 {(selectedUser as Seller).cryptoPayoutDetails && (selectedUser as Seller).cryptoPayoutDetails.length > 0
                                   ? `${(selectedUser as Seller).cryptoPayoutDetails[0]?.walletName} • ${(selectedUser as Seller).cryptoPayoutDetails[0]?.currency}`
                                   : 'No payout details'
                                 }
                               </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </main>
        <AdminNav />
      </div>
    </div>
  );
}