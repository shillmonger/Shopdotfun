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
  PackageSearch,
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
  ShieldQuestion,
  ShoppingCart,
  Store,
  Shield
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

const FALLBACK_IMAGE = "https://github.com/shadcn.png";

export default function UserRBACPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter State
  const [filterType, setFilterType] = useState<'all' | 'buyer' | 'seller' | 'admin'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const [buyersResponse, sellersResponse] = await Promise.all([
        fetch('/api/admin/users/buyers'),
        fetch('/api/admin/users/sellers')
      ]);

      if (!buyersResponse.ok || !sellersResponse.ok) {
        throw new Error('Failed to fetch users');
      }

      const buyers = await buyersResponse.json();
      const sellers = await sellersResponse.json();

      const allUsers = [
        ...buyers.map((buyer: Buyer) => ({ 
          ...buyer, 
          userType: 'buyer' as const,
          status: buyer.status || 'Active',
          profileImage: buyer.profileImage || FALLBACK_IMAGE
        })),
        ...sellers.map((seller: Seller) => ({ 
          ...seller, 
          userType: 'seller' as const,
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

  // Calculated Stats
  const stats = useMemo(() => {
    return {
      total: users.length,
      sellers: users.filter(u => u.userType === 'seller').length,
      buyers: users.filter(u => u.userType === 'buyer').length,
      admins: users.filter(u => u.roles.includes('admin')).length,
    };
  }, [users]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    if (filterType === 'all') return users;
    if (filterType === 'admin') return users.filter(u => u.roles.includes('admin'));
    return users.filter(u => u.userType === filterType);
  }, [users, filterType]);

  const toggleAdminRole = async (userId: string, userType: 'buyer' | 'seller') => {
    try {
      const user = users.find(u => u._id === userId);
      const hasAdmin = user?.roles.includes("admin");
      
      const response = await fetch('/api/admin/users/update-role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userType: userType + 's',
          action: hasAdmin ? 'remove' : 'add'
        })
      });

      if (!response.ok) throw new Error('Failed to update role');

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
      toast.error('Failed to update role');
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string, userType: 'buyer' | 'seller') => {
    try {
      const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
      const response = await fetch('/api/admin/users/update-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userType: userType + 's',
          status: newStatus
        })
      });

      if (!response.ok) throw new Error('Failed to update status');

      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      if (newStatus === "Suspended") {
        toast.error("User Suspended", {
          description: `Account status updated to ${newStatus}`,
          icon: <Lock className="w-4 h-4"/>
        });
      } else {
        toast.success("User Activated", {
          description: `Account status updated to ${newStatus}`,
          icon: <Unlock className="w-4 h-4"/>
        });
      }
    } catch (err) {
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
            
            <div className="mb-10 space-y-8">

  {/* HEADER */}
  <div>
    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
      Control <span className="text-primary not-italic">Center</span>
    </h1>

    <p className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
      <PackageSearch className="w-3 h-3 text-primary" />
      Managing •{stats.total}• Users
    </p>
  </div>

  {/* STATS CARDS */}
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">

  {/* TOTAL USERS */}
  <div className="relative bg-card border border-border rounded-2xl p-6 shadow-md overflow-hidden">

    <Users className="absolute top-4 right-4 w-8 h-8 text-primary/20" />

    <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
      Total Users
    </p>

    <p className="mt-3 text-2xl md:text-3xl font-black italic">
      {stats.total}
    </p>
  </div>


  {/* SELLERS */}
  <div className="relative bg-card border border-border rounded-2xl p-6 shadow-md overflow-hidden">

    <Store className="absolute top-4 right-4 w-8 h-8 text-green-500/20" />

    <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
      Total Sellers
    </p>

    <p className="mt-3 text-2xl md:text-3xl font-black italic text-primary">
      {stats.sellers}
    </p>
  </div>


  {/* BUYERS */}
  <div className="relative bg-card border border-border rounded-2xl p-6 shadow-md overflow-hidden">

    <ShoppingCart className="absolute top-4 right-4 w-8 h-8 text-blue-500/20" />

    <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
      Total Buyers
    </p>

    <p className="mt-3 text-2xl md:text-3xl font-black italic">
      {stats.buyers}
    </p>
  </div>


  {/* ADMINS */}
  <div className="relative bg-card border border-border rounded-2xl p-6 shadow-md overflow-hidden">

    <Shield className="absolute top-4 right-4 w-8 h-8 text-red-500/20" />

    <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
      Total Admins
    </p>

    <p className="mt-3 text-2xl md:text-3xl font-black italic">
      {stats.admins}
    </p>
  </div>

</div>


</div>


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-8 bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
                {/* TABLE HEADER WITH FILTER */}
                <div className="p-6 border-b border-border flex items-center justify-between bg-muted/10">
                  <p className="text-[10px] font-black uppercase italic text-muted-foreground tracking-widest">Database Registry</p>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 rounded-lg cursor-pointer text-[10px] font-black uppercase border-2">
                        <Filter className="w-3 h-3 mr-2" /> Filter: {filterType} <ChevronDown className="ml-2 w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="font-black uppercase text-[10px]">
                      <DropdownMenuItem className="cursor-pointer" onClick={() => setFilterType('all')}>All Users</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => setFilterType('buyer')}>Buyers Only</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => setFilterType('seller')}>Sellers Only</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => setFilterType('admin')}>Admins Only</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

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
                      <Button onClick={fetchUsers} size="sm" className="text-[10px] font-black uppercase">Retry</Button>
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
                        {filteredUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-muted/5 transition-colors group">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border-2 rounded-lg primary/20">
                                  <AvatarImage src={user.profileImage} />
                                  <AvatarFallback className="font-black text-xs">{user.name.substring(0,2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex gap-1 mb-1">
                                    {user.roles.map(r => (
                                      <span key={r} className={`text-[7px] font-black uppercase px-1.5 py-0 rounded border ${r === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{r}</span>
                                    ))}
                                  </div>
                                  <p className="font-black text-sm uppercase italic tracking-tighter leading-tight">{user.name}</p>
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
                                  <Button variant="outline" size="sm" className="h-8 rounded-lg cursor-pointer text-[10px] font-black uppercase border-dashed">
                                    <ShieldQuestion className="w-3 h-3 mr-2" /> Permissions <ChevronDown className="ml-2 w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="font-black uppercase text-[10px]">
                                  {user.roles.includes("admin") ? (
                                    <DropdownMenuItem onClick={() => toggleAdminRole(user._id, user.userType!)} className="text-destructive cursor-pointer font-black">
                                      Remove Admin
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => toggleAdminRole(user._id, user.userType!)} className="text-primary cursor-pointer font-black">
                                      Set as Admin
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>

                            <td className="px-6 py-5 text-right flex item-center justify-end gap-2">
                               <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="sm" className="h-8 rounded-lg cursor-pointer text-[10px] font-black uppercase">
                                      Access <ChevronDown className="ml-2 w-3 h-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="font-black uppercase text-[10px]">
                                    {user.status === "Active" ? (
                                      <DropdownMenuItem onClick={() => toggleUserStatus(user._id, user.status!, user.userType!)} className="text-destructive cursor-pointer font-black">
                                        <UserX className="w-3 h-3 mr-2" /> Suspend User
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={() => toggleUserStatus(user._id, user.status!, user.userType!)} className="text-green-500 cursor-pointer font-black">
                                        <CheckCircle2 className="w-3 h-3 mr-2" /> Activate User
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>

                                <button 
                                  onClick={() => setSelectedUser(user)}
                                  className="p-2 border border-border rounded-lg cursor-pointer hover:bg-foreground hover:text-background transition-all"
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

                  const isBuyer = selectedUser.userType === 'buyer';
                  
                  return (
                    <div className="bg-card border-2 border-primary rounded-[2rem] p-6 sticky top-24 space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Deep View</h3>
                        <button onClick={() => setSelectedUser(null)} className="text-[10px] font-bold uppercase opacity-50 underline cursor-pointer">Close</button>
                      </div>

                      <div className="flex flex-col items-center text-center space-y-3">
                        <Avatar className="h-40 w-40 border-4 rounded-2xl border-primary ">
                          <AvatarImage src={selectedUser.profileImage} />
                          <AvatarFallback className="text-2xl font-black">{selectedUser.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-black uppercase text-lg italic tracking-tighter">{selectedUser.name}</h4>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">{selectedUser._id}</p>
                          <p className="text-[8px] font-bold text-muted-foreground uppercase mt-1">{selectedUser.userType}</p>
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
                                 {(selectedUser as Buyer).addresses && (selectedUser as Buyer).addresses!.length > 0 
                                   ? `${(selectedUser as Buyer).addresses![0]?.street}, ${(selectedUser as Buyer).addresses![0]?.city}`
                                   : 'No address on file'}
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