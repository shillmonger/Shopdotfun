"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  Eye, 
  Flag, 
  Search, 
  Filter, 
  AlertTriangle,
  ExternalLink,
  User,
  Tag,
  Ban,
  CheckCircle2,
  XCircle,
  MessageSquareWarning
} from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// Mock Data
const INITIAL_PRODUCTS = [
  {
    id: "P-4401",
    name: "Designer Handbag (Replica)",
    seller: "FastSales_99",
    category: "Fashion",
    price: "150.00 USDT",
    status: "Flagged",
    reports: 3,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200",
    description: "High quality luxury style bag for a fraction of the price."
  },
  {
    id: "P-4405",
    name: "Next-Gen Gaming Console",
    seller: "TechHub_Official",
    category: "Gaming",
    price: "499.00 USDT",
    status: "Active",
    reports: 0,
    image: "https://images.unsplash.com/photo-1605898965927-466d11e4f40d?auto=format&fit=crop&q=80&w=200",
    description: "Brand new gaming console with 4K support."
  }
];

export default function ProductModerationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<typeof INITIAL_PRODUCTS[0] | null>(null);
  const [modReason, setModReason] = useState("");

  const handleModeration = (id: string, action: string) => {
    if ((action === "Flagged" || action === "Removed") && !modReason) {
      return toast.error("Action Blocked", {
        description: "You must provide a reason for flagging or removing a listing."
      });
    }

    setProducts(products.map(p => p.id === id ? { ...p, status: action } : p));
    toast.success(`Product ${action}`, {
      description: `The seller has been notified via email regarding the &quot;${action}&quot; status.`
    });
    setModReason("");
    setSelectedProduct(null);
  };

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
                  Product <span className="text-primary not-italic">Moderation</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3 text-primary" /> Enforcing marketplace &quot;Safety First&quot; guidelines
                </p>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search by SKU or Name..." 
                    className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-xs font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Product List */}
              <div className="lg:col-span-7 bg-card border border-border rounded-[2rem] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Item</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Seller</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground text-right">View</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {products.map((product) => (
                        <tr key={product.id} className={`hover:bg-muted/20 transition-colors ${selectedProduct?.id === product.id ? 'bg-primary/5' : ''}`}>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <img src={product.image} className="w-10 h-10 rounded-lg object-cover border border-border" alt="" />
                              <div>
                                <p className="font-black text-[11px] uppercase italic leading-none">{product.name}</p>
                                <p className="text-[9px] font-bold text-muted-foreground mt-1">{product.price}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-[10px] font-bold uppercase flex items-center gap-1">
                              <User className="w-3 h-3 opacity-40" /> {product.seller}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${
                              product.status === "Active" ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                              product.status === "Flagged" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                              "bg-destructive/10 text-destructive border-destructive/20"
                            }`}>
                              {product.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button 
                              onClick={() => setSelectedProduct(product)}
                              className="p-2 border border-border rounded-lg hover:bg-primary hover:text-white transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Moderation Panel */}
              <div className="lg:col-span-5">
                {selectedProduct ? (
                  <div className="bg-card border-2 border-primary rounded-[2rem] p-8 space-y-6 sticky top-24">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">Moderation Desk</h3>
                      <button onClick={() => setSelectedProduct(null)}><XCircle className="w-5 h-5 opacity-40 hover:opacity-100"/></button>
                    </div>

                    <div className="space-y-4">
                      <img src={selectedProduct.image} className="w-full h-48 object-cover rounded-2xl border border-border" alt="" />
                      <div>
                        <p className="text-[10px] font-black uppercase text-primary tracking-widest">{selectedProduct.category}</p>
                        <h4 className="text-lg font-black uppercase italic">{selectedProduct.name}</h4>
                        <p className="text-[11px] font-medium text-muted-foreground mt-2 leading-relaxed">
                          {selectedProduct.description}
                        </p>
                      </div>
                    </div>

                    {selectedProduct.reports > 0 && (
                      <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex items-center gap-3">
                        <MessageSquareWarning className="w-5 h-5 text-destructive" />
                        <span className="text-[10px] font-black uppercase text-destructive">
                          Flagged by {selectedProduct.reports} users for &quot;Policy Violation&quot;
                        </span>
                      </div>
                    )}

                    <div className="pt-4 space-y-3">
                      <label className="text-[10px] font-black uppercase opacity-60">Moderation Note (Mandatory for Flag/Remove)</label>
                      <textarea 
                        className="w-full bg-background border border-border rounded-xl p-4 text-[11px] font-bold uppercase outline-none focus:ring-2 ring-primary/20 resize-none"
                        rows={3}
                        placeholder="e.g., Counterfeit item detected or misleading description..."
                        value={modReason}
                        onChange={(e) => setModReason(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <button 
                        onClick={() => handleModeration(selectedProduct.id, "Active")}
                        className="bg-green-500 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>
                      <button 
                        onClick={() => handleModeration(selectedProduct.id, "Flagged")}
                        className="bg-amber-500 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <Flag className="w-4 h-4" /> Flag
                      </button>
                      <button 
                        onClick={() => handleModeration(selectedProduct.id, "Disabled")}
                        className="bg-foreground text-background py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <Ban className="w-4 h-4" /> Disable
                      </button>
                      <button 
                        onClick={() => handleModeration(selectedProduct.id, "Removed")}
                        className="bg-destructive text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-[400px] border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-center p-10 opacity-30">
                    <ShieldCheck className="w-12 h-12 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Select a product to initiate moderation &amp; review reports</p>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Guidelines */}
            <div className="mt-8 bg-card border border-border p-6 rounded-[2rem] flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-primary shrink-0" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight leading-relaxed">
                Moderation Rules: Deleting a product uses a &quot;Soft-Delete&quot; method. This means the product is hidden from the public storefront but remains in the database for legal and auditing history. Sellers receive an automated notification for every moderation action taken.
              </p>
            </div>

          </div>
        </main>

        <AdminNav />
      </div>
    </div>
  );
}