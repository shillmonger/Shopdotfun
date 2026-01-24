"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Layers,
  LayoutGrid,
  List,
  Zap,
  Edit2,
  Trash2,
  AlertCircle,
  TrendingUp,
  Box,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

// ... (Interfaces remain the same)
interface Product {
  _id: string;
  name: string;
  price: string;
  crypto: string;
  stock: number;
  sales?: number;
  status: 'active' | 'inactive' | 'pending' | 'rejected' | 'sold_out' | 'low_stock';
  images: Array<{ url: string; thumbnailUrl: string }>;
  category: string;
  description?: string;
  discount?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: Product[];
  pagination: { total: number; page: number; totalPages: number; limit: number; };
}

export default function MyProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // New State for Delete Confirmation Pop-out
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [stats, setStats] = useState({
    active: 0,
    outOfStock: 0,
    drafts: 0,
    totalSales: 0
  });
  
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProducts();
    }
  }, [status]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seller/products');
      const data: ApiResponse = await response.json();
      if (data.success) {
        setProducts(data.data);
        const active = data.data.filter(p => p.status === 'active').length;
        const outOfStock = data.data.filter(p => p.status === 'sold_out').length;
        const drafts = data.data.filter(p => p.status === 'pending').length;
        const totalSales = data.data.reduce((sum, p) => sum + (p.sales || 0), 0);
        setStats({ active, outOfStock, drafts, totalSales });
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/seller/products/${deleteId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const result = await response.json();
        setProducts(products.filter(p => p._id !== deleteId));
        setDeleteId(null);
        toast.success('Product deleted successfully', {
          description: 'The product has been removed from your inventory.',
          duration: 3000,
        });
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error('Failed to delete product', {
        description: 'Please try again later.',
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'sold_out': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-muted text-foreground border-border';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* --- CUSTOM DELETE MODAL --- */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-card border border-border w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl scale-in-center">
            <button 
              onClick={() => setDeleteId(null)}
              className="absolute top-6 right-6 p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-2">
                <Trash2 className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                Delete <span className="text-destructive">Product?</span>
              </h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                This action is permanent. All data associated with this listing will be wiped from the grid.
              </p>
              
              <div className="flex flex-col w-full gap-3 pt-4">
                <button
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className="w-full bg-destructive cursor-pointer text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isDeleting ? "Wiping Data..." : "Confirm Delete"}
                </button>
                <button
                  onClick={() => setDeleteId(null)}
                  className="w-full bg-muted text-foreground cursor-pointer py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-border transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 pb-32">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  My <span className="text-primary not-italic">Inventory</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <Layers className="w-3 h-3 text-primary" /> Managing {loading ? "..." : products.length} Listings
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex bg-card border border-border rounded-xl p-1">
                  <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground"}`}><LayoutGrid className="w-4 h-4 cursor-pointer" /></button>
                  <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground"}`}><List className="w-4 h-4 cursor-pointer" /></button>
                </div>
                <Link href="/general-dashboard/seller-dashboard/add-product" className="flex-1 md:flex-none bg-foreground text-background px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary flex items-center justify-center gap-2 transition-all">
                  <Plus className="w-4 h-4" /> Add New
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Active", count: stats.active, color: "text-green-500" },
                { label: "Out of Stock", count: stats.outOfStock, color: "text-destructive" },
                { label: "Pending", count: stats.drafts, color: "text-amber-500" },
                { label: "Total Sales", count: stats.totalSales, color: "text-primary" },
              ].map((s, i) => (
                <div key={i} className="bg-card border border-border p-4 rounded-2xl">
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{s.label}</p>
                  <p className={`text-2xl font-black italic ${s.color}`}>{loading ? "..." : s.count}</p>
                </div>
              ))}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-[2rem] h-80 opacity-50" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.length === 0 ? (
                  <div className="col-span-full text-center py-20 bg-card border border-dashed border-border rounded-[2rem]">
                    <Box className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-bold uppercase italic">No products found</h3>
                  </div>
                ) : (
                  products.map((product) => (
                    <div key={product._id} className="group bg-card border border-border rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all">
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        {product.images?.[0] ? (
                          <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Box className="w-12 h-12 text-muted-foreground" /></div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md ${getStatusBadgeClass(product.status)}`}>
                            {product.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <h3 className="text-sm font-black uppercase italic tracking-tighter leading-tight line-clamp-1">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-black text-primary italic">${product.price}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">{product.category}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-2">
                          <Link href={`/general-dashboard/seller-dashboard/edit-product/${product._id}`} className="flex-1 bg-muted hover:bg-foreground hover:text-background py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                            <Edit2 className="w-3 h-3" /> Edit
                          </Link>
                          {/* DELETE TRIGGER */}
                          <button 
                            onClick={() => setDeleteId(product._id)}
                            className="p-2.5 border border-border cursor-pointer rounded-xl hover:bg-destructive hover:text-white transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}


            {/* Performance Tip */}
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 mt-12 flex items-center gap-4">
              <Zap className="w-6 h-6 text-primary shrink-0" />
              <p className="text-[10px] font-bold text-primary/80 uppercase tracking-tight max-w-2xl leading-relaxed">
                {products.length === 0 
                  ? 'Get started by adding your first product to your inventory.'
                  : 'Boost your visibility: Products with high-quality images and detailed descriptions perform 40% better.'}
              </p>
            </div>
          </div>
        </main>
        <SellerNav />
      </div>
    </div>
  );
}