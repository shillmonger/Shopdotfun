"use client";

import React, { useState } from "react";
import { 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  AlertCircle, 
  ExternalLink,
  Archive,
  CheckCircle2,
  XCircle,
  FileText,
  Image as ImageIcon // Added for fallback
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

// Updated Mock Data with Images and more items
const INITIAL_PRODUCTS = [
  { 
    id: "P-8821", 
    name: "Hyper-X Mechanical Keyboard", 
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=100&h=100&fit=crop",
    stock: 12, 
    price: "120.00", 
    currency: "USDT", 
    status: "Active", 
    activeOrders: 0 
  },
  { 
    id: "P-8825", 
    name: "Wireless Pro Mouse", 
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100&h=100&fit=crop",
    stock: 0, 
    price: "85.00", 
    currency: "USDT", 
    status: "Out of Stock", 
    activeOrders: 2 
  },
  { 
    id: "P-8910", 
    name: "UltraWide 34' Monitor", 
    image: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=100&h=100&fit=crop",
    stock: 5, 
    price: "450.00", 
    currency: "BTC", 
    status: "Draft", 
    activeOrders: 0 
  },
  { 
    id: "P-9001", 
    name: "Noise Cancelling Headphones", 
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
    stock: 24, 
    price: "199.99", 
    currency: "USDT", 
    status: "Active", 
    activeOrders: 1 
  },
  { 
    id: "P-9005", 
    name: "USB-C Multiport Dock", 
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=100&h=100&fit=crop",
    stock: 45, 
    price: "59.00", 
    currency: "USDT", 
    status: "Active", 
    activeOrders: 0 
  },
  { 
    id: "P-9012", 
    name: "Leather Desk Pad (XL)", 
    image: "https://images.unsplash.com/photo-1616533581136-2313361e2716?w=100&h=100&fit=crop",
    stock: 3, 
    price: "45.00", 
    currency: "USDT", 
    status: "Active", 
    activeOrders: 0 
  }
];

export default function EditDeleteProductPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  const handleDelete = (id: string, activeOrders: number) => {
    if (activeOrders > 0) {
      return toast.error("Cannot delete product", {
        description: `There are ${activeOrders} active orders pending for this item.`
      });
    }

    if (confirm("Are you sure? This will move the product to the archive.")) {
      setProducts(products.filter(p => p.id !== id));
      toast.success("Product soft-deleted successfully");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 pb-32">
          <div className="max-w-6xl mx-auto">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  Manage <span className="text-primary not-italic">Catalog</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <Archive className="w-3 h-3 text-primary" /> Edit details or archive existing listings
                </p>
              </div>

              <div className="flex w-full md:w-auto gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search SKU or Name..." 
                    className="w-full md:w-64 bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-xs font-bold outline-none focus:ring-2 ring-primary/20"
                  />
                </div>
                <button className="bg-card border border-border p-3 rounded-xl hover:bg-muted transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Product Details</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Price</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Stock</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-muted/20 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            {/* Product Image Thumbnail */}
                            <div className="w-12 h-12 rounded-xl bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-muted-foreground opacity-20" />
                              )}
                            </div>
                            <div>
                              <p className="font-black text-sm uppercase italic tracking-tighter group-hover:text-primary transition-colors leading-none">{product.name}</p>
                              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5">SKU: {product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                            product.status === "Active" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                            product.status === "Out of Stock" ? "bg-destructive/10 text-destructive border-destructive/20" :
                            "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}>
                            {product.status === "Active" ? <CheckCircle2 className="w-3 h-3" /> : 
                             product.status === "Out of Stock" ? <XCircle className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-black italic tracking-tight">{product.price} <span className="text-[10px] not-italic text-primary">{product.currency}</span></p>
                        </td>
                        <td className="px-6 py-5">
                          <p className={`text-sm font-black ${product.stock < 5 ? 'text-destructive' : ''}`}>{product.stock}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <Link 
                              href={`/seller/products/edit/${product.id}`}
                              className="p-2 border border-border rounded-lg hover:bg-foreground hover:text-background transition-all"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => handleDelete(product.id, product.activeOrders)}
                              className="p-2 border border-border rounded-lg hover:bg-destructive hover:text-white transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 border border-border rounded-lg hover:bg-muted">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Empty State / Legend */}
            <div className="mt-8 bg-muted/30 border border-dashed border-border rounded-2xl p-6 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-primary shrink-0" />
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-widest">Catalog Guidelines</h4>
                <p className="text-[10px] text-muted-foreground font-medium uppercase leading-relaxed mt-1">
                  Deleting a product is permanent. We recommend setting a product to "Draft" status instead of deleting to preserve sales history. 
                  Products with active pending orders cannot be removed until fulfillment is complete.
                </p>
              </div>
            </div>

          </div>
        </main>

        <SellerNav />
      </div>
    </div>
  );
}