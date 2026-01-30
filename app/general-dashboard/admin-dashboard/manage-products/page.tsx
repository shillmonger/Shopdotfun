"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Layers,
  LayoutGrid,
  List,
  Trash2,
  X,
  Search,
  Filter,
  ShieldAlert,
  UserX,
  Mail,
  Truck,
  Timer,
  Hash,
  Wallet,
  Percent,
  Calendar,
  Tag,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";
import { adminApi } from "@/lib/admin";

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
  _id: string | { $oid: string };
  name: string;
  description: string;
  price: number;
  discount: number;
  crypto: string;
  category: string;
  stock: number;
  shippingFee: number;
  processingTime: string;
  images: Array<{ url: string; thumbnailUrl: string }>;
  sellerEmail: string;
  sellerName: string;
  status: "approved" | "inactive" | "pending" | "rejected" | "sold_out";
  createdAt: { $date: string } | string;
  productCode: string;
  commissionFee: number;
  sellerEarnings: number;
  rejectionReason?: string;
}

export default function AdminInventoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingApproval: 0,
    liveListings: 0,
    flaggedItems: 0,
  });

  const { status } = useSession();

  useEffect(() => {
    const fetchProducts = async () => {
      if (status !== 'authenticated') return;
      
      try {
        setLoading(true);
        const data: Product[] = await adminApi.getAllProducts();
        setProducts(data);
        
        // Extract unique categories from products
        const uniqueCategories = Array.from(new Set(data.map((p: Product) => p.category))).filter(Boolean) as string[];
        setCategories(uniqueCategories);
        
        setStats({
          totalProducts: data.length,
          pendingApproval: data.filter(p => p.status === "pending").length,
          liveListings: data.filter(p => p.status === "approved").length,
          flaggedItems: data.filter(p => p.status === "rejected").length,
        });
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [status]);

  const handleSuspendSeller = (email: string) => {
    toast.error(`Suspending Seller: ${email}`, {
      description: "Administrative freeze applied to this account.",
    });
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      await adminApi.deleteProduct(deleteId);
      setProducts(products.filter((p) => (typeof p._id === 'string' ? p._id : p._id.$oid) !== deleteId));
      setDeleteId(null);
      toast.success("Product permanently removed.");
      
      // Update stats
      const updatedProducts = products.filter((p) => (typeof p._id === 'string' ? p._id : p._id.$oid) !== deleteId);
      setStats({
        totalProducts: updatedProducts.length,
        pendingApproval: updatedProducts.filter(p => p.status === "pending").length,
        liveListings: updatedProducts.filter(p => p.status === "approved").length,
        flaggedItems: updatedProducts.filter(p => p.status === "rejected").length,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchTerm === "" ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.productCode && p.productCode.includes(searchTerm)) ||
        p.sellerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, searchTerm, statusFilter, categoryFilter]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-card border border-border w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl scale-in-center">
            <button onClick={() => setDeleteId(null)} className="absolute top-6 right-6 p-2 hover:bg-muted rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-2">
                <Trash2 className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Purge <span className="text-destructive">Product?</span></h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">This action is irreversible and wipes all listing data.</p>
              <div className="flex w-full gap-3 pt-4">
                <button onClick={confirmDelete} className="w-full bg-destructive text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90">Confirm Purge</button>
                <button onClick={() => setDeleteId(null)} className="w-full bg-muted text-foreground py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 pb-32">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">Global <span className="text-primary not-italic">Inventory</span></h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3 text-primary" /> System Monitoring: {loading ? "..." : filteredProducts.length} Items Listed
                </p>
              </div>
<div className="flex items-center gap-3 self-end md:self-auto">
                <div className="flex bg-card border border-border rounded-xl p-1">
                  <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground"}`}><LayoutGrid className="w-4 h-4" /></button>
                  <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground"}`}><List className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {/* Admin Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Total Products", count: stats.totalProducts, color: "text-primary" },
                { label: "Pending Review", count: stats.pendingApproval, color: "text-amber-500" },
                { label: "Active Items", count: stats.liveListings, color: "text-green-500" },
                { label: "Flagged", count: stats.flaggedItems, color: "text-destructive" },
              ].map((s, i) => (
                <div key={i} className="bg-card border border-border p-4 rounded-2xl">
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{s.label}</p>
                  <p className={`text-2xl font-black italic ${s.color}`}>{loading ? "..." : s.count}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Code, Name, or Seller..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-card border-border rounded-lg py-5 pl-12 text-[8px] font-black tracking-widest uppercase"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="bg-card border cursor-pointer border-border p-3 rounded-lg hover:bg-muted transition-all"><Filter className="w-5 h-5 text-muted-foreground" /></button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border w-56 p-2">
                  <DropdownMenuLabel className="text-[10px] font-black uppercase px-2">Global Filters</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-[8px] text-muted-foreground uppercase px-2">Status</DropdownMenuLabel>
                  {["all", "approved", "pending", "rejected"].map((s) => (
                    <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)} className="text-[10px] font-bold uppercase cursor-pointer capitalize">{s}</DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-[8px] text-muted-foreground uppercase px-2">Category</DropdownMenuLabel>
                  {["all", ...categories].map((c) => (
                    <DropdownMenuItem key={c} onClick={() => setCategoryFilter(c)} className="text-[10px] font-bold uppercase cursor-pointer">{c}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Grid View */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "flex flex-col gap-4"}>
              {filteredProducts.map((product) => {
                const prodId = typeof product._id === 'string' ? product._id : product._id.$oid;
                return viewMode === "grid" ? (
                  <div key={prodId} className="bg-card border border-border rounded-[2.5rem] p-6 flex flex-col gap-6 hover:border-primary/40 transition-all group">
                    {/* Multi-Image Display (Max 4) */}
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 1, 2, 3].map((idx) => (
                        <div key={idx} className="aspect-square bg-muted rounded-2xl overflow-hidden border border-border">
                          {product.images[idx] ? (
                            <img src={product.images[idx].url} className="w-full h-full object-cover" alt="product" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-20"><Tag className="w-4 h-4" /></div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full border mb-2 inline-block ${getStatusBadgeClass(product.status)}`}>{product.status}</span>
                          <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none mb-1">{product.name}</h3>
                          <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1"><Hash className="w-3 h-3" /> {product.productCode || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-primary italic">${product.price}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">-{product.discount}% Discount</p>
                        </div>
                      </div>

                      {/* Detailed Metadata Grid */}
                      <div className="grid grid-cols-2 gap-y-4 gap-x-8 py-4 border-y border-border/50">
                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1"><UserX className="w-3 h-3" /> Seller Info</p>
                          <p className="text-[10px] font-black uppercase">{product.sellerName}</p>
                          <p className="text-[9px] font-medium text-muted-foreground lowercase truncate">{product.sellerEmail}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1"><Wallet className="w-3 h-3" /> Financials</p>
                          <p className="text-[10px] font-black text-green-500 uppercase">Earnings: ${product.sellerEarnings}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">Fee: ${product.commissionFee} ({product.crypto})</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1"><Truck className="w-3 h-3" /> Logistics</p>
                          <p className="text-[10px] font-black uppercase">Ship: ${product.shippingFee}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1"><Timer className="w-2.5 h-2.5" /> {product.processingTime}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1"><Calendar className="w-3 h-3" /> Created On</p>
                          <p className="text-[10px] font-black uppercase">{new Date(typeof product.createdAt === 'string' ? product.createdAt : product.createdAt.$date).toLocaleDateString()}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">Stock: {product.stock} units</p>
                        </div>
                      </div>

                      <div className="bg-muted/30 p-4 rounded-2xl">
                        <p className="text-[8px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Description</p>
                        <p className="text-[10px] font-medium leading-relaxed italic text-foreground/80 line-clamp-2">"{product.description}"</p>
                      </div>

                      {product.rejectionReason && (
                        <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                          <p className="text-[8px] font-black uppercase text-red-500 mb-1">Rejection Note</p>
                          <p className="text-[9px] text-red-400 italic">{product.rejectionReason}</p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <button onClick={() => handleSuspendSeller(product.sellerEmail)} className="flex-1 bg-red-500/10 cursor-pointer text-red-500 border border-red-500/20 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                          <UserX className="w-4 h-4" /> Suspend Account
                        </button>
                        <button onClick={() => setDeleteId(prodId)} className="p-3 border border-border cursor-pointer rounded-2xl hover:bg-destructive hover:text-white transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List view remains concise but functional
                  <div key={prodId} className="bg-card border border-border p-4 rounded-2xl flex items-center gap-4 hover:border-primary/30 transition-all">
                     <img src={product.images[0]?.url} className="w-16 h-16 rounded-xl object-cover shrink-0 bg-muted" alt="thumb" />
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black uppercase italic tracking-tighter truncate">{product.name}</h4>
                          <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded border border-border">{product.productCode || 'N/A'}</span>
                        </div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{product.sellerName} • {product.category}</p>
                     </div>
                     <div className="text-right hidden md:block px-6">
                        <p className="text-sm font-black text-primary">${product.price}</p>
                        <p className="text-[8px] font-black uppercase text-muted-foreground">Earn: ${product.sellerEarnings}</p>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => handleSuspendSeller(product.sellerEmail)} className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><UserX className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteId(prodId)} className="p-2.5 rounded-xl border border-border hover:bg-destructive hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </div>
                );
              })}
            </div>

            {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-20 px-4 border-2 border-dashed border-border rounded-3xl bg-muted/30 flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Background Decorative Element */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -z-10" />

                  <div className="relative mb-6 group">
                    <img
                      src="https://i.postimg.cc/LXSKYHG4/empty-box-removebg-preview.png"
                      alt="Empty Box"
                      className="w-40 h-40 object-contain cursor-pointer grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out"
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary/20 blur-sm rounded-full" />
                  </div>

                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">
                    No Uploads From Your Sellers Yet
                  </h3>

                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest max-w-[250px] leading-relaxed">
                    No products found matching your criteria. Try adjusting your
                    filters.
                  </p>

                  <button
                    onClick={() => window.location.reload()}
                    className="mt-8 px-6 py-2 bg-foreground cursor-pointer text-background text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-colors rounded-full">
                    Reset Search
                  </button>
                </div>
              )}

          </div>
        </main>
        <AdminNav />
      </div>
    </div>
  );
}