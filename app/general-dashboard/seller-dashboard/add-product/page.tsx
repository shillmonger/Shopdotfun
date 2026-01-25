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
  X,
  Loader2,
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
import { createProduct } from "./actions";
import { useRouter } from "next/navigation";

const CRYPTO_OPTIONS = [
  { label: "USDT (Tether)", value: "USDT" },
  { label: "BTC (Bitcoin)", value: "BTC" },
  { label: "SOL (Solana)", value: "SOL" },
  { label: "ETH (Ethereum)", value: "ETH" },
];

const JUMIA_CATEGORIES = [
  "Supermarket",
  "Health & Beauty",
  "Home & Office",
  "Phones & Tablets",
  "Computing",
  "Electronics",
  "Fashion",
  "Baby Products",
  "Gaming",
  "Sporting Goods",
];

const PROCESSING_TIMES = [
  "1-2 Days",
  "3-5 Days",
  "7-10 Days",
  "Immediate / Digital",
];

export default function AddProductPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sku, setSku] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    crypto: "USDT",
    category: "Select Category",
    stock: "1",
    shippingFee: "0",
    processingTime: "1-2 Days",
    images: [] as string[],
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const MAX_TOTAL_SIZE = 1 * 1024 * 1024; // 1MB in bytes

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalFiles = formData.images.length + files.length;
    
    if (totalFiles > 4) {
      return toast.error("Maximum 4 images allowed");
    }

    // Calculate total size of new files
    const totalNewSize = files.reduce((total, file) => total + file.size, 0);
    const currentTotalSize = imageFiles.reduce((total, file) => total + file.size, 0);
    
    if (currentTotalSize + totalNewSize > MAX_TOTAL_SIZE) {
      return toast.error(`Total size of all images must be less than 1MB. Current size: ${(currentTotalSize / (1024 * 1024)).toFixed(2)}MB`);
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 10 * 1024 * 1024; // 10MB per file
      
      if (!validTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}. Only JPG, PNG, and WEBP are allowed.`);
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 10MB.`);
        return false;
      }
      
      return true;
    });

    // Create preview URLs and store file objects
    const newImages = validFiles.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
    setImageFiles((prev) => [...prev, ...validFiles]);
    
    // Reset file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const filteredImages = [...formData.images];
    const filteredFiles = [...imageFiles];

    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(filteredImages[index]);

    filteredImages.splice(index, 1);
    filteredFiles.splice(index, 1);

    setFormData((prev) => ({ ...prev, images: filteredImages }));
    setImageFiles(filteredFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields with specific messages
    if (!formData.name.trim()) {
      return toast.error("Product name is required");
    }
    
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      return toast.error("Please enter a valid price");
    }
    
    if (formData.category === "Select Category") {
      return toast.error("Please select a category");
    }

    if (imageFiles.length < 2) {
      return toast.error("Please upload at least 2 images");
    }

    setIsSubmitting(true);
    setIsUploading(true);

    try {
      const formDataObj = new FormData();
      
      // Add all form fields with validation
      formDataObj.set('name', formData.name.trim());
      formDataObj.set('price', formData.price);
      formDataObj.set('category', formData.category);
      formDataObj.set('description', formData.description.trim());
      formDataObj.set('discount', formData.discount || '0');
      formDataObj.set('crypto', formData.crypto);
      formDataObj.set('stock', formData.stock || '1');
      formDataObj.set('shippingFee', formData.shippingFee || '0');
      formDataObj.set('processingTime', formData.processingTime);

      // Add image files with progress tracking
      imageFiles.forEach((file) => {
        formDataObj.append('images', file);
      });

      const result = await createProduct(formDataObj);

      if (result.success) {
        toast.success("Product submitted for review!");
        
        // Reset form
        setFormData({
          name: "",
          description: "",
          price: "",
          discount: "",
          crypto: "USDT",
          category: "Select Category",
          stock: "1",
          shippingFee: "0",
          processingTime: "1-2 Days",
          images: [],
        });
        setImageFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Redirect to products list or dashboard
        router.push("/general-dashboard/seller-dashboard/add-product");
      } else {
        throw new Error(result.error || "Failed to create product");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit product";
      toast.error(errorMessage, {
        duration: 5000,
        action: {
          label: 'Retry',
          onClick: () => handleSubmit(e)
        }
      });
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      <SellerSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  List <span className="text-primary not-italic">Product</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <Plus className="w-3 h-3 text-primary" /> Create a new listing
                  on the marketplace
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  form="product-form"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground cursor-pointer text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isUploading ? 'Uploading...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Save Product
                    </>
                  )}
                </button>
              </div>
            </div>

            <form
              id="product-form"
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Main Form Area */}
              <div className="lg:col-span-8 space-y-8">
                {/* 1. Basic Info */}
                <section className="bg-card border border-border rounded-[2rem] p-8 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b border-border pb-4">
                    <Box className="w-4 h-4 text-primary" /> Product
                    Fundamentals
                  </h3>

                  <div className="grid grid-cols-1 gap-6">
                    {/* Category Dropdown */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                        Product Category
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="w-full flex justify-between items-center bg-background border border-border rounded-xl px-4 py-4 text-sm font-bold outline-none ring-primary/20 focus:ring-2">
                            <span className="flex items-center gap-2">
                              <LayoutGrid className="w-4 h-4 text-primary" />{" "}
                              {formData.category}
                            </span>
                            <ChevronDown className="w-4 h-4 opacity-50" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-card border-border">
                          {JUMIA_CATEGORIES.map((cat) => (
                            <DropdownMenuItem
                              key={cat}
                              className="font-bold text-xs uppercase cursor-pointer"
                              onClick={() =>
                                setFormData({ ...formData, category: cat })
                              }
                            >
                              {cat}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                        Product Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Headphones"
                        className="w-full bg-background border border-border rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 ring-primary/20 outline-none"
                        value={formData.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setFormData({ ...formData, name });
                          if (name.length > 2)
                            setSku(
                              `${name.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
                            );
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                        Detailed Description
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Explain features, specs, and condition..."
                        className="w-full bg-background border border-border rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 ring-primary/20 outline-none resize-none"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </section>

                {/* 2. Media Upload (Min 2, Max 4) */}
                <section className="bg-card border border-border rounded-[2rem] p-8">
                  <div className="flex justify-between items-center border-b border-border pb-4 mb-6">
                    <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-primary" /> Media
                      Assets
                    </h3>
                    <span
                      className={`text-[9px] font-bold px-3 py-1 rounded-full ${formData.images.length < 2 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}
                    >
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
                        <span className="text-[8px] font-black uppercase opacity-60 text-center px-2">
                          Click to Upload
                        </span>
                        <input
                          type="file"
                          hidden
                          ref={fileInputRef}
                          multiple
                          onChange={handleImageUpload}
                          accept="image/*"
                        />
                      </div>
                    )}

                    {/* Image Previews */}
                    {formData.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-2xl overflow-hidden border border-border group"
                      >
                        <img
                          src={img}
                          alt="preview"
                          className="w-full h-full object-cover cursor-pointer"
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 cursor-pointer p-1 bg-destructive text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}

                    {/* Empty Slots */}
                    {Array.from({
                      length: Math.max(
                        0,
                        4 -
                          formData.images.length -
                          (formData.images.length < 4 ? 1 : 0),
                      ),
                    }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-2xl bg-muted/10 border border-border flex items-center justify-center"
                      >
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
                      <label className="text-[9px] font-black uppercase opacity-70">
                        Payout Currency
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="w-full flex justify-between items-center bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                            {
                              CRYPTO_OPTIONS.find(
                                (o) => o.value === formData.crypto,
                              )?.label
                            }
                            <ChevronDown className="w-4 h-4 opacity-50" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                          {CRYPTO_OPTIONS.map((opt) => (
                            <DropdownMenuItem
                              key={opt.value}
                              onClick={() =>
                                setFormData({ ...formData, crypto: opt.value })
                              }
                              className="font-bold text-xs uppercase"
                            >
                              {opt.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase opacity-70">
                          Price ({formData.crypto})
                        </label>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl px-4 py-3 text-sm font-bold outline-none placeholder:text-primary-foreground/40"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase opacity-70">
                          Discount %
                        </label>
                        <input
                          type="number"
                          placeholder="Opt."
                          className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl px-4 py-3 text-sm font-bold outline-none placeholder:text-primary-foreground/40"
                          value={formData.discount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discount: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase opacity-70">
                          Shipping Fee
                        </label>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl px-4 py-3 text-sm font-bold outline-none placeholder:text-primary-foreground/40"
                          value={formData.shippingFee}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shippingFee: e.target.value,
                            })
                          }
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
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                      Stock Units
                    </label>
                    <input
                      type="number"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-primary/20"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                      Processing Time
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-full flex justify-between items-center bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none ring-primary/20 focus:ring-2">
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />{" "}
                            {formData.processingTime}
                          </span>
                          <ChevronDown className="w-4 h-4 opacity-50" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                        {PROCESSING_TIMES.map((time) => (
                          <DropdownMenuItem
                            key={time}
                            onClick={() =>
                              setFormData({ ...formData, processingTime: time })
                            }
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
                  type="submit"
                  form="product-form"
                  disabled={isSubmitting}
                  className="
    w-full
    cursor-pointer
    flex items-center justify-center gap-2
    bg-foreground text-background
    text-xs font-black uppercase tracking-widest
    py-4 rounded-2xl
    hover:bg-primary transition-all
    shadow-2xl
    disabled:opacity-50 disabled:cursor-not-allowed
  "
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit for Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>

        <SellerNav />
      </div>
    </div>
  );
}
