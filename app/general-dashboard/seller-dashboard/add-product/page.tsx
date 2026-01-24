"use client";

import React, { useState, useRef } from "react";
import { 
  Plus, 
  Upload, 
  Image as ImageIcon, 
  Eye, 
  Zap,
  Coins,
  ShieldCheck,
  Box,
  ChevronDown,
  Clock,
  LayoutGrid,
  X
} from "lucide-react";
import { toast } from "sonner";

// Shadcn UI Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

const CRYPTO_OPTIONS = [
  { label: "USDT (Tether)", value: "USDT" },
  { label: "BTC (Bitcoin)", value: "BTC" },
  { label: "SOL (Solana)", value: "SOL" },
  { label: "ETH (Ethereum)", value: "ETH" },
];

const JUMIA_CATEGORIES = [
  "Supermarket", "Health & Beauty", "Home & Office", 
  "Phones & Tablets", "Computing", "Electronics", 
  "Fashion", "Baby Products", "Gaming", "Sporting Goods"
];

const PROCESSING_TIMES = ["1-2 Days", "3-5 Days", "7-10 Days", "Immediate / Digital"];

export default function AddProductPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sku, setSku] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    crypto: "USDT",
    category: "Select Category",
    stock: "",
    shippingFee: "0",
    processingTime: "1-2 Days",
    images: [] as string[], // Storing URLs/base64 for preview
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (formData.images.length + files.length > 4) {
      return toast.error("Maximum 4 images allowed");
    }
    
    // Create preview URLs
    const newImages = files.map(file => URL.createObjectURL(file));
    setFormData({ ...formData, images: [...formData.images, ...newImages] });
  };

  const removeImage = (index: number) => {
    const filtered = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: filtered });
  };

  const handlePublish = (status: "Active" | "Draft") => {
    if (!formData.name || !formData.price || formData.category === "Select Category") {
      return toast.error("Missing required fields");
    }
    if (formData.images.length < 2) {
      return toast.error("Please upload at least 2 images");
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success(`Product saved as ${status}!`);
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
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
                <button onClick={() => handlePublish("Draft")} className="px-6 py-3 rounded-xl cursor-pointer border border-border text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all">
                  Save Draft
                </button>
                <button className="px-6 py-3 rounded-xl bg-muted cursor-pointer text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
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
                    {/* Category Dropdown */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Product Category</label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="w-full flex justify-between items-center bg-background border border-border rounded-xl px-4 py-4 text-sm font-bold outline-none ring-primary/20 focus:ring-2">
                            <span className="flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4 text-primary" /> {formData.category}
                            </span>
                            <ChevronDown className="w-4 h-4 opacity-50" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-card border-border">
                          {JUMIA_CATEGORIES.map((cat) => (
                            <DropdownMenuItem 
                                key={cat} 
                                className="font-bold text-xs uppercase cursor-pointer"
                                onClick={() => setFormData({...formData, category: cat})}
                            >
                              {cat}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Product Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Headphones"
                        className="w-full bg-background border border-border rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 ring-primary/20 outline-none"
                        value={formData.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setFormData({ ...formData, name });
                          if (name.length > 2) setSku(`${name.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);
                        }}
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

                {/* 2. Media Upload (Min 2, Max 4) */}
                <section className="bg-card border border-border rounded-[2rem] p-8">
                  <div className="flex justify-between items-center border-b border-border pb-4 mb-6">
                    <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-primary" /> Media Assets
                    </h3>
                    <span className={`text-[9px] font-bold px-3 py-1 rounded-full ${formData.images.length < 2 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                       {formData.images.length} / 4 Images (Min 2)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Upload Trigger */}
                    {formData.images.length < 4 && (
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-all bg-muted/20 group"
                        >
                          <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-[8px] font-black uppercase opacity-60 text-center px-2">Click to Upload</span>
                          <input type="file" hidden ref={fileInputRef} multiple onChange={handleImageUpload} accept="image/*" />
                        </div>
                    )}

                    {/* Image Previews */}
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-border group">
                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                        <button 
                           onClick={() => removeImage(idx)}
                           className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* Empty Slots */}
                    {Array.from({ length: Math.max(0, 4 - formData.images.length - (formData.images.length < 4 ? 1 : 0)) }).map((_, i) => (
                      <div key={i} className="aspect-square rounded-2xl bg-muted/10 border border-border flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 opacity-10" />
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar Constraints */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Settlement Dropdown */}
                <section className="bg-primary text-primary-foreground rounded-[2rem] p-6 shadow-xl shadow-primary/20">
                  <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-6">
                    <Coins className="w-4 h-4" /> Settlement
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase opacity-70">Payout Currency</label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="w-full flex justify-between items-center bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                            {CRYPTO_OPTIONS.find(o => o.value === formData.crypto)?.label}
                            <ChevronDown className="w-4 h-4 opacity-50" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                          {CRYPTO_OPTIONS.map((opt) => (
                            <DropdownMenuItem 
                                key={opt.value} 
                                onClick={() => setFormData({...formData, crypto: opt.value})}
                                className="font-bold text-xs uppercase"
                            >
                              {opt.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                          placeholder="Opt."
                          className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl px-4 py-3 text-sm font-bold outline-none placeholder:text-primary-foreground/40"
                          value={formData.discount}
                          onChange={(e) => setFormData({...formData, discount: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Inventory & Processing Dropdown */}
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
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-primary/20"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Processing Time</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-full flex justify-between items-center bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none ring-primary/20 focus:ring-2">
                          <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-primary" /> {formData.processingTime}
                          </span>
                          <ChevronDown className="w-4 h-4 opacity-50" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                        {PROCESSING_TIMES.map((time) => (
                          <DropdownMenuItem 
                              key={time} 
                              onClick={() => setFormData({...formData, processingTime: time})}
                              className="font-bold text-xs uppercase"
                          >
                            {time}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </section>

                <button 
                  onClick={() => handlePublish("Active")}
                  disabled={isSubmitting}
                  className="w-full bg-foreground cursor-pointer text-background py-6 rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
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