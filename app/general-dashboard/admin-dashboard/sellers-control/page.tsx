"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  PackageSearch,
  CheckCircle2,
  XCircle,
  Search,
  Box,
  Tag,
  Truck,
  Banknote,
  Layers,
  Image as ImageIcon,
  AlertCircle,
  FileText,
  User,
  Mail,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// Import Shadcn Dropdown Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const INITIAL_PRODUCTS = [
  {
    id: "PROD-771",
    name: "Hyper-X Mechanical Keyboard",
    description: "High-performance mechanical keyboard with RGB lighting.",
    amount: 150.0,
    discount: 10,
    currency: "USD",
    stock: 45,
    category: "Electronics",
    shippingFee: 15.0,
    merchantName: "Alex Johnson",
    merchantEmail: "alex@techstore.io",
    businessName: "TechStore IO",
    status: "Pending",
    createdAt: new Date().toISOString(), // Today
    images: [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400",
    ],
  },
  {
    id: "PROD-902",
    name: "Vintage Leather Jacket",
    description: "Genuine cowhide leather jacket.",
    amount: 299.99,
    discount: 0,
    currency: "USD",
    stock: 12,
    category: "Fashion",
    shippingFee: 0.0,
    merchantName: "Sarah Mode",
    merchantEmail: "sarah@fashion.com",
    businessName: "Sarah's Boutique",
    status: "Active",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"],
  },
];

export default function AdminProductManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof INITIAL_PRODUCTS)[0] | null
  >(null);
  const [reason, setReason] = useState("");
  const [timeFilter, setTimeFilter] = useState("All Time");

  const handleAction = (id: string, newStatus: string) => {
    if (newStatus === "Rejected" && !reason) {
      return toast.error("Reason Required", {
        description: "Please state why the product was rejected.",
      });
    }
    setProducts(
      products.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
    );
    toast.success(`Product ${newStatus}`);
    setReason("");
    setSelectedProduct(null);
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    const now = new Date();
    return products.filter((p) => {
      const pDate = new Date(p.createdAt);
      if (timeFilter === "Today")
        return pDate.toDateString() === now.toDateString();
      if (timeFilter === "Yesterday") {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return pDate.toDateString() === yesterday.toDateString();
      }
      if (timeFilter === "1 Week") {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return pDate >= weekAgo;
      }
      return true;
    });
  }, [products, timeFilter]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  Product{" "}
                  <span className="text-primary not-italic">Review</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <PackageSearch className="w-3 h-3 text-primary" /> Approval
                  Queue
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Shadcn Dropdown Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 bg-card border border-border px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-muted transition-colors outline-none">
                      <Filter className="w-3 h-3" /> {timeFilter}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-card border-border"
                  >
                    <DropdownMenuLabel className="text-[10px] font-black uppercase">
                      Filter by Date
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {["All Time", "Today", "Yesterday", "1 Week"].map(
                      (option) => (
                        <DropdownMenuItem
                          key={option}
                          onClick={() => setTimeFilter(option)}
                          className="text-[10px] font-bold uppercase cursor-pointer"
                        >
                          {option}
                        </DropdownMenuItem>
                      ),
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-xs font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Product Table */}
              <div className="lg:col-span-7 bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                          Product
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                          Merchant
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                          Status
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className={`hover:bg-muted/20 transition-colors ${selectedProduct?.id === product.id ? "bg-primary/5" : ""}`}
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                                <img
                                  src={product.images[0]}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-black text-sm uppercase italic tracking-tighter">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase italic">
                                {product.businessName}
                              </span>
                              <span className="text-[8px] font-bold text-muted-foreground uppercase">
                                {product.merchantEmail}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${
                                product.status === "Active"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : product.status === "Rejected"
                                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                                    : "bg-muted text-muted-foreground border-border"
                              }`}
                            >
                              {product.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className="p-2 border border-border rounded-lg hover:bg-primary hover:text-white transition-all cursor-pointer"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Review Panel */}
              <div className="lg:col-span-5">
                {selectedProduct ? (
                  <div className="bg-card border-2 border-primary rounded-[2rem] p-6 space-y-6 sticky top-24 shadow-2xl">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">
                        Review Details
                      </h3>
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="p-1 hover:bg-muted rounded-md cursor-pointer"
                      >
                        <XCircle className="w-5 h-5 opacity-40" />
                      </button>
                    </div>

                    {/* Merchant Info Section */}
                    <div className="bg-muted/30 p-4 rounded-2xl border border-border space-y-2">
                      <p className="text-[9px] font-black uppercase text-primary tracking-widest">
                        Submitted By
                      </p>
                      <div className="flex items-center gap-3">
                        <User className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-black uppercase italic">
                          {selectedProduct.merchantName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-bold uppercase">
                          {selectedProduct.merchantEmail}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.slice(0, 4).map((img, idx) => (
                        <div
                          key={idx}
                          className="aspect-square rounded-xl bg-muted overflow-hidden border border-border"
                        >
                          <img
                            src={img}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase leading-relaxed text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border/50">
                        {selectedProduct.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                            <Banknote className="w-3 h-3 text-primary" />{" "}
                            {selectedProduct.amount} {selectedProduct.currency}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                            <Tag className="w-3 h-3 text-primary" /> Disc:{" "}
                            {selectedProduct.discount}%
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                            <Box className="w-3 h-3 text-primary" /> Stock:{" "}
                            {selectedProduct.stock}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                            <Truck className="w-3 h-3 text-primary" /> Ship: $
                            {selectedProduct.shippingFee}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Area */}
                    <div className="pt-4 border-t border-border space-y-4">
                      {selectedProduct.status === "Pending" ? (
                        <>
                          <textarea
                            className="w-full bg-background border border-border rounded-xl p-4 text-[10px] font-bold uppercase outline-none focus:ring-2 ring-primary/20"
                            placeholder="Reason for rejection..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() =>
                                handleAction(selectedProduct.id, "Active")
                              }
                              className="bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 transition-all"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Approve
                            </button>
                            <button
                              onClick={() =>
                                handleAction(selectedProduct.id, "Rejected")
                              }
                              className="bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 transition-all"
                            >
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="bg-green-500/10 border-2 border-green-500 text-green-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> Product Approved
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-card border-2 border-dashed border-border rounded-[2rem] p-12 flex flex-col items-center justify-center text-center opacity-40">
                    <ImageIcon className="w-12 h-12 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                      Select a product listing to review.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Compliance Note */}
            <div className="mt-8 flex flex-col md:flex-row items-center md:items-start gap-4 bg-primary/5 border border-primary/20 p-6 rounded-[2rem] text-center md:text-left">
              <AlertCircle className="w-5 h-5 text-primary shrink-0" />

              <p className="text-[10px] font-bold text-primary/80 uppercase tracking-tight leading-relaxed">
                Moderation Policy: Products must meet high-resolution image
                standards and accurate category tagging. Approved products will
                go live on the marketplace immediately. Rejected products will
                notify the merchant with your feedback.
              </p>
            </div>
          </div>
        </main>
        <AdminNav />
      </div>
    </div>
  );
}
