"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Edit2,
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
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

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
  { label: "VTC (Vertcoin)", value: "VTC" },
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

interface ProductImage {
  url: string;
  thumbnailUrl?: string;
  publicId?: string;
}

export default function EditProductPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sku, setSku] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "0",
    crypto: "USDT",
    category: "Select Category",
    stock: "1",
    shippingFee: "0",
    processingTime: "1-2 Days",
    images: [] as ProductImage[],
    status: "pending" as 'pending' | 'approved' | 'rejected',
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/seller/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error("Invalid product data received");
        }

        const productData = result.data;

        const formattedData = {
          name: productData.name || "",
          description: productData.description || "",
          price: productData.price ? productData.price.toString() : "0",
          discount: productData.discount
            ? productData.discount.toString()
            : "0",
          crypto: productData.crypto || "USDT",
          category: productData.category || "Select Category",
          stock: productData.stock ? productData.stock.toString() : "1",
          shippingFee: productData.shippingFee
            ? productData.shippingFee.toString()
            : "0",
          processingTime: productData.processingTime || "1-2 Days",
          images:
            (productData.images as ProductImage[])?.map((img) => ({
              url: img.url,
              publicId: img.publicId,
              thumbnailUrl: img.thumbnailUrl || img.url,
            })) || [],
          status: productData.status || "pending",
        };

        setFormData(formattedData);
        setExistingImages(formattedData.images);

        if (!productData.sku && productData.name) {
          setSku(
            `${productData.name.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
          );
        } else if (productData.sku) {
          setSku(productData.sku);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product data");
        router.push("/general-dashboard/seller-dashboard/my-products");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentImageCount = formData.images.filter(
      (img) =>
        !("isNew" in img) || !removedImageIds.includes(img.publicId || ""),
    ).length;

    const totalFiles = currentImageCount + files.length;

    if (totalFiles > 4) {
      return toast.error("Maximum 4 images allowed");
    }

    const validFiles = files.filter((file) => {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        toast.error(
          `Invalid file type: ${file.name}. Only JPG, PNG, and WEBP are allowed.`,
        );
        return false;
      }

      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    const newImages = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      isNew: true,
      file,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    setImageFiles((prev) => [...prev, ...validFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = formData.images[index];
    if (
      imageToRemove.publicId &&
      !removedImageIds.includes(imageToRemove.publicId)
    ) {
      setRemovedImageIds((prev) => [...prev, imageToRemove.publicId!]);
    }
    if ("file" in imageToRemove) {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    }
    const filteredImages = [...formData.images];
    filteredImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: filteredImages }));
    if ("file" in imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    toast.info("Image removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return toast.error("Product name is required");
    if (
      !formData.price ||
      isNaN(Number(formData.price)) ||
      Number(formData.price) <= 0
    )
      return toast.error("Please enter a valid price");
    if (formData.category === "Select Category")
      return toast.error("Please select a category");
    if (formData.images.length < 2)
      return toast.error("Please upload at least 2 images");

    setIsSubmitting(true);
    setIsUploading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.set("id", id as string);
      formDataObj.set("name", formData.name.trim());
      formDataObj.set("price", formData.price);
      formDataObj.set("category", formData.category);
      formDataObj.set("description", formData.description.trim());
      formDataObj.set("discount", formData.discount || "0");
      formDataObj.set("crypto", formData.crypto);
      formDataObj.set("stock", formData.stock || "1");
      formDataObj.set("shippingFee", formData.shippingFee || "0");
      formDataObj.set("processingTime", formData.processingTime);

      removedImageIds.forEach((id) => formDataObj.append("removedImages", id));
      imageFiles.forEach((file) => formDataObj.append("images", file));

      const response = await fetch(`/api/seller/products/${id}`, {
        method: "PUT",
        body: formDataObj,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update product");
      }

      const result = await response.json();
      if (result.success) {
        if (formData.status === 'rejected') {
          toast.success("Product resubmitted for review! Status changed to pending.");
        } else {
          toast.success("Product updated successfully!");
        }
        router.push("/general-dashboard/seller-dashboard/my-products");
      } else {
        throw new Error(result.error || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update product";
      toast.error(errorMessage, {
        duration: 5000,
        action: { label: "Retry", onClick: () => handleSubmit(e) },
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
                <div className="flex items-center gap-4 mb-2">
                  <Link
                    href="/general-dashboard/seller-dashboard/my-products"
                    className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                  <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                    Edit{" "}
                    <span className="text-primary not-italic">Product</span>
                  </h1>
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <Edit2 className="w-3 h-3 text-primary" /> Update your product
                  listing
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  form="product-form"
                  disabled={isSubmitting || isLoading}
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground cursor-pointer text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isUploading ? "Uploading..." : "Saving..."}
                    </>
                  ) : (
                    "Update Product"
                  )}
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="w-full flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : (
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
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                          Product Category
                        </label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-full flex justify-between items-center bg-background border border-border rounded-xl px-4 py-4 text-sm font-bold outline-none ring-primary/20 focus:ring-2 cursor-pointer">
                              <span className="flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4 text-primary" />
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

                  {/* 2. Media Upload */}
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
                      {formData.images.length < 4 && (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-all bg-muted/20 group"
                        >
                          <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-[8px] font-black uppercase opacity-60 text-center px-2">
                            Add More Images
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

                      {formData.images.map((img, idx) => (
                        <div
                          key={img.url}
                          className="group relative aspect-square rounded-2xl overflow-hidden border border-border"
                        >
                          <img
                            src={img.url}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 bg-background/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* 3. Pricing & Inventory */}
                  <section className="bg-card border border-border rounded-[2rem] p-8">
                    <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b border-border pb-4 mb-6">
                      <Coins className="w-4 h-4 text-primary" /> Pricing &
                      Inventory
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                          Price ({formData.crypto})
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="0.00"
                            className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-4 text-sm font-bold focus:ring-2 ring-primary/20 outline-none"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: e.target.value,
                              })
                            }
                            step="0.01"
                            min="0"
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-muted hover:bg-muted/80 rounded-lg px-3 py-1.5 text-xs font-bold flex items-center gap-1 cursor-pointer">
                                {formData.crypto}
                                <ChevronDown className="w-3 h-3 opacity-60" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-card border-border">
                              {CRYPTO_OPTIONS.map((option) => (
                                <DropdownMenuItem
                                  key={option.value}
                                  className="text-xs font-bold cursor-pointer"
                                  onClick={() =>
                                    setFormData({
                                      ...formData,
                                      crypto: option.value,
                                    })
                                  }
                                >
                                  {option.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                          Discount (%)
                        </label>
                        <input
                          type="number"
                          className="w-full bg-background border border-border rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 ring-primary/20 outline-none"
                          value={formData.discount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discount: e.target.value,
                            })
                          }
                          min="0"
                          max="100"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          className="w-full bg-background border border-border rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 ring-primary/20 outline-none"
                          value={formData.stock}
                          onChange={(e) =>
                            setFormData({ ...formData, stock: e.target.value })
                          }
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                          Shipping Fee ({formData.crypto})
                        </label>
                        <input
                          type="number"
                          className="w-full bg-background border border-border rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 ring-primary/20 outline-none"
                          value={formData.shippingFee}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shippingFee: e.target.value,
                            })
                          }
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                  </section>

                  {/* 4. Processing Time */}
                  <section className="bg-card border border-border rounded-[2rem] p-8">
                    <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b border-border pb-4 mb-6">
                      <Clock className="w-4 h-4 text-primary" /> Processing Time
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {PROCESSING_TIMES.map((time) => (
                        <button
                          key={time}
                          type="button"
                          className={`px-4 py-3 rounded-xl text-sm font-bold text-center border transition-colors cursor-pointer ${
                            formData.processingTime === time
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-background border-border hover:border-foreground/20"
                          }`}
                          onClick={() =>
                            setFormData({ ...formData, processingTime: time })
                          }
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Preview Card */}
                  {/* Preview Card */}
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-primary" /> Product Preview
                    </h3>

                    <div className="space-y-4">
                      <div className="aspect-square bg-muted/20 rounded-xl overflow-hidden">
                        {formData.images.length > 0 ? (
                          <img
                            src={formData.images[0].url}
                            alt={formData.name || "Product preview"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-bold line-clamp-2">
                          {formData.name || "Product Name"}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black">
                            {formData.price
                              ? `${formData.price} ${formData.crypto}`
                              : "0.00"}
                          </span>
                          {formData.discount &&
                            parseFloat(formData.discount) > 0 && (
                              <span className="text-xs line-through text-muted-foreground">
                                {(
                                  parseFloat(formData.price) /
                                  (1 - parseFloat(formData.discount) / 100)
                                ).toFixed(2)}{" "}
                                {formData.crypto}
                              </span>
                            )}
                          {formData.discount &&
                            parseFloat(formData.discount) > 0 && (
                              <span className="text-xs font-bold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                                -{formData.discount}%
                              </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>SKU: {sku || "N/A"}</span>
                          <span>•</span>
                          <span>In Stock: {formData.stock || 0}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span>Shipping</span>
                          <span className="font-bold">
                            {parseFloat(formData.shippingFee) > 0
                              ? `${formData.shippingFee} ${formData.crypto}`
                              : "Free Shipping"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Processing</span>
                          <span className="font-bold">
                            {formData.processingTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                        Status
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          formData.status === 'approved' ? 'bg-green-500' :
                          formData.status === 'rejected' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`} />
                        <span className="text-sm font-bold capitalize">{formData.status}</span>
                      </div>
                      {formData.status === 'rejected' && (
                        <p className="text-xs text-muted-foreground mt-2">
                          ⚠️ Editing this rejected product will resubmit it for review
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border space-y-3">
                      <button
                        type="submit"
                        form="product-form"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isSubmitting || isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {isUploading ? "Uploading..." : "Saving Changes..."}
                          </>
                        ) : (
                          "Update Product"
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full bg-transparent border border-border py-3 rounded-xl text-sm font-bold hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </main>
        <SellerNav />
      </div>
    </div>
  );
}
