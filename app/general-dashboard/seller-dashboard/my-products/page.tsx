"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  MoreHorizontal,
  Layers,
  LayoutGrid,
  List,
  Search,
  Zap,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  TrendingUp,
  Box,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

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
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export default function MyProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    active: 0,
    outOfStock: 0,
    drafts: 0,
    totalSales: 0
  });
  
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated') {
      fetchProducts();
    }
  }, [status, router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seller/products');
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setProducts(data.data);
        
        // Calculate stats
        const active = data.data.filter(p => p.status === 'active').length;
        const outOfStock = data.data.filter(p => p.status === 'sold_out').length;
        const drafts = data.data.filter(p => p.status === 'pending').length;
        const totalSales = data.data.reduce((sum, p) => sum + (p.sales || 0), 0);
        
        setStats({
          active,
          outOfStock,
          drafts,
          totalSales
        });
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('An error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/seller/products/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Refresh the list after deletion
        fetchProducts();
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting");
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'sold_out':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'low_stock':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default:
        return 'bg-muted text-foreground border-border';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Products</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SellerSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 pb-32">
          <div className="max-w-7xl mx-auto">
            {/* Header & Primary Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  My <span className="text-primary not-italic">Inventory</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <Layers className="w-3 h-3 text-primary" /> Managing{" "}
                  {products.length} Total Listings
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex bg-card border border-border rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground"}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <Link
                  href="/general-dashboard/seller-dashboard/add-product"
                  className="flex-1 md:flex-none bg-foreground text-background px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add New Product
                </Link>
              </div>
            </div>

            {/* Stats Overview Quick-Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Active", count: stats.active, color: "text-green-500" },
                { label: "Out of Stock", count: stats.outOfStock, color: "text-destructive" },
                { label: "Pending", count: stats.drafts, color: "text-amber-500" },
                { label: "Total Sales", count: stats.totalSales, color: "text-primary" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-card border border-border p-4 rounded-2xl"
                >
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                    {s.label}
                  </p>
                  <p className={`text-2xl font-black italic ${s.color}`}>
                    {s.count}
                  </p>
                </div>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Box className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-bold">No products found</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    You haven&apos;t added any products yet.
                  </p>
                  <Link
                    href="/general-dashboard/seller-dashboard/add-product"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Your First Product
                  </Link>
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-card border border-border rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Box className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span
                          className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md ${getStatusBadgeClass(product.status)}`}
                        >
                          {product.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-sm font-black uppercase italic tracking-tighter leading-tight line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-lg font-black text-primary italic">
                            ${product.price}{' '}
                            <span className="text-[10px] not-italic">
                              {product.crypto || 'USD'}
                            </span>
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">
                            {product.category || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                            <Box className="w-2 h-2" /> Stock
                          </span>
                          <span
                            className={`text-xs font-black ${product.stock < 5 ? "text-destructive" : ""}`}
                          >
                            {product.stock} Units
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                            <TrendingUp className="w-2 h-2" /> Sold
                          </span>
                          <span className="text-xs font-black">
                            {product.sales || 0} Total
                          </span>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        <Link
                          href={`/general-dashboard/seller-dashboard/edit-product/${product._id}`}
                          className="flex-1 bg-muted hover:bg-foreground hover:text-background py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </Link>
                        <button 
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-2.5 border border-border rounded-xl hover:bg-destructive hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Performance Tip */}
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 mt-12 flex items-center gap-4">
              <Zap className="w-6 h-6 text-primary shrink-0" />
              <p className="text-[10px] font-bold text-primary/80 uppercase tracking-tight max-w-2xl leading-relaxed">
                {products.length === 0 
                  ? 'Get started by adding your first product to your inventory. Make sure to include high-quality images and detailed descriptions for better visibility.'
                  : products.length < 3
                    ? 'Boost your shop\'s visibility by adding more products. Shops with 3 or more products get 30% more views.'
                    : 'Boost your visibility: Products with more than 5 high-quality images and descriptions exceeding 200 words are 40% more likely to be featured on the platform\'s trending list.'
                }
              </p>
            </div>
          </div>
        </main>

        <SellerNav />
      </div>
    </div>
  );
}