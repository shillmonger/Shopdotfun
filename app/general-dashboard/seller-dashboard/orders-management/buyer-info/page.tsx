"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowLeft,
  Package,
  Calendar,
  Hash,
  CheckCircle2,
  Truck,
  CreditCard,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

interface BuyerInfo {
  username: string;
  email: string;
  phoneNumber: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    isDefault: boolean;
  };
}

interface ProductInfo {
  productCode: string;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  images: Array<{
    url: string;
    thumbnailUrl: string;
    publicId: string;
  }>;
  description: string;
  stock: number;
  shippingFee: number;
  processingTime: string;
}

interface OrderData {
  orderId: string;
  buyerInfo: BuyerInfo;
  productInfo: ProductInfo;
  status: {
    shipping: string;
    buyerAction: string;
    payment: string;
    adminAction: string;
  };
  paymentInfo: {
    amount: number;
    cryptoMethodUsed: string;
    cryptoAmount: string;
    cryptoAddress: string;
    paymentId: string;
  };
  createdAt: string;
  updatedAt: string;
}

async function fetchOrderDetails(orderId: string): Promise<{ success: boolean; data?: OrderData; error?: string }> {
  try {
    const response = await fetch(`/api/seller/orders/${orderId}`);
    if (!response.ok) {
      return {
        success: false,
        error: "Failed to fetch order details",
      };
    }
    const result = await response.json();
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error fetching order details:", error);
    return { success: false, error: "Network error" };
  }
}

export default function BuyerInfoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is required");
      setLoading(false);
      return;
    }

    const fetchOrderData = async () => {
      try {
        const result = await fetchOrderDetails(orderId);
        if (result.success && result.data) {
          setOrderData(result.data);
        } else {
          setError(result.error || "Failed to load order data");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 pb-32">
            <div className="max-w-4xl mx-auto">
              <div className="py-16 bg-card border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                <Loader2 className="w-10 h-10 mb-3 animate-spin opacity-50" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">
                  Loading buyer information...
                </p>
              </div>
            </div>
          </main>
          <SellerNav />
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 pb-32">
            <div className="max-w-4xl mx-auto">
              <div className="py-16 bg-card border-2 border-dashed border-red-500/30 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-10 h-10 mb-3 text-red-500" />
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">
                  Error Loading Buyer Information
                </p>
                <p className="text-[9px] text-muted-foreground mb-4">{error}</p>
                <Link
                  href="/general-dashboard/seller-dashboard/orders-management"
                  className="px-6 py-3 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all"
                >
                  Back to Orders
                </Link>
              </div>
            </div>
          </main>
          <SellerNav />
        </div>
      </div>
    );
  }

  const { buyerInfo, productInfo, status, paymentInfo } = orderData;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SellerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 pb-32">
          <div className="max-w-6xl mx-auto">
            
            {/* Navigation & Header */}
            <div className="mb-10">
              <Link href="/general-dashboard/seller-dashboard/orders-management" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-4">
                <ArrowLeft className="w-3 h-3" /> Back to Orders
              </Link>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                Buyer{" "}
                <span className="text-primary tracking-normal not-italic">
                  INFO
                </span>
              </h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                <Hash className="w-3 h-3 text-primary" /> Order ID: {orderData.orderId}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Buyer Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                    <User className="w-4 h-4" /> Buyer Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Username</p>
                        <p className="text-sm font-black uppercase italic tracking-tighter">{buyerInfo.username}</p>
                      </div>
                      
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Email Address</p>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <p className="text-sm font-bold">{buyerInfo.email}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Phone Number</p>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <p className="text-sm font-bold">{buyerInfo.phoneNumber}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Shipping Address</p>
                        <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <p className="font-bold">{buyerInfo.shippingAddress.fullName}</p>
                              <p className="text-sm">{buyerInfo.shippingAddress.phone}</p>
                              <p className="text-sm">{buyerInfo.shippingAddress.street}</p>
                              <p className="text-sm">{buyerInfo.shippingAddress.city}, {buyerInfo.shippingAddress.state}</p>
                              <p className="text-sm">{buyerInfo.shippingAddress.country}</p>
                              {buyerInfo.shippingAddress.isDefault && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded-full">
                                  <CheckCircle2 className="w-3 h-3" /> Default Address
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Status */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Order Status
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="w-4 h-4 text-blue-500" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Shipping</p>
                      </div>
                      <p className="font-black uppercase italic">{status.shipping}</p>
                    </div>
                    
                    <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4 text-green-500" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Payment</p>
                      </div>
                      <p className="font-black uppercase italic">{status.payment}</p>
                    </div>
                    
                    <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-500" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Buyer Action</p>
                      </div>
                      <p className="font-black uppercase italic">{status.buyerAction}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product & Payment Summary */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                    <Package className="w-4 h-4" /> Product Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      {productInfo.images && productInfo.images.length > 0 && (
                        <img
                          src={productInfo.images[0].thumbnailUrl}
                          alt={productInfo.name}
                          className="w-16 h-16 rounded-lg object-cover border border-border"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-xs font-black uppercase italic tracking-tighter line-clamp-2">{productInfo.name}</p>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase mt-1 tracking-tight">
                          ID: {productInfo.productCode}
                        </p>
                        <p className="text-[9px] text-muted-foreground mt-1">
                          Qty: {productInfo.quantity} × ${productInfo.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Subtotal</span>
                        <span className="font-black">${(productInfo.price * productInfo.quantity).toFixed(2)}</span>
                      </div>
                      {productInfo.discount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase tracking-widest text-green-600">Discount</span>
                          <span className="font-black text-green-600">-{productInfo.discount}%</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Shipping</span>
                        <span className="font-black">${productInfo.shippingFee.toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t border-border flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest">Total</span>
                        <span className="text-lg font-black italic">${paymentInfo.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Payment Info
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Method</p>
                      <p className="font-bold uppercase">{paymentInfo.cryptoMethodUsed.toUpperCase()}</p>
                    </div>
                    
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Crypto Amount</p>
                      <p className="font-bold font-mono text-sm">{paymentInfo.cryptoAmount}</p>
                    </div>
                    
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Payment ID</p>
                      <p className="font-mono text-xs text-muted-foreground">{paymentInfo.paymentId}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-2xl p-4 border border-border/50">
                  <div className="flex items-center gap-2 text-[9px] font-bold leading-relaxed uppercase tracking-tighter text-muted-foreground">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <div>
                      <p>Order placed: {new Date(orderData.createdAt).toLocaleDateString()}</p>
                      <p>Last updated: {new Date(orderData.updatedAt).toLocaleDateString()}</p>
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