"use client";

import React, { useState } from "react";
import { 
  Search, 
  Package, 
  AlertTriangle, 
  RefreshCcw, 
  Plus, 
  Minus, 
  Box,
  CheckCircle2,
  TrendingDown,
  ChevronRight,
  Filter,
  BarChart3,
  Archive,
  AlertCircle,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

const INITIAL_INVENTORY = [
  { id: "P-101", name: "Hyper-X Mechanical Keyboard", stock: 2, threshold: 5, price: 120 },
  { id: "P-102", name: "Wireless Pro Mouse", stock: 15, threshold: 10, price: 85 },
  { id: "P-103", name: "UltraWide 34' Monitor", stock: 0, threshold: 2, price: 450 },
  { id: "P-104", name: "Leather Gaming Chair", stock: 8, threshold: 3, price: 299 },
];

export default function InventoryManagementPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);

  const updateStock = (id: string, amount: number) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, stock: Math.max(0, item.stock + amount) } : item
    ));
    toast.success("Stock Level Updated");
  };

  // Stats Calculation
  const totalProducts = inventory.length;
  const lowStockCount = inventory.filter(i => i.stock <= i.threshold && i.stock > 0).length;
  const outOfStockCount = inventory.filter(i => i.stock === 0).length;
  const healthyStockCount = inventory.filter(i => i.stock > i.threshold).length;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-32 text-foreground">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Inventory</h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                  <Box className="w-3 h-3 text-primary" /> Track and manage your stock levels
                </p>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" placeholder="Search product..." className="bg-card border border-border rounded-xl pl-10 pr-4 py-2 text-xs font-bold outline-none w-full md:w-64" />
                </div>
                <button className="p-2 border border-border rounded-xl hover:bg-muted transition-colors"><Filter className="w-5 h-5 text-foreground" /></button>
              </div>
            </div>

            {/* Quick Stats Grid - 2x2 on Mobile, 4 columns on Desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
              <div className="bg-card border border-border p-4 md:p-5 rounded-2xl shadow-sm relative overflow-hidden">
                 <Package className="absolute -right-2 -bottom-2 w-12 md:w-16 h-12 md:h-16 text-primary opacity-5" />
                 <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Items</p>
                 <p className="text-2xl md:text-3xl font-black italic">{totalProducts}</p>
              </div>
              <div className="bg-card border border-border p-4 md:p-5 rounded-2xl shadow-sm relative overflow-hidden">
                 <ShieldCheck className="absolute -right-2 -bottom-2 w-12 md:w-16 h-12 md:h-16 text-green-500 opacity-10" />
                 <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Healthy</p>
                 <p className="text-2xl md:text-3xl font-black italic text-green-500">{healthyStockCount}</p>
              </div>
              <div className="bg-card border border-border p-4 md:p-5 rounded-2xl shadow-sm relative overflow-hidden">
                 <TrendingDown className="absolute -right-2 -bottom-2 w-12 md:w-16 h-12 md:h-16 text-amber-500 opacity-10" />
                 <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Low Stock</p>
                 <p className="text-2xl md:text-3xl font-black italic text-amber-500">{lowStockCount}</p>
              </div>
              <div className="bg-card border border-border p-4 md:p-5 rounded-2xl shadow-sm relative overflow-hidden">
                 <AlertCircle className="absolute -right-2 -bottom-2 w-12 md:w-16 h-12 md:h-16 text-destructive opacity-10" />
                 <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Out of Stock</p>
                 <p className="text-2xl md:text-3xl font-black italic text-destructive">{outOfStockCount}</p>
              </div>
            </div>

            {/* Inventory Table Container - Horizontal Scroll Fixed */}
            <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product Details</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Stock</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Adjustment</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {inventory.map((item) => {
                      const isLow = item.stock <= item.threshold && item.stock > 0;
                      const isOut = item.stock === 0;

                      return (
                        <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-5">
                            <p className="font-black text-sm uppercase italic tracking-tighter">{item.name}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase">{item.id} • ${item.price}</p>
                          </td>
                          <td className="px-6 py-5">
                            {isOut ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
                                <AlertTriangle className="w-3 h-3" /> Out of Stock
                              </span>
                            ) : isLow ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md">
                                <TrendingDown className="w-3 h-3" /> Low Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-md">
                                <CheckCircle2 className="w-3 h-3" /> Healthy
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-5">
                            <p className={`text-xl font-black italic ${isOut ? "text-destructive" : isLow ? "text-amber-500" : ""}`}>
                              {item.stock}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <button onClick={() => updateStock(item.id, -1)} className="p-1.5 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"><Minus className="w-3 h-3" /></button>
                              <button onClick={() => updateStock(item.id, 1)} className="p-1.5 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"><Plus className="w-3 h-3" /></button>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Edit Product</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
        <SellerNav />
      </div>
    </div>
  );
}