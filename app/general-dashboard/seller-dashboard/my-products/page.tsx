"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Layers,
  LayoutGrid,
  List,
  Zap,
  Edit2,
  Trash2,
  Box,
  X,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
  _id: string;
  name: string;
  price: string;
  crypto: string;
  stock: number;
  sales?: number;
  status: "active" | "inactive" | "pending" | "rejected" | "sold_out" | "low_stock";
  images: Array<{ url: string; thumbnailUrl: string }>;
  category: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  data: Product[];
  pagination: { total: number; page: number; totalPages: number; limit: number };
}

export default function MyProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [stats, setStats] = useState({
    active: 0,
    outOfStock: 0,
    drafts: 0,
    totalSales: 0,
  });

  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") fetchProducts();
  }, [status]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/seller/products");
      const data: ApiResponse = await response.json();
      if (data.success) {
        setProducts(data.data);
        const active = data.data.filter((p) => p.status === "active").length;
        const outOfStock = data.data.filter((p) => p.status === "sold_out").length;
        const drafts = data.data.filter((p) => p.status === "pending").length;
        const totalSales = data.data.reduce((sum, p) => sum + (p.sales || 0), 0);
        setStats({ active, outOfStock, drafts, totalSales });
      }
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/seller/products/${deleteId}`, { method: "DELETE" });
      if (response.ok) {
        setProducts(products.filter((p) => p._id !== deleteId));
        setDeleteId(null);
        toast.success("Product deleted successfully");
      }
    } catch (err) {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = searchTerm === "" || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, statusFilter]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "sold_out": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* RESTORED DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-card border border-border w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl scale-in-center">
            <button onClick={() => setDeleteId(null)} className="absolute top-6 right-6 p-2 hover:bg-muted cursor-pointer rounded-full transition-colors"><X className="w-5 h-5" /></button>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-2"><Trash2 className="w-8 h-8 text-destructive" /></div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Delete <span className="text-destructive">Product?</span></h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">This action is permanent. All data will be wiped.</p>
              <div className="flex w-full gap-3 pt-4">
                <button disabled={isDeleting} onClick={confirmDelete} className="w-full cursor-pointer bg-destructive text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50">
                  {isDeleting ? "Wiping Data..." : "Confirm Delete"}
                </button>
                <button onClick={() => setDeleteId(null)} className="w-full cursor-pointer bg-muted text-foreground py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
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
            {/* Header Controls: Flex Row on Mobile */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  My <span className="text-primary not-italic">Inventory</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <Layers className="w-3 h-3 text-primary" /> Managing {loading ? "..." : filteredProducts.length} Listings
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

            {/* RESTORED STATS */}
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

            {/* Search & Filter */}
            <div className="flex items-center gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-card border-border rounded-lg py-5 pl-12 text-[8px] font-black tracking-widest"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="bg-card border cursor-pointer border-border p-2 rounded-lg hover:bg-muted transition-all outline-none">
                    <Filter className={`w-5 h-5 ${statusFilter !== 'all' ? 'text-primary' : 'text-muted-foreground'}`} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border min-w-[150px]">
                  <DropdownMenuLabel className="text-[10px] font-black uppercase">Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter("all")} className="text-[10px] font-bold uppercase cursor-pointer">All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")} className="text-[10px] font-bold uppercase cursor-pointer text-green-500">Approved</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")} className="text-[10px] font-bold uppercase cursor-pointer text-amber-500">Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("rejected")} className="text-[10px] font-bold uppercase cursor-pointer text-red-500">Rejected</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Listings */}
            {loading ? (
              <div className="grid grid-cols-1 gap-4 animate-pulse">
                {[...Array(4)].map((_, i) => <div key={i} className="bg-card border border-border rounded-2xl h-16 opacity-50" />)}
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-2"}>
                {filteredProducts.map((product) => (
                  viewMode === "grid" ? (
                    <div key={product._id} className="group bg-card border border-border rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all">
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <img src={product.images?.[0]?.url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                        <div className="absolute top-4 left-4">
                          <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md ${getStatusBadgeClass(product.status)}`}>
                            {product.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-sm font-black uppercase italic tracking-tighter line-clamp-1">{product.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-lg font-black text-primary italic">${product.price}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">{product.category}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Link href={`/general-dashboard/seller-dashboard/my-products/${product._id}`} className="flex-1 bg-muted py-2.5  rounded-xl text-[12px] font-black uppercase text-center hover:bg-foreground hover:text-background transition-all">
                           Edit Product
                          </Link>
                          <button onClick={() => setDeleteId(product._id)} className="p-2.5 cursor-pointer border border-border rounded-xl hover:bg-destructive hover:text-white transition-all">
                            <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* COMPACT LIST VIEW */
                    <div key={product._id} className="flex items-center gap-4 bg-card border border-border p-2 pr-4 rounded-xl hover:border-primary/30 transition-all">
                      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                        <img src={product.images?.[0]?.url} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[10px] font-black uppercase italic truncate leading-tight">{product.name}</h4>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{product.category}</p>
                      </div>
                      <div className="hidden sm:block">
                         <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded border ${getStatusBadgeClass(product.status)}`}>{product.status}</span>
                      </div>
                      <div className="text-right min-w-[60px]">
                        <p className="text-xs font-black text-primary">${product.price}</p>
                      </div>
                      <div className="flex gap-1">
                         <Link href={`/general-dashboard/seller-dashboard/my-products/${product._id}`} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all">
                         <Edit2 className="w-3.5 h-3.5" />
                         </Link>
                         <button onClick={() => setDeleteId(product._id)} className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground cursor-pointer hover:text-destructive transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                          </button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </main>
        <SellerNav />
      </div>
    </div>
  );
}