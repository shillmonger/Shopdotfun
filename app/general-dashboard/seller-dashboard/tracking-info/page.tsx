"use client";

import React, { useState, useEffect } from "react";
import { 
  Hash, 
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  ChevronDown,
  Package,
  StickyNote,
  Activity,
  CreditCard,
  UserCheck,
  ShieldAlert
} from "lucide-react";

import { toast } from "sonner";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

// Interface for product data
interface Product {
  id: string;
  name: string;
  code: string;
  orderId: string;
  status: {
    shipping: string;
    buyerAction: string;
    payment: string;
    adminAction: string;
  };
}

// Interface for order status data
interface OrderStatusData {
  orderId: string;
  status: {
    shipping: string;
    buyerAction: string;
    payment: string;
    adminAction: string;
  };
  productInfo: any;
  buyerInfo: any;
  paymentInfo: any;
}

export default function UploadTrackingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatusData | null>(null);
  const [showStatus, setShowStatus] = useState(false);

  const [trackingData, setTrackingData] = useState({
    selectedProductName: "",
    productCode: "",
    shippingNote: "", 
  });

  // Fetch seller's ordered products on component mount
  useEffect(() => {
    fetchSellerProducts();
  }, []);

  // Fetch order status when product code changes and showStatus is true
  useEffect(() => {
    if (trackingData.productCode && showStatus) {
      fetchOrderStatus(trackingData.productCode);
    } else {
      setOrderStatus(null);
    }
  }, [trackingData.productCode, showStatus]);

  const fetchSellerProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/seller/products/ordered-products');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error loading products');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderStatus = async (productCode: string) => {
    try {
      const response = await fetch(`/api/seller/orders/status?productCode=${encodeURIComponent(productCode)}`);
      const data = await response.json();
      
      if (data.success) {
        setOrderStatus(data.data);
      } else {
        toast.error('Failed to fetch order status');
        setOrderStatus(null);
      }
    } catch (error) {
      console.error('Error fetching order status:', error);
      toast.error('Error loading order status');
      setOrderStatus(null);
    }
  };

  const handleProductSelect = (product: Product) => {
    setTrackingData({
      ...trackingData,
      selectedProductName: product.name,
      productCode: product.code
    });
  };

  const handleSyncTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingData.selectedProductName) {
      return toast.error("Please select a product first");
    }
    setIsSyncing(true);
    setShowStatus(true);
    setTimeout(() => {
      toast.success("Info Synced!", { description: "Product tracking details updated." });
      setIsSyncing(false);
    }, 1500);
  };

  // Helper to make DB status look like human English and get color
  const formatStatus = (val: string) => {
    const formatted = val.charAt(0).toUpperCase() + val.slice(1);
    return { text: formatted, color: getStatusColor(val) };
  };

  // Get color based on status value
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      // Shipping colors
      case 'pending':
        return 'text-yellow-300';
      case 'shipped':
        return 'text-blue-300';
      case 'received':
        return 'text-green-300';
      
      // Buyer action colors
      case 'none':
        return 'text-gray-300';
      case 'delayed':
        return 'text-orange-300';
      case 'damaged':
        return 'text-red-300';
      
      // Payment colors
      case 'paid':
        return 'text-green-300';
      
      // Admin action colors
      case 'reviewed':
        return 'text-blue-300';
      case 'refunded':
        return 'text-red-300';
      
      default:
        return 'text-white';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 pb-32">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="mb-10">
              <Link href="/seller/orders" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-4">
                <ArrowLeft className="w-3 h-3" /> Back to Dispatch
              </Link>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                Product <span className="text-primary not-italic">Update</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Section: Form */}
              <div className="lg:col-span-7">
                <form onSubmit={handleSyncTracking} className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  
                  {/* 1st Input: Product Dropdown */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Package className="w-3 h-3" /> Select Product
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm font-bold flex items-center justify-between outline-none cursor-pointer hover:border-primary/50 transition-all">
                        <span>{trackingData.selectedProductName || "Choose product..."}</span>
                        <ChevronDown className="w-4 h-4 opacity-50" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-card border-border rounded-xl shadow-xl">
                        {isLoading ? (
                          <DropdownMenuItem disabled className="font-bold text-xs uppercase py-3">
                            Loading products...
                          </DropdownMenuItem>
                        ) : products.length === 0 ? (
                          <DropdownMenuItem disabled className="font-bold text-xs uppercase py-3">
                            No products found
                          </DropdownMenuItem>
                        ) : (
                          products.map((product) => (
                            <DropdownMenuItem 
                              key={product.id}
                              onClick={() => handleProductSelect(product)}
                              className="cursor-pointer font-bold text-xs uppercase py-3 focus:bg-primary focus:text-primary-foreground"
                            >
                              {product.name}
                            </DropdownMenuItem>
                          ))
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* 2nd Input: Product Code */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Hash className="w-3 h-3" /> Product Code
                    </label>
                    <input 
                      type="text" 
                      readOnly
                      placeholder="Automatic code..."
                      className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3.5 text-sm font-black text-primary outline-none italic"
                      value={trackingData.productCode}
                    />
                  </div>

                  {/* 3rd Input: Optional Note */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <StickyNote className="w-3 h-3" /> Shipping Note (Optional)
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Add any specific details about this item's shipment..."
                      className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-2 ring-primary/20 outline-none transition-all resize-none"
                      value={trackingData.shippingNote}
                      onChange={(e) => setTrackingData({...trackingData, shippingNote: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSyncing || !trackingData.selectedProductName}
                    className="w-full bg-foreground cursor-pointer text-background py-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl disabled:opacity-50"
                  >
                    {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Sync Update"}
                  </button>
                </form>
              </div>

              {/* Right Section: Status Board */}
              <div className="lg:col-span-5 space-y-6">
                {showStatus && (
                  <div className="bg-primary text-primary-foreground rounded-3xl p-6 shadow-2xl">
                    <h3 className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-6 flex items-center gap-2">
                      <Activity className="w-3 h-3" /> Order Status Overview
                    </h3>
                    
                    <div className="grid grid-cols-1">
                      {/* Shipping Status */}
                      <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black uppercase opacity-60 mb-1">Shipping</p>
                        <div className="flex items-center gap-3">
                          <Package className="w-4 h-4" />
                          <span className={`text-sm font-black uppercase italic tracking-wider ${formatStatus(orderStatus?.status.shipping || 'pending').color}`}>
                            {formatStatus(orderStatus?.status.shipping || 'pending').text}
                          </span>
                        </div>
                      </div>

                      {/* Buyer Action */}
                      <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black uppercase opacity-60 mb-1">Buyer Interaction</p>
                        <div className="flex items-center gap-3">
                          <UserCheck className="w-4 h-4" />
                          <span className={`text-sm font-black uppercase italic tracking-wider ${formatStatus(orderStatus?.status.buyerAction || 'none').color}`}>
                            {formatStatus(orderStatus?.status.buyerAction || 'none').text}
                          </span>
                        </div>
                      </div>

                      {/* Payment Status */}
                      <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black uppercase opacity-60 mb-1">Payment Status</p>
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-4 h-4" />
                          <span className={`text-sm font-black uppercase italic tracking-wider ${formatStatus(orderStatus?.status.payment || 'pending').color}`}>
                            {formatStatus(orderStatus?.status.payment || 'pending').text}
                          </span>
                        </div>
                      </div>

                      {/* Admin Review */}
                      <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black uppercase opacity-60 mb-1">Verification</p>
                        <div className="flex items-center gap-3">
                          <ShieldAlert className="w-4 h-4" />
                          <span className={`text-sm font-black uppercase italic tracking-wider ${formatStatus(orderStatus?.status.adminAction || 'none').color}`}>
                            {formatStatus(orderStatus?.status.adminAction || 'none').text}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* System Health - Always Visible */}
                <div className="bg-card border border-border rounded-3xl p-6">
                  <div className="flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-tight mb-1">System Health</h4>
                      <p className="text-[10px] text-muted-foreground font-medium leading-relaxed uppercase">
                        {showStatus 
                          ? "All statuses are verified by the admin panel. Ensure the product code matches your physical inventory before syncing."
                          : "Select a product and click 'Sync Update' to view order status overview."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <SellerNav />
      </div>
    </div>
  );
}