"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

// Mock Data representing various product states
const MY_PRODUCTS = [
  {
    id: "PROD-001",
    name: "Hyper-X Mechanical Keyboard",
    price: "120.00",
    crypto: "USDT",
    stock: 45,
    sales: 120,
    status: "Active",
    image: "/api/placeholder/400/400",
  },
  {
    id: "PROD-002",
    name: "Wireless Ergonomic Mouse",
    price: "0.0015",
    crypto: "BTC",
    stock: 3,
    sales: 89,
    status: "Low Stock",
    image: "/api/placeholder/400/400",
  },
  {
    id: "PROD-003",
    name: "USB-C Multiport Dock",
    price: "45.00",
    crypto: "USDT",
    stock: 0,
    sales: 230,
    status: "Out of Stock",
    image: "/api/placeholder/400/400",
  },
  {
    id: "PROD-004",
    name: "Gaming Headset Stand",
    price: "25.00",
    crypto: "SOL",
    stock: 12,
    sales: 0,
    status: "Draft",
    image: "/api/placeholder/400/400",
  },
];

export default function MyProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
                  {MY_PRODUCTS.length} Total Listings
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
                  href="/seller/products/add"
                  className="flex-1 md:flex-none bg-foreground text-background px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add New Product
                </Link>
              </div>
            </div>

            {/* Stats Overview Quick-Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Active", count: 2, color: "text-green-500" },
                { label: "Out of Stock", count: 1, color: "text-destructive" },
                { label: "Drafts", count: 1, color: "text-amber-500" },
                { label: "Total Sales", count: 439, color: "text-primary" },
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
              {MY_PRODUCTS.map((product) => (
                <div
                  key={product.id}
                  className="group bg-card border border-border rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md ${
                          product.status === "Active"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : product.status === "Out of Stock"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}
                      >
                        {product.status}
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
                          {product.price}{" "}
                          <span className="text-[10px] not-italic">
                            {product.crypto}
                          </span>
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">
                          SKU: {product.id}
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
                          {product.sales} Total
                        </span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <button className="flex-1 bg-muted hover:bg-foreground hover:text-background py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button className="p-2.5 border border-border rounded-xl hover:bg-destructive hover:text-white transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Tip */}
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 mt-12 flex items-center gap-4">
              <Zap className="w-6 h-6 text-primary shrink-0" />
              <p className="text-[10px] font-bold text-primary/80 uppercase tracking-tight max-w-2xl leading-relaxed">
                Boost your visibility: Products with more than 5 high-quality
                images and descriptions exceeding 200 words are 40% more likely
                to be featured on the platform&apos;s trending list.
              </p>
            </div>
          </div>
        </main>

        <SellerNav />
      </div>
    </div>
  );
}
