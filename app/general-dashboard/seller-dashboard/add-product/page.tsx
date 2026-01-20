"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Upload, 
  Trash2, 
  Info, 
  Image as ImageIcon, 
  Eye, 
  Zap, 
  ShieldCheck,
  Coins,
  Box,
  Clock,
  Truck
} from "lucide-react";
import { toast } from "sonner";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

const CRYPTO_OPTIONS = [
  { label: "USDT (Tether)", value: "USDT" },
  { label: "BTC (Bitcoin)", value: "BTC" },
  { label: "SOL (Solana)", value: "SOL" },
  { label: "ETH (Ethereum)", value: "ETH" },
];

const CATEGORIES = ["Electronics", "Fashion", "Gaming", "Home", "Health", "Digital"];

export default function AddProductPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sku, setSku] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    crypto: "USDT",
    category: "",
    stock: "",
    shippingFee: "0",
    processingTime: "1-2 Days",
    images: [] as File[],
  });

  // Auto-generate SKU logic
  useEffect(() => {
    if (formData.name.length > 2) {
      const prefix = formData.name.substring(0, 3).toUpperCase();
      const random = Math.floor(1000 + Math.random() * 9000);
      setSku(`${prefix}-${random}`);
    }
  }, [formData.name]);

  const handlePublish = (status: "Active" | "Draft") => {
    if (!formData.name || !formData.price || !formData.category) {
      return toast.error("Missing required fields");
    }
    if (Number(formData.price) <= 0) {
      return toast.error("Price must be a positive value");
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success(`Product saved as ${status}!`);
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32">
          <div className="max-w-5xl mx-auto">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  List <span className="text-primary not-italic">Product</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <Plus className="w-3 h-3 text-primary" /> Create a new listing on the marketplace
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handlePublish("Draft")}
                  className="px-6 py-3 rounded-xl border border-border text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all"
                >
                  Save Draft
                </button>
                <button className="px-6 py-3 rounded-xl bg-muted text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Preview
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Main Form Area */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* 1. Basic Info */}
                <section className="bg-card border border-border rounded-[2rem] p-8 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b border-border pb-4">
                    <Box className="w-4 h-4 text-primary" /> Product Fundamentals
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Product Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Sony WH-1000XM5 Headphones"
                        className="w-full bg-background border border-border rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 ring-primary/20 outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Detailed Description</label>
                      <textarea 
                        rows={5}
                        placeholder="Explain features, specs, and condition..."
                        className="w-full bg-background border border-border rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 ring-primary/20 outline-none resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                  </div>
                </section>

                {/* 2. Media Upload */}
                <section className="bg-card border border-border rounded-[2rem] p-8">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b border-border pb-4 mb-6">
                    <ImageIcon className="w-4 h-4 text-primary" /> Media Assets
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-all bg-muted/20">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-[8px] font-black uppercase opacity-60 text-center px-2">Click to Upload (Max 5MB)</span>
                    </div>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square rounded-2xl bg-muted/10 border border-border flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 opacity-10" />
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar Constraints */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Pricing & Crypto */}
<section className="bg-primary text-primary-foreground rounded-[2rem] p-6 shadow-xl shadow-primary/20">
  <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-6">
    <Coins className="w-4 h-4" /> Settlement
  </h3>
  <div className="space-y-4">
    <div className="space-y-2">
      <label className="text-[9px] font-black uppercase opacity-70">Payout Currency</label>
      <select 
        className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl px-4 py-3 text-sm font-bold outline-none cursor-pointer appearance-none"
        value={formData.crypto}
        onChange={(e) => setFormData({...formData, crypto: e.target.value})}
      >
        {CRYPTO_OPTIONS.map(opt => (
          /* Use theme colors for the options so they are readable in dark/light dropdowns */
          <option key={opt.value} value={opt.value} className="bg-background text-foreground">
            {opt.label}
          </option>
        ))}
      </select>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase opacity-70">Price ({formData.crypto})</label>
        <input 
          type="number" 
          placeholder="0.00"
          className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl px-4 py-3 text-sm font-bold outline-none placeholder:text-primary-foreground/40"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase opacity-70">Discount %</label>
        <input 
          type="number" 
          placeholder="Optional"
          className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl px-4 py-3 text-sm font-bold outline-none placeholder:text-primary-foreground/40"
          value={formData.discount}
          onChange={(e) => setFormData({...formData, discount: e.target.value})}
        />
      </div>
    </div>
  </div>
</section>

                {/* Inventory & Shipping */}
                <section className="bg-card border border-border rounded-[2rem] p-6 space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                      <Zap className="w-3 h-3" /> Auto-SKU
                    </label>
                    <div className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-xs font-mono font-black">
                      {sku || "AWAITING NAME"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Stock Units</label>
                    <input 
                      type="number" 
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Processing Time</label>
                    <select 
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none"
                      value={formData.processingTime}
                      onChange={(e) => setFormData({...formData, processingTime: e.target.value})}
                    >
                      <option>1-2 Days</option>
                      <option>3-5 Days</option>
                      <option>Immediate / Digital</option>
                    </select>
                  </div>
                </section>

                <button 
                  onClick={() => handlePublish("Active")}
                  disabled={isSubmitting}
                  className="w-full bg-foreground text-background py-6 rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Uploading..." : "Publish Listing"} <ShieldCheck className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </main>

        <SellerNav />
      </div>
    </div>
  );
}