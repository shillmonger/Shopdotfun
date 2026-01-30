"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, Filter, ShoppingBag, User, Store, Clock, 
  CheckCircle2, AlertCircle, ShieldAlert, Download, 
  Truck, Eye, HandCoins, Wrench, ChevronDown, Loader2
} from "lucide-react";
import { toast } from "sonner";

// Shadcn UI Imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";
import { StatusBadge } from "@/components/StatusBadge";
import {
  getShippingStatusLabel,
  getBuyerActionLabel,
  getPaymentStatusLabel,
  getAdminActionLabel,
  hasOrderIssues,
  canReleasePayment,
  OrderStatus
} from "@/lib/order-status";

// Type Definitions
interface Order {
  id: string;
  buyer: string;
  seller: string;
  amount: string;
  date: string;
  status: OrderStatus;
  buyerInfo?: any;
  sellerInfo?: any;
  productInfo?: any;
  paymentInfo?: any;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  orderNotes?: string;
}

async function fetchAdminOrders(): Promise<Order[]> {
  try {
    const response = await fetch('/api/admin/orders');
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return [];
  }
}

async function updateOrderStatus(orderId: string, updates: Partial<OrderStatus>): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/admin/orders/update-status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, updates }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      return { success: false, error: result.error || 'Failed to update status' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Network error' };
  }
}

export default function MonitorOrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    shipping: "all",
    buyerAction: "all",
    payment: "all",
    problemOnly: false
  });

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleAdminAction = async (orderId: string, actionType: string) => {
    setLoadingAction(`${orderId}-${actionType}`);
    
    let updates: Partial<OrderStatus> = {};
    
    if (actionType === 'release') {
      updates = { payment: 'paid', adminAction: 'reviewed' };
    } else if (actionType === 'resolve') {
      updates = { adminAction: 'reviewed' };
    }

    const result = await updateOrderStatus(orderId, updates);
    
    if (result.success) {
      toast.success(`Action: ${actionType} successful`);
      
      // Update the local order state
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.id === orderId) {
            const updatedOrder = { ...order };
            if (updates.payment) {
              updatedOrder.status.payment = updates.payment;
            }
            if (updates.adminAction) {
              updatedOrder.status.adminAction = updates.adminAction;
            }
            updatedOrder.updatedAt = new Date();
            return updatedOrder;
          }
          return order;
        })
      );
    } else {
      toast.error(result.error || 'Failed to update order');
    }
    
    setLoadingAction(null);
  };

  const hasWarning = (status: OrderStatus) => {
    return hasOrderIssues(status);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(filters.search.toLowerCase());
      const matchesShip = filters.shipping === "all" || order.status.shipping === filters.shipping;
      const matchesBuyer = filters.buyerAction === "all" || order.status.buyerAction === filters.buyerAction;
      const matchesPay = filters.payment === "all" || order.status.payment === filters.payment;
      const matchesProblem = !filters.problemOnly || hasOrderIssues(order.status);
      return matchesSearch && matchesShip && matchesBuyer && matchesPay && matchesProblem;
    });
  }, [orders, filters]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  Order <span className="text-primary not-italic">Logs</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <ShoppingBag className="w-3 h-3 text-primary" /> Active Oversight &bull; {filteredOrders.length} Records
                </p>
              </div>
              <button onClick={() => toast.info("Preparing CSV...")} className="bg-card border border-border px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted flex items-center gap-2">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>

            {/* Filter UI */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="SEARCH ORDER ID..." 
                  className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-xs font-bold outline-none focus:ring-1 ring-primary"
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="bg-card border border-border rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-muted outline-none">
                    <Filter className="w-4 h-4 text-primary" /> 
                    Filter Options
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 font-bold uppercase text-[10px]">
                  <DropdownMenuLabel>Global Filters</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Shipping Sub-menu */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Shipping: {filters.shipping}</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="uppercase text-[10px] font-bold">
                        <DropdownMenuItem onClick={() => setFilters({...filters, shipping: "all"})}>All</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilters({...filters, shipping: "pending"})}>Processing</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilters({...filters, shipping: "shipped"})}>Shipped</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilters({...filters, shipping: "received"})}>Delivered</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  {/* Payment Sub-menu */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Payment: {filters.payment}</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="uppercase text-[10px] font-bold">
                        <DropdownMenuItem onClick={() => setFilters({...filters, payment: "all"})}>All</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilters({...filters, payment: "pending"})}>Awaiting</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilters({...filters, payment: "paid"})}>Paid</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  {/* Problem Only Toggle */}
                  <DropdownMenuItem onClick={() => setFilters({...filters, problemOnly: !filters.problemOnly})}>
                    {filters.problemOnly ? "✓ Show All" : "⚠ Problems Only"}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500" onClick={() => setFilters({search: "", shipping: "all", buyerAction: "all", payment: "all", problemOnly: false})}>
                    Reset Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest whitespace-nowrap">Order Info</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest whitespace-nowrap">Parties</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest whitespace-nowrap">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest whitespace-nowrap">Status Matrix</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right whitespace-nowrap">Audit Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/10 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {hasWarning(order.status) && (
                              <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                            )}
                            <div className="flex flex-col">
                              <span className="font-black text-sm uppercase italic tracking-tighter group-hover:text-primary transition-colors">{order.id}</span>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1"><Clock className="w-3 h-3" /> {order.date}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1 min-w-[120px]">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase"><User className="w-3 h-3 opacity-40" /> {order.buyer}</div>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase"><Store className="w-3 h-3 opacity-40" /> {order.seller}</div>
                          </div>
                        </td>

                        <td className="px-6 py-5 font-black italic text-sm whitespace-nowrap">{order.amount}</td>

                        <td className="px-6 py-5">
                          {/* Status Matrix with proper labels */}
                          <div className="flex flex-wrap gap-2 max-w-[280px]">
                            {/* Shipping Status */}
                            <StatusBadge 
                              label={getShippingStatusLabel(order.status.shipping)} 
                              variant={order.status.shipping === 'pending' ? 'yellow' : order.status.shipping === 'shipped' ? 'blue' : 'green'} 
                              icon={order.status.shipping === 'pending' ? Clock : order.status.shipping === 'shipped' ? Truck : CheckCircle2} 
                            />

                            {/* Buyer Action - only show if not 'none' */}
                            {order.status.buyerAction !== 'none' && (
                              <StatusBadge 
                                label={getBuyerActionLabel(order.status.buyerAction)} 
                                variant={order.status.buyerAction === 'delayed' ? 'orange' : order.status.buyerAction === 'damaged' ? 'red' : 'green'} 
                                icon={order.status.buyerAction === 'delayed' || order.status.buyerAction === 'damaged' ? AlertCircle : CheckCircle2} 
                              />
                            )}
                            
                            {/* Payment Status */}
                            <StatusBadge 
                              label={getPaymentStatusLabel(order.status.payment)} 
                              variant={order.status.payment === 'paid' ? 'green' : 'yellow'} 
                              icon={order.status.payment === 'paid' ? CheckCircle2 : Clock} 
                            />

                            {/* Admin Action */}
                            <StatusBadge 
                              label={getAdminActionLabel(order.status.adminAction)} 
                              variant={order.status.adminAction === 'none' ? 'gray' : 'blue'} 
                              icon={order.status.adminAction === 'none' ? Clock : CheckCircle2} 
                            />
                          </div>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end items-center gap-2 whitespace-nowrap">
                            {canReleasePayment(order.status) && (
                              <button 
                                onClick={() => handleAdminAction(order.id, "release")}
                                disabled={loadingAction === `${order.id}-release`}
                                className="flex items-center gap-2 px-3 py-2 bg-green-500 cursor-pointer text-white rounded-lg text-[10px] font-black uppercase hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {loadingAction === `${order.id}-release` ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <HandCoins className="w-3.5 h-3.5" />
                                )}
                                Release Payment
                              </button>
                            )}

                            {hasOrderIssues(order.status) && (
                              <button 
                                onClick={() => handleAdminAction(order.id, "resolve")}
                                disabled={loadingAction === `${order.id}-resolve`}
                                className="flex items-center gap-2 px-3 cursor-pointer py-2 bg-orange-500 text-white rounded-lg text-[10px] font-black uppercase hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {loadingAction === `${order.id}-resolve` ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Wrench className="w-3.5 h-3.5" />
                                )}
                                Resolve Issue
                              </button>
                            )}

                            <button className="p-2 border border-border cursor-pointer rounded-lg hover:bg-muted text-muted-foreground">
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
          </div>
        </main>
        <AdminNav />
      </div>
    </div>
  );
}