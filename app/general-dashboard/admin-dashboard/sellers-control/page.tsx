"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";
import { adminApi } from "@/lib/admin";

// Import Shadcn Dropdown Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
type ProductStatus = 'pending' | 'approved' | 'rejected';

interface ProductImage {
  url: string;
  thumbnailUrl: string;
  publicId: string;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  crypto: string;
  category: string;
  stock: number;
  shippingFee: number;
  processingTime: string;
  images: ProductImage[];
  sellerEmail: string;
  status: ProductStatus;
  rejectionReason?: string;
  productCode?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProductManagement() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reason, setReason] = useState("");
  const [timeFilter, setTimeFilter] = useState("All Time");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getPendingProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAction = async (productId: string, newStatus: 'approved' | 'rejected') => {
    if (newStatus === 'rejected' && !reason.trim()) {
      return toast.error('Reason Required', {
        description: 'Please state why the product was rejected.',
      });
    }

    try {
      setIsProcessing(true);
      const updatedProduct = await adminApi.updateProductStatus(
        productId,
        newStatus,
        reason
      );

      // Update the local state to reflect the change
      setProducts(products.map(p => 
        p._id === productId ? updatedProduct : p
      ));
      
      toast.success(`Product ${newStatus} successfully`);
      setReason("");
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error(`Failed to ${newStatus} product`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    if (!products.length) return [];
    
    const now = new Date();
    return products.filter((p) => {
      const pDate = new Date(p.createdAt);
      if (timeFilter === "Today") {
        return pDate.toDateString() === now.toDateString();
      }
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

  // Format price with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-3xl">
                <PackageSearch className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-bold">No products to review</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  All caught up! Check back later for new submissions.
                </p>
              </div>
            ) : (
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
                            key={product._id}
                            className="hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-muted overflow-hidden">
                                  {product.images?.[0]?.url ? (
                                    <img
                                      src={product.images[0].thumbnailUrl}
                                      alt={product.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-muted">
                                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm font-medium line-clamp-1">
                                    {product.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {product.category}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm">
                                {product.sellerEmail.split('@')[0]}
                                <div className="text-xs text-muted-foreground">
                                  {product.sellerEmail}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  product.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : product.status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await handleAction(product._id, 'approved');
                                  }}
                                  disabled={isProcessing}
                                  className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                >
                                  {isProcessing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="h-5 w-5" />
                                  )}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProduct(product);
                                  }}
                                  disabled={isProcessing}
                                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                >
                                  <XCircle className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Product Details Sidebar */}
                <div className="lg:col-span-5">
                  {selectedProduct ? (
                    <div className="bg-card border border-border rounded-[2rem] p-6 space-y-6">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-black uppercase tracking-tight">
                          {selectedProduct.name}
                        </h2>
                        <button
                          onClick={() => setSelectedProduct(null)}
                          className="p-1 hover:bg-muted rounded-md cursor-pointer"
                        >
                          <XCircle className="w-5 h-5 opacity-40" />
                        </button>
                      </div>

                      {/* Merchant Info */}
                      <div className="bg-muted/30 p-4 rounded-2xl border border-border space-y-2">
                        <p className="text-[9px] font-black uppercase text-primary tracking-widest">
                          Submitted By
                        </p>
                        <div className="flex items-center gap-3">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] font-black uppercase">
                            {selectedProduct.sellerEmail.split('@')[0]}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] font-bold uppercase">
                            {selectedProduct.sellerEmail}
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
                              src={img.url}
                              alt={selectedProduct.name}
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
                              <Banknote className="w-3 h-3 text-primary" />
                              {formatPrice(selectedProduct.price)}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                              <Tag className="w-3 h-3 text-primary" /> Disc: {selectedProduct.discount}%
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                              <Box className="w-3 h-3 text-primary" /> Stock: {selectedProduct.stock}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                              <Truck className="w-3 h-3 text-primary" /> Ship: ${selectedProduct.shippingFee}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border space-y-4">
                        {selectedProduct.status === "pending" ? (
                          <>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">
                                Rejection Reason (if applicable)
                              </label>
                              <textarea
                                className="w-full bg-background border border-border rounded-xl p-3 text-xs font-medium outline-none focus:ring-2 ring-primary/20 min-h-[100px]"
                                placeholder="Provide a reason for rejection..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() => handleAction(selectedProduct._id, 'approved')}
                                disabled={isProcessing}
                                className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                              >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                Approve
                              </button>
                              <button
                                onClick={() => handleAction(selectedProduct._id, 'rejected')}
                                disabled={isProcessing || !reason.trim()}
                                className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                              >
                                <XCircle className="w-4 h-4" /> Reject
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest flex flex-col items-center justify-center gap-2 border-2 ${
                            selectedProduct.status === 'approved' 
                            ? 'bg-green-500/10 border-green-500/30 text-green-500' 
                            : 'bg-red-500/10 border-red-500/30 text-red-500'
                          }`}>
                            <div className="flex items-center gap-2">
                              {selectedProduct.status === 'approved' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                              Product {selectedProduct.status}
                            </div>
                            {selectedProduct.rejectionReason && (
                              <p className="text-[9px] lowercase font-medium opacity-80 italic">Reason: {selectedProduct.rejectionReason}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-card border-2 border-dashed border-border rounded-[2rem] p-12 flex flex-col items-center justify-center text-center opacity-40 h-full min-h-[400px]">
                      <PackageSearch className="w-12 h-12 mb-4 text-muted-foreground" />
                      <p className="text-xs font-black uppercase tracking-widest leading-relaxed text-muted-foreground">
                        Select a product to review
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Click on any product in the list to view details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

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